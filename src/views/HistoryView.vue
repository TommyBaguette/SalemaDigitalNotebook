<template>
  <div class="history-container">
    <h3>Histórico de Jogos</h3>

    <div v-if="store.loading" class="loading">A carregar...</div>
    
    <div v-else-if="!store.history || store.history.length === 0" class="empty">
      Ainda não há jogos terminados.
    </div>

    <div v-else class="games-list">
      <HistoryGameCard 
        v-for="game in store.history" 
        :key="game.gameId" 
        :game="game" 
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useGameStore } from '../stores/game';
import { apiGetHistory } from '../services/api';
import HistoryGameCard from '../components/HistoryGameCard.vue';

const store = useGameStore();

onMounted(async () => {
  try {
    const data = await apiGetHistory();
    store.history = data.history || [];
  } catch (e) {
    console.error("Erro history", e);
  }
});
</script>

<style scoped>
.history-container { padding: 10px; padding-bottom: 80px; }
h3 { text-align: center; color: #42b983; margin-bottom: 20px; }
.loading, .empty { text-align: center; color: #888; margin-top: 40px; }
</style>