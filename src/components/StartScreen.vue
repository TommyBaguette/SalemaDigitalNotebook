<template>
  <div class="card">
    <h3>Quem vai jogar hoje?</h3>
    <div class="name-inputs">
      <div v-for="(nome, index) in nomes" :key="index" class="input-group">
        <label>Jogador {{ index + 1 }}</label>
        <input v-model="nomes[index]" placeholder="Nome..." maxlength="12">
      </div>
    </div>
    <button @click="iniciar" :disabled="loading || !nomesValidos" class="btn-primary">
      {{ loading ? 'A criar...' : 'Começar a Partida ' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { apiCreateGame } from '../services/api';

const emit = defineEmits(['game-started']);
const nomes = ref(["", "", "", "", ""]);
const loading = ref(false);

const nomesValidos = computed(() => nomes.value.every(n => n.trim().length > 0));

async function iniciar() {
  loading.value = true;
  try {
    const dados = await apiCreateGame(nomes.value);
    emit('game-started', dados.game); 
  } catch (e) {
    alert("Erro ao criar jogo");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.card { background: #2d2d2d; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
.name-inputs { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
input { padding: 12px; background: #444; border: 1px solid #555; color: white; border-radius: 6px; width: 100%; box-sizing: border-box;}
.btn-primary { width: 100%; padding: 15px; background: #42b983; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
.btn-primary:disabled { background: #444; color: #666; cursor: not-allowed; }
</style>