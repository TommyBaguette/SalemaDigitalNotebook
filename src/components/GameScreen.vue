<script setup>
import { ref, computed } from 'vue';
import { useGameStore } from '../stores/game';

const store = useGameStore();
const showModal = ref(false);
const scores = ref([0, 0, 0, 0, 0]);
const salemaHolder = ref(null);

const game = computed(() => store.currentGame);
const players = computed(() => store.currentGame?.players || []);
const totals = computed(() => store.currentGame?.currentTotals || {});

function openModal() {
  scores.value = [0, 0, 0, 0, 0];
  salemaHolder.value = null;
  showModal.value = true;
}

async function submeterRonda() {
  if (salemaHolder.value === null) {
    alert("Quem levou a Salema?");
    return;
  }
  
  const sucesso = await store.addRound(scores.value, salemaHolder.value);
  
  if (sucesso) {
    showModal.value = false;

    if (store.currentGame.status === 'FINISHED') {
      alert("JOGO TERMINADO! 🏆");
    }
  }
}

function increment(i) { scores.value[i] += 5; }
function decrement(i) { if (scores.value[i] > 0) scores.value[i] -= 5; }
function setSalema(i) { salemaHolder.value = i; }
function isLoser(idx) { return (totals.value[idx] || 0) >= 100; }
</script>

<template>
  <div class="game-container" v-if="game">
      <div class="scoreboard">
        <div v-for="(player, index) in players" :key="index" class="player-card" :class="{ 'loser': isLoser(index) }">
          <div class="p-name">{{ player }}</div>
          <div class="p-total">{{ totals[index] }}</div>
        </div>
      </div>

      <div class="rounds-list">
        <div v-for="round in game.rounds.slice().reverse()" :key="round.roundNumber" class="round-row">
           <span class="r-num">#{{ round.roundNumber }}</span>
           <div class="r-scores">
             <span v-for="(s, i) in round.scores" :key="i" :class="{'salema-score': i === round.salemaIndex}">
               {{ s }}
             </span>
           </div>
        </div>
      </div>

      <button class="fab" @click="openModal">+</button>

      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h3>Nova Ronda</h3>
          <div v-for="(p, i) in players" :key="i" class="input-row">
             <span>{{ p }}</span>
             <div class="controls">
               <button @click="decrement(i)">-</button>
               <span>{{ scores[i] }}</span>
               <button @click="increment(i)">+</button>
             </div>
             <button class="btn-salema" :class="{active: salemaHolder === i}" @click="setSalema(i)">🐟</button>
          </div>
          <div class="modal-actions">
            <button @click="showModal = false" class="btn-cancel">Cancelar</button>
            <button @click="submeterRonda" class="btn-save" :disabled="store.loading">
                {{ store.loading ? 'A guardar...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped>
.game-container { padding-bottom: 80px; }
.scoreboard { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; margin-bottom: 20px; background: #222; padding: 10px; border-radius: 12px; position: sticky; top: 0; z-index: 10; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
.player-card { display: flex; flex-direction: column; align-items: center; padding: 5px; border-radius: 5px; background: #333; }
.player-card.loser { background: #c0392b; }
.p-name { font-size: 0.7rem; color: #aaa; margin-bottom: 2px; overflow: hidden; white-space: nowrap; width: 100%; text-align: center; }
.p-total { font-size: 1.2rem; font-weight: bold; color: white; }

.rounds-list { display: flex; flex-direction: column; gap: 8px; }
.round-row { display: flex; align-items: center; background: #2d2d2d; padding: 10px; border-radius: 8px; border: 1px solid #444; }
.r-num { font-size: 0.8rem; color: #666; width: 30px; }
.r-scores { display: grid; grid-template-columns: repeat(5, 1fr); flex: 1; text-align: center; font-weight: bold; color: #ddd; }
.salema-score { color: #f1c40f; }

.fab { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; border-radius: 50%; background: #42b983; color: white; font-size: 2rem; border: none; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 20; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: #222; padding: 20px; border-radius: 12px; width: 90%; max-width: 400px; }
.input-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.controls { display: flex; align-items: center; gap: 10px; background: #333; padding: 5px; border-radius: 20px; }
.controls button { width: 30px; height: 30px; border-radius: 50%; background: #444; color: white; border: none; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.btn-salema { font-size: 1.2rem; background: transparent; border: 1px solid #444; border-radius: 50%; width: 40px; height: 40px; opacity: 0.3; }
.btn-salema.active { opacity: 1; background: rgba(241, 196, 15, 0.2); border-color: #f1c40f; }
.modal-actions { display: flex; gap: 10px; margin-top: 20px; }
.btn-save { flex: 2; background: #42b983; padding: 12px; border: none; border-radius: 8px; color: white; font-weight: bold; }
.btn-cancel { flex: 1; background: transparent; border: 1px solid #555; border-radius: 8px; color: #aaa; }
</style>