<template>
  <div class="live-container">
    <div class="live-header">
      <div class="pulse-icon"></div>
      <h3>Jogos em Direto</h3>
    </div>

    <div v-if="store.activeGames.length === 0" class="empty-state">
      <p>Nenhum jogo a decorrer de momento.</p>
    </div>

    <div v-else class="games-list">
      <LiveGameCard 
        v-for="game in store.activeGames" 
        :key="game.gameId" 
        :game="game" 
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../stores/game';
import LiveGameCard from '../components/LiveGameCard.vue';

const store = useGameStore();
let timer = null;

onMounted(() => {
  store.fetchActiveGames();
  timer = setInterval(() => { store.fetchActiveGames(); }, 5000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.live-container { 
  padding: 10px; 
  padding-bottom: 80px; 
  max-width: 600px; 
  margin: 0 auto; 
}

h3 { 
  text-align: center; 
  color: #4CC9F0; 
  margin-bottom: 25px; 
  text-transform: uppercase; 
  letter-spacing: 2px;
  font-weight: bold;
}

.no-games {
  text-align: center;
  color: #888;
  padding: 40px 20px;
  background: rgba(5, 15, 25, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
}
</style>