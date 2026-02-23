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
  <div class="card" v-if="!store.currentGame">
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
.card { 
  background: rgba(5, 15, 25, 0.85); 
  padding: 25px 20px; 
  border-radius: 16px; 
  margin-bottom: 20px; 
  border: 1px solid rgba(76, 201, 240, 0.15);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

h3 { 
  margin-bottom: 5px; 
  text-align: center; 
  color: #4CC9F0; 
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 800;
}

.subtitle { 
  text-align: center; 
  color: #888; 
  font-size: 0.9rem; 
  margin-bottom: 25px; 
}

.chips-container { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 10px; 
  justify-content: center; 
  margin-bottom: 25px; 
}

.chip { 
  background: rgba(255, 255, 255, 0.05); 
  color: #ffffff; 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  padding: 10px 18px; 
  border-radius: 20px; 
  cursor: pointer; 
  font-size: 0.95rem; 
  font-weight: bold;
  transition: all 0.3s ease; 
}

.chip:hover:not(:disabled) { 
  background: rgba(76, 201, 240, 0.1); 
  border-color: rgba(76, 201, 240, 0.3);
}

.chip.selected { 
  background: rgba(76, 201, 240, 0.2); 
  color: #4CC9F0; 
  border-color: #4CC9F0; 
  box-shadow: 0 0 15px rgba(76, 201, 240, 0.3); 
}

.chip:disabled { 
  opacity: 0.3; 
  cursor: not-allowed; 
  filter: grayscale(100%);
}

.btn-primary { 
  width: 100%; 
  padding: 18px; 
  background: #4CC9F0; 
  color: #0a1622;
  border: none; 
  border-radius: 12px; 
  font-weight: 900; 
  cursor: pointer; 
  font-size: 1.2rem; 
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 8px 20px rgba(76, 201, 240, 0.3);
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-primary:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 4px 10px rgba(76, 201, 240, 0.2);
}

.btn-primary:disabled { 
  background: rgba(255, 255, 255, 0.1); 
  color: #555; 
  cursor: not-allowed; 
  box-shadow: none;
}

.loading-text { 
  text-align: center; 
  color: #4CC9F0; 
  margin: 30px 0; 
  font-weight: bold;
  animation: pulse 1.5s infinite;
}

@keyframes pulse { 
  0% { opacity: 1; } 
  50% { opacity: 0.5; } 
  100% { opacity: 1; } 
}
</style>