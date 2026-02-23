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
  /* Fundo escuro condizente com o histórico */
  background: rgba(5, 15, 25, 0.85); 
  border: 2px solid #4CC9F0; /* Borda brilhante para destacar que está AO VIVO */
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.2);
}

.card-top { 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 15px; 
  align-items: center;
}

.location { 
  font-weight: bold; 
  color: #4CC9F0; /* Cor do tema */
}

.badge { 
  background: #ef476f; /* Vermelho vivo para o "AO VIVO" */
  color: white; 
  padding: 4px 10px; 
  border-radius: 6px; 
  font-size: 0.75rem; 
  font-weight: bold;
  letter-spacing: 1px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.live-scoreboard {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.player-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.p-name { 
  color: #4CC9F0;
  font-size: 0.85rem; 
  font-weight: bold;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.p-score { 
  color: #ffffff;
  font-size: 1.4rem; 
  font-weight: bold; 
}

.p-score.danger { 
  color: #ef476f;
}

.last-update { 
  text-align: center; 
  color: #888; 
  font-size: 0.75rem; 
  margin-top: 15px;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 10px;
}
</style>