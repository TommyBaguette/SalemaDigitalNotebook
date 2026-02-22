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
.live-container { padding: 20px; padding-bottom: 80px; }
.live-header { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px; }
.live-header h3 { color: #42b983; margin: 0; }
.pulse-icon { width: 12px; height: 12px; background: #e74c3c; border-radius: 50%; animation: pulse 1.5s infinite; }

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
}

.empty-state { text-align: center; color: #666; margin-top: 50px; }
</style>