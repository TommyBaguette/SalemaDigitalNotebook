<template>
  <div class="game-screen">
    <div class="header-info">
      <span>Game #{{ game.gameId }}</span>
      <button @click="$emit('exit')" style="color:#aaa; background:none; border:none; text-decoration:underline">Sair</button>
    </div>

    <div class="card scoreboard">
      <table>
        <thead><tr><th v-for="p in game.players" :key="p">{{ p }}</th></tr></thead>
        <tbody>
          <tr>
            <td v-for="(p, i) in game.players" :key="i" 
                :class="{'danger': game.currentTotals[i] >= 80, 'eliminated': game.currentTotals[i] >= 100}">
              {{ game.currentTotals[i] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card" v-if="game.status === 'ACTIVE'">
      <h3>Ronda {{ game.rounds.length + 1 }}</h3>
      <div class="inputs-grid">
        <div v-for="(p, i) in game.players" :key="i">
          <label style="font-size:0.7rem; color:#aaa">{{ p }}</label>
          <input type="number" v-model.number="pontos[i]" class="score-input">
        </div>
      </div>
      <p style="text-align:center">Total: {{ totalMesa }} / 20</p>
      <button @click="lancarRonda" :disabled="loading" class="btn-action">Anotar </button>
    </div>

    <div v-else class="card game-over">
      <h2>🏆 FIM!</h2>
      <button @click="$emit('exit')" class="btn-action">Voltar</button>
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

const totalMesa = computed(() => pontos.value.reduce((a, b) => a + b, 0));

async function lancarRonda() {
  loading.value = true;
  try {
    const dados = await apiAddRound(game.value.gameId, pontos.value);
    if (dados.game) game.value = dados.game; 
    pontos.value = [0,0,0,0,0];
  } catch (e) {
    alert(e.message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>

.card { background: #2d2d2d; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
table { width: 100%; text-align: center; color: white;}
td { font-size: 1.5rem; font-weight: bold; }
.inputs-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; }
.score-input { width: 100%; padding: 10px 0; text-align: center; background: #333; border: 1px solid #555; color: white; border-radius: 6px; font-weight: bold; }
.btn-action { width: 100%; padding: 15px; background: #3498db; color: white; border: none; border-radius: 8px; font-weight: bold; margin-top:10px;}
.danger { color: orange; } .eliminated { color: red; text-decoration: line-through; }
</style>