<template>
  <div class="history-container">
    <h3>Histórico de Jogos</h3>

    <div v-if="store.loading" class="loading">A carregar...</div>
    
    <div v-else-if="!store.history || store.history.length === 0" class="empty">
      Ainda não há jogos terminados.
    </div>

    <div v-else class="games-list">
      <div 
        v-for="game in store.history" 
        :key="game.gameId" 
        class="game-card"
        :class="{ 'expanded': expandedId === game.gameId }"
        @click="toggleExpand(game.gameId)"
      >
        <div class="game-header">
          <div class="header-left">
            <span class="date">{{ formatDate(game.createdAt) }}</span>
            <span class="game-id">#{{ game.gameId }}</span>
          </div>
          
          <div class="loser-badge" v-if="getLosers(game).length > 0">
             {{ getLosers(game).join(', ') }}
          </div>
        </div>

        <div class="mini-scores" v-if="expandedId !== game.gameId">
          <span v-for="(p, i) in game.players" :key="i" class="mini-score-item" :class="{ 'is-loser': game.currentTotals[i] >= 100 }">
            {{ p }}: <strong>{{ game.currentTotals[i] }}</strong>
          </span>
        </div>

        <div v-if="expandedId === game.gameId" class="game-details" @click.stop>
          <div class="details-divider"></div>
          
          <table class="rounds-table">
            <thead>
              <tr>
                <th>#</th>
                <th v-for="p in game.players" :key="p">{{ p.slice(0,3) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="round in game.rounds" :key="round.roundNumber">
                <td class="r-idx">{{ round.roundNumber }}</td>
                <td v-for="(s, i) in round.scores" :key="i">
                  
                  <div class="score-cell">
                    <span :class="{ 'hero-scribble': round.isCleanSweep && s === 0 }">
                      {{ s }}
                    </span>
                    
                    <sup v-if="i === round.salemaIndex || (round.isCleanSweep && s === 20)" 
                          class="salema-star">*</sup>
                  </div>

                </td>
              </tr>
              <tr class="total-row">
                <td>=</td>
                <td v-for="(total, i) in game.currentTotals" :key="i" :class="{ 'red-text': total >= 100 }">
                  {{ total }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="expand-icon">
          {{ expandedId === game.gameId ? '▲' : '▼' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGameStore } from '../stores/game';
import { apiGetHistory } from '../services/api';

const store = useGameStore();
const expandedId = ref(null);

onMounted(async () => {
  try {
    const data = await apiGetHistory();
    store.history = data.history || [];
  } catch (e) {
    console.error("Erro history", e);
  }
});

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }) + 
         ' ' + date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute:'2-digit' });
}

function getLosers(game) {
  const losers = [];
  const totals = game.currentTotals;
  game.players.forEach((player, index) => {
    if (totals[index] >= 100) losers.push(player);
  });
  return losers;
}
</script>

<style scoped>
.history-container { padding: 10px; padding-bottom: 80px; }
h3 { text-align: center; color: #42b983; margin-bottom: 20px; }

.game-card {
  background: #2d2d2d; border-radius: 12px; margin-bottom: 15px;
  padding: 15px; cursor: pointer; transition: all 0.2s;
  border: 1px solid #444; position: relative;
}
.game-card.expanded { background: #333; border-color: #e74c3c; }

.game-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.header-left { display: flex; flex-direction: column; }
.date { font-size: 0.8rem; color: #aaa; }
.game-id { font-size: 0.7rem; color: #666; }

.loser-badge { 
  background: #3a1d1d; color: #ff6b6b; border: 1px solid #c0392b;
  padding: 4px 10px; border-radius: 12px; font-weight: bold; font-size: 0.8rem; 
}

.mini-scores { display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.8rem; color: #ccc; margin-top: 5px; }
.mini-score-item { background: #222; padding: 2px 6px; border-radius: 4px; }
.mini-score-item.is-loser { color: #e74c3c; border: 1px solid #e74c3c; }

.game-details { margin-top: 15px; animation: fadeIn 0.3s; cursor: default; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

.details-divider { height: 1px; background: #444; margin-bottom: 10px; }

.rounds-table { width: 100%; border-collapse: collapse; text-align: center; font-size: 0.9rem; }
.rounds-table th { color: #888; padding: 4px; border-bottom: 1px solid #555; font-weight: normal; font-size: 0.8rem; }
.rounds-table td { padding: 8px 4px; border-bottom: 1px solid #444; color: #ddd; vertical-align: middle; }
.r-idx { color: #555; font-size: 0.7rem; }

.score-cell { position: relative; display: inline-block; min-width: 20px; }
.salema-star {
  position: absolute; top: -5px; right: -8px;
  color: #e74c3c; font-weight: bold; font-size: 1rem;
  line-height: 1;
}

.hero-scribble {
  background: repeating-linear-gradient(135deg, #444, #444 3px, #777 3px, #777 5px);
  color: transparent; 
  border: 1px solid #555;
  border-radius: 4px;
  padding: 1px 5px; 
  font-weight: bold;
  display: inline-block;
}

.total-row td { border-top: 2px solid #555; font-weight: bold; color: white; padding-top: 10px; }
.total-row .red-text { color: #e74c3c; }

.expand-icon { text-align: center; color: #555; font-size: 0.8rem; margin-top: 5px; }
.loading, .empty { text-align: center; color: #888; margin-top: 40px; }
</style>