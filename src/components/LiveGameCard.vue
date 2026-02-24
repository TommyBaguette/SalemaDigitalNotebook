<template>
  <div class="live-card" :class="{ 'expanded': isExpanded }" @click="toggleExpand">
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

    <div class="game-details" v-if="isExpanded && game.rounds && game.rounds.length > 0" @click.stop>
      <table class="rounds-table">
        <thead>
          <tr>
            <th>#</th>
            <th v-for="p in game.players" :key="p">{{ p }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="round in getAcumulado(game)" :key="round.roundNumber">
            <tr>
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
          </template>
        </tbody>
      </table>
    </div>

    <div class="expand-icon" v-if="game.rounds && game.rounds.length > 0">
      {{ isExpanded ? '▲' : '▼' }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  game: {
    type: Object,
    required: true
  }
});

const isExpanded = ref(false);

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function getAcumulado(game) {
  if (!game || !game.rounds) return [];
  
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
</script>

<style scoped>
.live-card {
  background: rgba(5, 15, 25, 0.85); 
  border: 2px solid #4CC9F0; 
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.live-card.expanded {
  box-shadow: 0 8px 25px rgba(76, 201, 240, 0.4);
}

.card-top { 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 15px; 
  align-items: center;
}

.location { font-weight: bold; color: #4CC9F0; }

.badge { 
  background: #ef476f; 
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

.live-scoreboard { display: flex; justify-content: space-between; gap: 10px; }
.player-stat { display: flex; flex-direction: column; align-items: center; flex: 1; }
.p-name { color: #4CC9F0; font-size: 0.85rem; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }
.p-score { color: #ffffff; font-size: 1.4rem; font-weight: bold; }
.p-score.danger { color: #ef476f; }

.last-update { 
  text-align: center; color: #888; font-size: 0.75rem; margin-top: 15px; 
}

.game-details { 
  background: #0a1622; padding: 15px; border-radius: 8px;
  border-top: 2px solid #4CC9F0; margin-top: 10px;
  animation: fadeIn 0.3s; 
  cursor: default;
}

@keyframes fadeIn { 
  from { opacity: 0; transform: translateY(-5px); } 
  to { opacity: 1; transform: translateY(0); } 
}

.rounds-table { width: 100%; border-collapse: collapse; text-align: center; }
.rounds-table th { color: #4CC9F0; padding: 8px 4px; border-bottom: 2px solid rgba(0, 0, 0, 0.1); font-weight: bold; font-size: 0.85rem; text-transform: uppercase; }
.rounds-table td { padding: 8px 4px; border-bottom: 1px solid rgba(0, 0, 0, 0.05); color: #ffffff; font-size: 0.95rem; font-weight: 500; }
.r-idx { color: #888; font-size: 0.85rem; font-weight: bold; }

.score-cell { position: relative; display: inline-block; min-width: 20px; }
.score-value { z-index: 1; position: relative; }

.hero-scribble {
  background: repeating-linear-gradient(135deg, #d5d8dd, #cbd5e1 3px, #94a3b8 3px, #94a3b8 5px);
  color: transparent; border: 1px solid #94a3b8; border-radius: 4px; padding: 1px 5px; font-weight: bold; display: inline-block;
}

.salema-star { position: absolute; top: -5px; right: -8px; color: #E63946; font-weight: bold; font-size: 1rem; line-height: 1; }

.expand-icon { 
  text-align: center; 
  color: #888; 
  font-size: 0.8rem; 
  margin-top: 10px; 
  padding-bottom: 5px; 
}
</style>