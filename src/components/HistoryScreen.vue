<template>
  <div class="card-container">
    <h3>📜 Histórico de Partidas</h3>
    
    <div v-if="loading" class="loading">A carregar arquivo...</div>
    
    <div v-else class="history-list">
      <div v-for="game in games" :key="game.gameId" class="game-card">
        
        <div class="card-header">
          <span class="game-id">Jogo #{{ game.gameId }}</span>
          <span class="game-date">{{ formatarData(game.createdAt) }}</span>
        </div>

        <div class="status-bar" :class="game.status === 'FINISHED' ? 'finished' : 'active'">
          {{ game.status === 'FINISHED' ? '🏁 Terminado' : '🟢 A Decorrer' }}
        </div>

        <div class="players-grid">
          <div v-for="(player, i) in game.players" :key="player" class="player-mini">
            <span class="p-name">{{ player }}</span>
            <span class="p-score" :class="{'loser': game.currentTotals[i] >= 100}">
              {{ game.currentTotals[i] }}
              <span v-if="game.currentTotals[i] >= 100">💀</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiGetHistory } from '../services/api';

const games = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await apiGetHistory();
    games.value = data.history || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

function formatarData(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' });
}
</script>

<style scoped>
.card-container { max-width: 600px; margin: 0 auto; }
h3 { text-align: center; color: #42b983; margin-bottom: 20px; }
.loading { text-align: center; color: #888; }

.history-list { display: flex; flex-direction: column; gap: 15px; }

/* Estilo do Cartão */
.game-card { 
  background: #2d2d2d; border-radius: 10px; padding: 15px; 
  border: 1px solid #444; box-shadow: 0 4px 6px rgba(0,0,0,0.2); 
}

.card-header { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem; color: #aaa; font-weight: bold; }
.game-id { color: #fff; }

.status-bar { 
  font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; font-weight: bold; 
}
.active { color: #42b983; }
.finished { color: #e74c3c; }

/* Grid de Jogadores Miniatura */
.players-grid { 
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; 
  background: #222; padding: 8px; border-radius: 6px; 
}
.player-mini { display: flex; flex-direction: column; align-items: center; }
.p-name { font-size: 0.7rem; color: #ccc; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 100%; }
.p-score { font-weight: bold; font-size: 0.9rem; margin-top: 2px; }
.loser { color: #e74c3c; }
</style>