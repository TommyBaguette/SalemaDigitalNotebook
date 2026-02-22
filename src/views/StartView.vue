<script setup>
import { ref, onMounted } from 'vue';
import { useGameStore } from '../stores/game'; 

const store = useGameStore();
const selecionados = ref([]);
const localDoJogo = ref('');
const locaisDisponiveis = ['Carpe', 'Gota', 'Casa do Povo', 'Biblioteca'];

onMounted(() => {
  store.fetchPlayers(); 
});

function toggleJogador(nome) {
  if (selecionados.value.includes(nome)) {
    selecionados.value = selecionados.value.filter(n => n !== nome);
  } else {
    if (selecionados.value.length < 5) selecionados.value.push(nome);
  }
}

function setLocal(local) {
  localDoJogo.value = local;
}

async function iniciar() {
  await store.startGame(selecionados.value, localDoJogo.value);
}
</script>

<template>
  <div class="card">
    <h3>Quem vai a jogo?</h3>
    <p class="subtitle">Seleciona 5 jogadores ({{ selecionados.length }}/5)</p>

    <div v-if="store.loading" class="loading-text">A carregar...</div>

    <div v-else class="chips-container">
      <button 
        v-for="nome in store.playersList" 
        :key="nome"
        @click="toggleJogador(nome)"
        class="chip"
        :class="{ 'selected': selecionados.includes(nome) }"
        :disabled="selecionados.length >= 5 && !selecionados.includes(nome)"
      >
        {{ nome }}
      </button>
    </div>

    <div v-if="selecionados.length === 5">
      <h3 style="margin-top: 30px;">Onde é o jogo?</h3>
      <p class="subtitle">Seleciona o local</p>
      
      <div class="chips-container">
        <button 
          v-for="local in locaisDisponiveis" 
          :key="local"
          @click="setLocal(local)"
          class="chip"
          :class="{ 'selected': localDoJogo === local }"
        >
          {{ local }}
        </button>
      </div>
    </div>

    <button 
      @click="iniciar" 
      :disabled="store.loading || selecionados.length !== 5 || localDoJogo === ''" 
      class="btn-primary"
      style="margin-top: 20px;"
    >
      {{ store.loading ? 'A criar...' : 'Começar Jogo' }}
    </button>
  </div>
</template>

<style scoped>
.card { background: #2d2d2d; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
h3 { margin-bottom: 5px; text-align: center; color: #42b983; }
.subtitle { text-align: center; color: #888; font-size: 0.9rem; margin-bottom: 20px; }
.chips-container { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 20px; }
.chip { background: #444; color: #ddd; border: 1px solid #555; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 0.9rem; transition: 0.2s; }
.chip:hover { background: #555; }
.chip.selected { background: #42b983; color: white; border-color: #42b983; font-weight: bold; box-shadow: 0 0 10px rgba(66, 185, 131, 0.4); }
.chip:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { width: 100%; padding: 15px; background: #42b983; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1.1rem; }
.btn-primary:disabled { background: #444; color: #888; cursor: not-allowed; }
.loading-text { text-align: center; color: #888; margin: 20px 0; }
</style>