<template>
  <div class="game-screen" v-if="game">
    
    <div class="fixed-header">
      <div class="top-bar">
        <span class="game-id">Game #{{ game.gameId }}</span>
        <button @click="showExitConfirm = true" class="btn-text">Sair</button>
      </div>
      <div class="scoreboard-summary">
        <div v-for="(p, i) in game.players" :key="i" class="player-score-box">
          <span class="p-name">{{ p }}</span>
          <span class="p-total" :class="{'danger': game.currentTotals[i] >= 80, 'eliminated': game.currentTotals[i] >= 100}">
            {{ game.currentTotals[i] }}
          </span>
        </div>
      </div>
    </div>

    <div class="history-container">
      <table class="history-table">
        <thead>
          <tr>
            <th class="round-col">Rondas</th>
            <th v-for="p in game.players" :key="p" class="player-header">
              {{ p }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, rIndex) in historicoAcumulado" :key="rIndex">
            <td class="round-num">{{ rIndex + 1 }}</td>
            <td v-for="(totalJogador, sIndex) in item.totaisNaAltura" :key="sIndex">
              <div class="score-cell" :class="{ 'hero-scribble': item.isCleanSweep && item.pontosNestaRonda[sIndex] === 0 }">
                <span class="score-value">{{ item.pontosNestaRonda[sIndex] === 0 ? '-' : totalJogador }}</span>
                <sup v-if="item.salemaIndex === sIndex || (item.isCleanSweep && item.pontosNestaRonda[sIndex] === 20)" 
                     class="salema-star">*</sup>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div style="height: 120px;"></div>
    </div>

    <div class="action-buttons" v-if="game.status === 'ACTIVE'">
      <button class="btn-anotar" @click="showModal = true">+ Anotar Ronda</button>
      <button v-if="game.rounds.length > 0" @click="showUndoConfirm = true" class="btn-undo">
        ↩ Anular Última Ronda
      </button>
    </div>
    
    <div v-if="game.status === 'FINISHED'" class="game-over-banner">
      <h2> Jogo Terminado!</h2>
      <button @click="store.exitGame()" class="btn-action">Voltar</button>
    </div>

  </div>

  <AddRoundModal 
    v-if="showModal" 
    :players="game.players" 
    @close="showModal = false" 
  />

  <BaseModal 
    v-if="showUndoConfirm"
    title="Atenção"
    text="Tens a certeza que queres anular a última ronda?"
    confirmText="Sim, Anular"
    @cancel="showUndoConfirm = false"
    @confirm="confirmarUndo"
  />

  <BaseModal 
    v-if="showExitConfirm"
    title="Sair do Jogo"
    text="Queres mesmo sair e voltar ao menu principal?"
    confirmText="Sim, Sair"
    @cancel="showExitConfirm = false"
    @confirm="executarSair"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGameStore } from '../stores/game'; 
import BaseModal from '../components/BaseModal.vue';
import AddRoundModal from '../components/AddRoundModal.vue';

const store = useGameStore();
const game = computed(() => store.currentGame);

const showModal = ref(false);
const showUndoConfirm = ref(false);
const showExitConfirm = ref(false);

const historicoAcumulado = computed(() => {
  if (!game.value) return [];
  let totais = [0, 0, 0, 0, 0];
  return game.value.rounds.map(ronda => {
    const novosTotais = totais.map((ant, i) => ant + ronda.scores[i]);
    totais = novosTotais;
    return {
      totaisNaAltura: novosTotais,
      pontosNestaRonda: ronda.scores,
      isCleanSweep: ronda.isCleanSweep,
      salemaIndex: ronda.salemaIndex 
    };
  });
});

async function confirmarUndo() {
  showUndoConfirm.value = false;
  await store.undoLastRound(); 
}

function executarSair() {
  showExitConfirm.value = false;
  store.exitGame();            
}
</script>

<style scoped>
.game-screen { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.fixed-header { background: #1a1a1a; padding: 10px; border-bottom: 1px solid #333; z-index: 10; }
.top-bar { display: flex; justify-content: space-between; color: #888; font-size: 0.8rem; margin-bottom: 10px; }
.btn-text { background: none; border: none; color: #aaa; text-decoration: underline; cursor:pointer;}
.scoreboard-summary { display: flex; justify-content: space-between; text-align: center; }
.player-score-box { display: flex; flex-direction: column; width: 18%; }
.p-name { font-size: 0.7rem; color: #aaa; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.p-total { font-size: 1.4rem; font-weight: bold; color: white; }
.danger { color: #f39c12; }
.eliminated { color: #e74c3c; text-decoration: line-through; }

.history-container { flex: 1; overflow-y: auto; padding: 10px; }
.history-table { width: 100%; border-collapse: collapse; text-align: center; font-size: 0.9rem; }
.history-table th { color: #42b983; padding: 8px; border-bottom: 1px solid #444; position: sticky; top: 0; background: #1a1a1a; z-index: 5; }
.history-table td { padding: 5px; border-bottom: 1px solid #333; vertical-align: middle; }
.round-col { color: #666; font-size: 0.7rem; width: 30px;}
.round-num { color: #666; font-size: 0.8rem; }

.score-cell {
  display: inline-flex; justify-content: center; align-items: center;
  width: 35px; height: 35px; position: relative; font-weight: bold;
  background: transparent; color: #ccc; font-size: 1.1rem;
}
.score-value { z-index: 1; }
.hero-scribble {
  background: repeating-linear-gradient(135deg, #444, #444 4px, #666 4px, #666 6px);
  color: transparent; border: 1px solid #555; border-radius: 4px; 
}
.salema-star {
  color: #e74c3c; font-size: 1.2rem; font-weight: bold;
  position: absolute; top: -4px; right: -4px; line-height: 1; z-index: 2;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.8);
}

.action-buttons {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  z-index: 20; width: 100%;
}

.btn-anotar {
  background: #3498db; color: white; border: none; padding: 15px 30px;
  border-radius: 30px; font-size: 1.1rem; font-weight: bold;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3); cursor: pointer;
}

.btn-undo {
  background-color: rgba(26, 26, 26, 0.9); color: #e74c3c; border: 2px solid #e74c3c;
  padding: 8px 20px; border-radius: 20px; font-size: 0.9rem; font-weight: bold;
  cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.btn-undo:hover { background-color: #e74c3c; color: white; }
.game-over-banner { text-align: center; padding: 20px; background: #1a1a1a; }
.btn-action { width: 100%; padding: 15px; background: #3498db; color: white; border: none; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: pointer; }
</style>