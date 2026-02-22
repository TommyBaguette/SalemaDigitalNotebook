<template>
  <div class="live-card">
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
    
    <p class="last-update">Ronda atual: {{ game.rounds ? game.rounds.length + 1 : 1 }}</p>
  </div>
</template>

<script setup>
defineProps({
  game: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.live-card {
  background: #2d2d2d; border: 2px solid #42b983; border-radius: 12px;
  padding: 15px; margin-bottom: 20px;
}
.card-top { display: flex; justify-content: space-between; margin-bottom: 15px; }
.location { font-weight: bold; color: #ddd; }
.badge { background: #e74c3c; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; }

.live-scoreboard { display: flex; justify-content: space-between; text-align: center; }
.player-stat { display: flex; flex-direction: column; width: 18%; }
.p-name { font-size: 0.7rem; color: #aaa; margin-bottom: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.p-score { font-size: 1.2rem; font-weight: bold; color: white; }
.danger { color: #f39c12; }

.last-update { text-align: center; font-size: 0.8rem; color: #666; margin-top: 15px; }
</style>