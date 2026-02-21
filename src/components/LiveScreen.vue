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
      <div v-for="game in store.activeGames" :key="game.gameId" class="live-card">
        <div class="card-top">
          <span class="location">📍 {{ game.location || 'Local desconhecido' }}</span>
          <span class="badge">AO VIVO</span>
        </div>
        
        <div class="live-scoreboard">
          <div v-for="(p, i) in game.players" :key="i" class="player-stat">
            <span class="p-name">{{ p }}</span>
            <span class="p-score" :class="{'danger': game.currentTotals[i] >= 80}">
              {{ game.currentTotals[i] }}
            </span>
          </div>
        </div>
        
        <p class="last-update">Ronda atual: {{ game.rounds.length + 1 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();
let timer = null;

onMounted(() => {
  store.fetchActiveGames();
  
  timer = setInterval(() => {
    store.fetchActiveGames();
  }, 5000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.live-container { padding: 20px; padding-bottom: 80px; }
.live-header { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px; }
.live-header h3 { color: #42b983; margin: 0; }
.pulse-icon {
  width: 12px; height: 12px; background: #e74c3c; border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
}

.live-card {
  background: #2d2d2d; border: 2px solid #42b983; border-radius: 12px;
  padding: 15px; margin-bottom: 20px;
}

.card-top { display: flex; justify-content: space-between; margin-bottom: 15px; }
.location { font-weight: bold; color: #ddd; }
.badge { background: #e74c3c; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; }

.live-scoreboard { display: flex; justify-content: space-between; text-align: center; }
.player-stat { display: flex; flex-direction: column; width: 18%; }
.p-name { font-size: 0.7rem; color: #aaa; margin-bottom: 5px; overflow: hidden; text-overflow: ellipsis; }
.p-score { font-size: 1.2rem; font-weight: bold; color: white; }
.danger { color: #f39c12; }

.last-update { text-align: center; font-size: 0.8rem; color: #666; margin-top: 15px; }
.empty-state { text-align: center; color: #666; margin-top: 50px; }
</style>