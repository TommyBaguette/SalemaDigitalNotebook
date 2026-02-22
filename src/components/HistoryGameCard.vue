<template>
  <div 
    class="game-card"
    :class="{ 'expanded': isExpanded }"
    @click="toggleExpand"
  >
    <div class="game-header">
      <div class="header-left">
       <span class="date">{{ formatDate(game.createdAt) }}</span>
       <span class="game-id">#{{ game.gameId }} • {{ game.location || 'Não definido' }}</span>
      </div>
      
      <div class="loser-badge" v-if="getLosers(game).length > 0">
         {{ getLosers(game).join(', ') }}
      </div>
    </div>

    <div class="mini-scores" v-if="!isExpanded">
      <span v-for="(p, i) in game.players" :key="i" class="mini-score-item" :class="{ 'is-loser': game.currentTotals[i] >= 100 }">
        {{ p }}: <strong>{{ game.currentTotals[i] }}</strong>
      </span>
    </div>

    <div v-if="isExpanded" class="game-details" @click.stop>
      <table class="rounds-table">
        <thead>
          <tr>
            <th>#</th>
            <th v-for="p in game.players" :key="p">{{ p }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="round in getAcumulado(game)" :key="round.roundNumber">
            <td class="r-idx">{{ round.roundNumber }}</td>
            
            <td v-for="(totalJogador, i) in round.totaisNaAltura" :key="i">
              
              <div class="score-cell" :class="{ 'hero-scribble': round.isCleanSweep && round.pontosNestaRonda[i] === 0 }">
                <span class="score-value">
                  {{ round.pontosNestaRonda[i] === 0 ? '-' : totalJogador }}
                </span>
                <sup v-if="i === round.salemaIndex || (round.isCleanSweep && round.pontosNestaRonda[i] === 20)" class="salema-star">*</sup>
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
      {{ isExpanded ? '▲' : '▼' }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
});

const isExpanded = ref(false);

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }) + 
         ' ' + date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute:'2-digit' });
}

function getAcumulado(game) {
  let totais = new Array(game.players.length).fill(0); 
  return game.rounds.map(ronda => {
    const novosTotais = totais.map((ant, i) => ant + ronda.scores[i]);
    totais = novosTotais;
    return {
      ...ronda,
      totaisNaAltura: novosTotais,
      pontosNestaRonda: ronda.scores
    };
  });
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
.game-card {
  background: rgba(10, 25, 40, 0.6);
  border: 1px solid rgba(76, 201, 240, 0.2);
  border-radius: 12px; margin-bottom: 15px;
  position: relative; cursor: pointer; transition: all 0.2s;
}
.game-card.expanded {
  border-color: var(--primary-teal, #4cc9f0);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}

.game-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 15px 5px 15px; }
.header-left { display: flex; flex-direction: column; }
.date { font-size: 0.9rem; color: var(--primary-teal, #4cc9f0); font-weight: bold; }
.game-id { font-size: 0.8rem; color: #888; margin-top: 2px; }

.loser-badge { 
  background: rgba(239, 71, 111, 0.15); color: #ef476f; border: 1px solid rgba(239, 71, 111, 0.3);
  padding: 4px 10px; border-radius: 12px; font-weight: bold; font-size: 0.85rem; 
}

.mini-scores { 
  display: flex; 
  flex-wrap: nowrap; 
  justify-content: space-between; 
  gap: 4px; 
  padding: 10px 15px 15px 15px; 
  overflow-x: auto;
}
.mini-score-item { 
  background: rgba(0, 0, 0, 0.4); color: #fff; padding: 4px 6px; border-radius: 6px; 
  font-size: 0.85rem; border: 1px solid #444; white-space: nowrap; 
}
.mini-score-item.is-loser { color: #ef476f; border-color: #ef476f; }

.game-details { 
  background: #F0F8FF; padding: 15px; border-top: 2px solid var(--primary-teal, #4cc9f0); 
  animation: fadeIn 0.3s; cursor: default; 
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

.rounds-table { width: 100%; border-collapse: collapse; text-align: center; }
.rounds-table th { color: #005F73; padding: 8px 4px; border-bottom: 2px solid rgba(0, 0, 0, 0.1); font-weight: bold; font-size: 0.9rem; text-transform: uppercase; }
.rounds-table td { padding: 10px 4px; border-bottom: 1px solid rgba(0, 0, 0, 0.05); color: #0B253A; font-size: 1rem; font-weight: 500; }
.r-idx { color: #4A5568; font-size: 0.85rem; font-weight: bold; }

.score-cell { position: relative; display: inline-block; min-width: 20px; }
.score-value { z-index: 1; position: relative; }

.hero-scribble {
  background: repeating-linear-gradient(135deg, #d5d8dd, #cbd5e1 3px, #94a3b8 3px, #94a3b8 5px);
  color: transparent; border: 1px solid #94a3b8; border-radius: 4px; 
  padding: 1px 5px; font-weight: bold; display: inline-block;
}

.salema-star { position: absolute; top: -5px; right: -8px; color: #E63946; font-weight: bold; font-size: 1rem; line-height: 1; }

.total-row td { border-top: 2px solid #005F73; font-weight: bold; color: #0B253A; padding-top: 10px; }
.total-row .red-text { color: #E63946; }

.expand-icon { text-align: center; color: #888; font-size: 0.8rem; margin-top: 5px; padding-bottom: 8px; }
</style>