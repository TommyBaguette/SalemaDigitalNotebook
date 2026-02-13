<template>
  <div class="card-container">
    <h3>📜 Histórico de Partidas</h3>
    
    <div v-if="loading" class="loading">A carregar arquivo...</div>
    
    <div v-else class="history-list">
      <div v-for="game in games" :key="game.gameId" class="game-card">
        
        <div class="card-header">
          <span class="game-id">Jogo #{{ game.displayId }}</span>
          <span class="game-date">{{ formatarData(game.createdAt) }}</span>
        </div>

        <div class="status-bar" :class="game.status === 'FINISHED' ? 'finished' : 'active'">
          {{ game.status === 'FINISHED' ? 'Terminado' : 'Cancelado' }}
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
    let listaBruta = data.history || [];

    listaBruta.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    listaBruta.forEach((g, index) => {
      g.displayId = index + 1; 
    });

    games.value = listaBruta.reverse();

  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

function formatarData(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' });
}
</script>

<style scoped>
.card-container { max-width: 600px; margin: 0 auto; padding-bottom: 80px; }
h3 { text-align: center; color: #42b983; margin-bottom: 20px; }
.loading { text-align: center; color: #888; margin-top: 50px;}

.history-list { display: flex; flex-direction: column; gap: 15px; }

.game-card { 
  background: #2d2d2d; border-radius: 12px; padding: 15px; 
  border: 1px solid #444; box-shadow: 0 4px 6px rgba(0,0,0,0.2); 
}

.card-header { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 1.1rem; color: #fff; font-weight: bold; }
.game-id { color: #fff; }
.game-date { color: #888; font-size: 0.9rem; font-weight: normal; }

.status-bar { 
  font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; font-weight: bold; color: #aaa;
}
.finished { color: #e74c3c; }

.players-grid { 
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; 
  background: #222; padding: 10px; border-radius: 8px; 
}
.player-mini { display: flex; flex-direction: column; align-items: center; }
.p-name { font-size: 0.7rem; color: #aaa; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 100%; margin-bottom: 2px;}
.p-score { font-weight: bold; font-size: 1.1rem; color: white; }
.loser { color: #e74c3c; }
</style>