<template>
  <div class="history-container">
    <h3>Histórico de Jogos</h3>

    <div class="month-selector">
      <input type="month" v-model="mesSelecionado" @change="carregarDados">
    </div>

    <div v-if="loading" class="loading">A carregar...</div>
    
    <div v-else-if="jogos.length === 0" class="empty">
      Ainda não há jogos terminados.
    </div>

    <div v-else class="games-list">
      <HistoryGameCard 
        v-for="game in jogos" 
        :key="game.gameId" 
        :game="game" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiGetHistory } from '../services/api';
import HistoryGameCard from '../components/HistoryGameCard.vue';

const jogos = ref([]);
const loading = ref(false);
const mesSelecionado = ref(new Date().toISOString().slice(0, 7));

async function carregarDados() {
  loading.value = true;
  try {
    // Usamos apiGetHistory porque apiGetGames não existe no teu api.js
    const data = await apiGetHistory(mesSelecionado.value);
    jogos.value = data.history || [];
  } catch (e) {
    console.error("Erro no histórico:", e);
  } finally {
    loading.value = false;
  }
}

onMounted(carregarDados);
</script>

<style scoped>
.history-container { padding: 10px; padding-bottom: 80px; max-width: 600px; margin: 0 auto; }
h3 { text-align: center; color: #4CC9F0; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px; }
.month-selector { text-align: center; margin-bottom: 20px; }
.month-selector input { background: #1a1a1a; color: white; border: 1px solid #333; padding: 5px 10px; border-radius: 10px; }
.games-list { display: flex; flex-direction: column; gap: 15px; }
.loading, .empty { text-align: center; color: #888; margin-top: 40px; }
</style>