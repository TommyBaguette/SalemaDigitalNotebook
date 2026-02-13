<template>
  <div class="game-screen">
    
    <div class="fixed-header">
      <div class="top-bar">
        <span class="game-id">Game #{{ game.gameId }}</span>
        <button @click="$emit('exit')" class="btn-text">Sair</button>
      </div>

      <div class="scoreboard-summary">
        <div v-for="(p, i) in game.players" :key="i" class="player-score-box">
          <span class="p-name">{{ p }}</span>
          <span class="p-total" 
            :class="{'danger': game.currentTotals[i] >= 80, 'eliminated': game.currentTotals[i] >= 100}">
            {{ game.currentTotals[i] }}
          </span>
        </div>
      </div>
    </div>

    <div class="history-container">
      <table class="history-table">
        <thead>
          <tr>
            <th class="round-col">#</th>
            <th v-for="p in game.players" :key="p">{{ p.substring(0, 3) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ronda, rIndex) in game.rounds" :key="rIndex">
            <td class="round-num">{{ rIndex + 1 }}</td>
            <td v-for="(score, sIndex) in ronda.scores" :key="sIndex">
              <span :class="{'highlight-carga': ronda.isCleanSweep && score === 0, 'highlight-salema': score >= 20}">
                {{ score }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style="height: 80px;"></div>
    </div>

    <button class="fab-add" @click="showModal = true" v-if="game.status === 'ACTIVE'">
      + Anotar Ronda
    </button>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Ronda {{ game.rounds.length + 1 }}</h3>
          <button @click="fecharModal" class="btn-close">✕</button>
        </div>

        <div class="inputs-list">
          <div v-for="(p, i) in game.players" :key="i" class="player-input-row">
            <label>{{ p }}</label>
            <div class="input-wrapper">
              <input type="number" v-model.number="pontos[i]" class="score-input" min="0" max="20">
              <button class="btn-carga" @click="aplicarCarga(i)">20</button>
            </div>
          </div>
        </div>

        <div class="actions-area">
          <p class="total-info">
            Total: <strong>{{ totalMesa }}</strong>
            <span v-if="totalMesa === 80" class="status-ok"> (Looking twenty! 🔥)</span>
            <span v-else-if="totalMesa === 20" class="status-ok"> (Ok 👍)</span>
          </p>
          <button @click="lancarRonda" :disabled="loading" class="btn-action">Guardar</button>
        </div>
      </div>
    </div>

    <div v-if="game.status === 'FINISHED'" class="game-over-banner">
      <h2>🏆 Jogo Terminado!</h2>
      <button @click="$emit('exit')" class="btn-action">Voltar ao Menu</button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { apiAddRound } from '../services/api';

const props = defineProps(['initialGame']);
const emit = defineEmits(['exit']);

const game = ref(props.initialGame);
const pontos = ref([0,0,0,0,0]);
const loading = ref(false);
const showModal = ref(false);

const totalMesa = computed(() => pontos.value.reduce((a, b) => a + b, 0));

function aplicarCarga(heroIndex) {
  pontos.value = pontos.value.map((_, index) => index === heroIndex ? 0 : 20);
}

function fecharModal() {
  showModal.value = false;
  pontos.value = [0,0,0,0,0]; 
}

async function lancarRonda() {
  if (totalMesa.value !== 20 && totalMesa.value !== 80) {
    alert(`Erro: Total deve ser 20 ou 80. Atual: ${totalMesa.value}`);
    return;
  }
  if (pontos.value.some(p => p > 20)) {
    alert("Erro: Máximo 20 pontos por pessoa.");
    return;
  }

  loading.value = true;
  try {
    const dados = await apiAddRound(game.value.gameId, pontos.value);
    if (dados.game) game.value = dados.game;
    pontos.value = [0,0,0,0,0];
    showModal.value = false; 
  } catch (e) {
    alert(e.message);
  } finally {
    loading.value = false;
  }
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
.history-table th { color: #42b983; padding: 8px; border-bottom: 1px solid #444; position: sticky; top: 0; background: #1a1a1a; }
.history-table td { padding: 8px; border-bottom: 1px solid #333; color: #ccc; }
.round-col { color: #666; font-size: 0.7rem; width: 30px;}
.round-num { color: #666; font-size: 0.8rem; }

.highlight-carga { color: #f1c40f; font-weight: bold; border: 1px solid #f1c40f; border-radius: 50%; padding: 2px 5px; }
.highlight-salema { color: #e74c3c; font-weight: bold; }

.fab-add { 
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  background: #3498db; color: white; border: none; 
  padding: 15px 30px; border-radius: 30px; 
  font-size: 1.1rem; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  z-index: 20;
}

.modal-overlay { 
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(0,0,0,0.85); z-index: 100;
  display: flex; justify-content: center; align-items: flex-end; 
}
.modal-content { 
  background: #2d2d2d; width: 100%; max-width: 500px; 
  border-radius: 20px 20px 0 0; padding: 20px; 
  animation: slideUp 0.3s ease-out;
}
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-close { background: none; border: none; color: #aaa; font-size: 1.5rem; padding: 0 10px; }

.inputs-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.player-input-row { display: flex; align-items: center; justify-content: space-between; }
.player-input-row label { width: 30%; font-weight: bold; color: #ddd; }
.input-wrapper { display: flex; gap: 8px; width: 65%; }
.score-input { width: 100%; padding: 12px; text-align: center; background: #333; border: 1px solid #555; color: white; border-radius: 8px; font-weight: bold; font-size: 1.2rem; }

.btn-carga {
  background: #f1c40f; border: none; border-radius: 8px;
  width: 55px; height: 100%;
  font-size: 1.1rem; font-weight: bold; color: #333;
  display: flex; justify-content: center; align-items: center; padding: 0;
}

.total-info { text-align: center; margin-bottom: 15px; color: #aaa; font-size: 1.1rem; }
.status-ok { color: #42b983; font-weight: bold; }
.btn-action { width: 100%; padding: 15px; background: #3498db; color: white; border: none; border-radius: 12px; font-weight: bold; font-size: 1.1rem; }

.game-over-banner { text-align: center; padding: 20px; background: #1a1a1a; }
</style>