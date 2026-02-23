<template>
  <div>
    
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
          <template v-for="(item, rIndex) in historicoAcumulado" :key="rIndex">
            <tr>
              <td class="round-num">{{ rIndex + 1 }}</td>
              <td v-for="(totalJogador, sIndex) in item.totaisNaAltura" :key="sIndex">
                
                <div class="score-cell" :class="{ 'hero-scribble': item.isCleanSweep && item.pontosNestaRonda[sIndex] === 0 }">
                  <span class="score-value">{{ item.pontosNestaRonda[sIndex] === 0 ? '-' : totalJogador }}</span>
                  
                  <sup v-if="item.salemaIndex === sIndex || (item.isCleanSweep && item.pontosNestaRonda[sIndex] === 20)" 
                       class="salema-star">*</sup>
                  
                  <sup v-if="item.reason && item.pontosNestaRonda[sIndex] === 20" 
                       class="reason-icon" @click="mostrarMotivo(item.reason)">
                       💬
                  </sup>
                </div>

              </td>
            </tr>
          </template>
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
      :players="game?.players || []" 
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

    <BaseModal 
      v-if="showReasonModal"
      title="Motivo dos 20"
      :text="currentReason"
      confirmText="Fechar"
      @confirm="showReasonModal = false"
      @cancel="showReasonModal = false"
    />

  </div> </template>

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
const showReasonModal = ref(false);
const currentReason = ref('');

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
      salemaIndex: ronda.salemaIndex,
      reason: ronda.reason
    };
  });
});

async function confirmarUndo() {
  showUndoConfirm.value = false;
  await store.undoLastRound(); 
}

function mostrarMotivo(motivo) {
  currentReason.value = motivo;
  showReasonModal.value = true;
}

function executarSair() {
  showExitConfirm.value = false;
  store.exitGame();            
}

</script>

<style scoped>
.game-screen { display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: #030a11; }

.fixed-header { 
  background: rgba(5, 15, 25, 0.85); padding: 15px 10px; 
  border-bottom: 1px solid rgba(76, 201, 240, 0.2); 
  z-index: 10; backdrop-filter: blur(10px); 
}
.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.game-id { color: #4CC9F0; font-weight: bold; font-size: 0.9rem; letter-spacing: 1px; }
.btn-text { background: none; border: none; color: #888; text-decoration: none; font-weight: bold; cursor: pointer; font-size: 0.9rem; }

.scoreboard-summary { display: flex; justify-content: space-between; text-align: center; }
.player-score-box { display: flex; flex-direction: column; width: 18%; }
.p-name { font-size: 0.75rem; color: #4CC9F0; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 800; text-transform: uppercase; }
.p-total { font-size: 1.5rem; font-weight: 900; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
.danger { color: #ef476f; animation: pulse 1.5s infinite; }
.eliminated { color: #ef476f; text-decoration: line-through; opacity: 0.5; }

@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }

.history-container { flex: 1; overflow-y: auto; padding: 10px; }
.history-table { width: 100%; border-collapse: separate; border-spacing: 0; text-align: center; font-size: 0.95rem; }
.history-table th { 
  color: #4CC9F0; padding: 12px 4px; border-bottom: 2px solid rgba(76, 201, 240, 0.3); 
  position: sticky; top: 0; background: rgba(5, 15, 25, 0.95); z-index: 5; 
  text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;
}
.history-table th { 
  color: #4CC9F0; 
  padding: 12px 4px; 
  border-bottom: 2px solid rgba(76, 201, 240, 0.3); 
  position: sticky; 
  top: 0; 
  background: #030a11; 
  z-index: 10; 
  text-transform: uppercase; 
  font-size: 0.8rem; 
  letter-spacing: 1px;
}
.round-col { color: #888; width: 40px; }
.round-num { color: #888; font-size: 0.85rem; font-weight: bold; }

.score-cell { display: inline-flex; justify-content: center; align-items: center; width: 35px; height: 35px; position: relative; font-weight: bold; color: #ffffff; font-size: 1.1rem; }
.score-value { z-index: 1; }
.hero-scribble { 
  background: repeating-linear-gradient(135deg, rgba(76, 201, 240, 0.1), rgba(76, 201, 240, 0.1) 4px, rgba(76, 201, 240, 0.2) 4px, rgba(76, 201, 240, 0.2) 6px); 
  color: transparent; border: 1px solid rgba(76, 201, 240, 0.4); border-radius: 6px; 
}
.salema-star { color: #ef476f; font-size: 1.2rem; font-weight: 900; position: absolute; top: -5px; right: -5px; z-index: 2; text-shadow: 0 0 5px rgba(239, 71, 111, 0.6); }

.action-buttons { 

  width: 100%; 
  padding: 15px 20px 30px 20px; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 15px; 
  background: #030a11;
  border-top: 1px solid rgba(76, 201, 240, 0.15); 
  z-index: 20; 
}

.btn-anotar { 
  width: 100%; background: #4CC9F0; color: #0a1622; border: none; padding: 16px; 
  border-radius: 30px; font-size: 1.1rem; font-weight: 900; text-transform: uppercase; 
  letter-spacing: 1px; box-shadow: 0 8px 20px rgba(76, 201, 240, 0.3); cursor: pointer; 
}
.btn-undo { 
  background-color: rgba(5, 15, 25, 0.8); color: #ef476f; border: 1px solid #ef476f; 
  padding: 10px 25px; border-radius: 20px; font-size: 0.9rem; font-weight: bold; 
  cursor: pointer; backdrop-filter: blur(5px);
}

.btn-action { width: 100%; max-width: 300px; padding: 15px; background: #4CC9F0; color: #0a1622; border: none; border-radius: 12px; font-weight: 900; font-size: 1.1rem; cursor: pointer; text-transform: uppercase; }

.reason-row td { padding: 0 4px 10px 4px; border: none; } .reason-text { color: #ef476f; font-size: 0.85rem; text-align: left; }

.reason-icon {
  position: absolute;
  top: -8px;
  right: -24px;
  font-size: 1rem;
  cursor: pointer;
  filter: drop-shadow(0 0 5px rgba(76, 201, 240, 0.5));
}

.game-over-banner { 
  text-align: center; 
  padding: 20px; 
  background: #030a11;
  border-top: 1px solid rgba(76, 201, 240, 0.15); 
  width: 100%; 
  z-index: 20; 
}
</style>