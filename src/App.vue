<template>
  <div class="container">
    <h1 class="title">Salema Digital</h1>

    <div v-if="!jogoAtual" class="start-screen">
      <div class="card">
        <h3>Começar Nova Partida</h3>
        <p>Jogadores: Eu, Tu, Ele, Nós, Vós</p>
        <button @click="criarJogo" :disabled="loading" class="btn-primary">
          {{ loading ? 'A criar...' : 'Baralhar e Dar 🃏' }}
        </button>
      </div>
    </div>

    <div v-else class="game-screen">
      <div class="header-info">
        <span class="badge">Game ID: {{ jogoAtual.gameId.slice(0,8) }}...</span>
        <button @click="jogoAtual = null" class="btn-text">Sair</button>
      </div>

      <div class="scoreboard card">
        <table>
          <thead>
            <tr>
              <th v-for="player in jogoAtual.players" :key="player">{{ player }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="(player, index) in jogoAtual.players" :key="index" 
                  :class="{ 'danger': jogoAtual.currentTotals[index] >= 80 }">
                {{ jogoAtual.currentTotals[index] || 0 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="round-input card" v-if="jogoAtual.status === 'ACTIVE'">
        <h3>📝 Ronda {{ jogoAtual.rounds.length + 1 }}</h3>
        
        <div class="inputs-grid">
          <div v-for="(player, index) in jogoAtual.players" :key="index" class="input-group">
            <label>{{ player }}</label>
            <input type="number" v-model.number="pontosRonda[index]" min="0" max="20">
          </div>
        </div>

        <button @click="adicionarRonda" :disabled="loading" class="btn-action">
          {{ loading ? 'A Somar...' : 'Registar Ronda ✅' }}
        </button>
        
        <p v-if="somaRonda !== 20" class="warning-text">
          ⚠️ Total na mesa: {{ somaRonda }} (Devia ser 20, exceto Salemas duplas)
        </p>
      </div>

      <div v-else class="game-over">
        <h2>🏆 JOGO TERMINADO! 🏆</h2>
      </div>

      <div class="history">
        <h4>Histórico</h4>
        <ul>
          <li v-for="ronda in jogoAtual.rounds.slice().reverse()" :key="ronda.roundNumber">
            Ronda {{ ronda.roundNumber }}: {{ ronda.scores.join(' - ') }}
            <span v-if="ronda.isCleanSweep">🔥 (Carga!)</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="erro" class="error-toast" @click="erro = null">
      ❌ {{ erro }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';


const API_URL = "https://bfcfzzm5v27k4qaiqrwa5ukqbu0bwiri.lambda-url.eu-north-1.on.aws/"; 

const loading = ref(false);
const erro = ref(null);
const jogoAtual = ref(null);
const pontosRonda = ref([0, 0, 0, 0, 0]); 

const somaRonda = computed(() => {
  return pontosRonda.value.reduce((a, b) => a + b, 0);
});

async function criarJogo() {
  chamadaAPI("createGame", {
    players: ["Eu", "Tu", "Ele", "Nós", "Vós"]
  });
}

async function adicionarRonda() {
  await chamadaAPI("addRound", {
    gameId: jogoAtual.value.gameId,
    roundScores: pontosRonda.value
  });

  pontosRonda.value = [0, 0, 0, 0, 0];
}

async function chamadaAPI(action, payload) {
  loading.value = true;
  erro.value = null;

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload })
    });

    if (!resposta.ok) throw new Error("Erro na nuvem AWS");

    const dados = await resposta.json();
    
    if (dados.game) {
      jogoAtual.value = dados.game;
    }
    
  } catch (e) {
    console.error(e);
    erro.value = "Deu barraca: " + e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: sans-serif; color: #fff; background-color: #222; min-height: 100vh; }
.card { background: #333; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
.title { text-align: center; color: #42b983; }
.inputs-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px; }
.input-group label { display: block; font-size: 0.8rem; margin-bottom: 5px; text-align: center; }
.input-group input { width: 100%; padding: 10px; border-radius: 5px; border: none; text-align: center; font-weight: bold; }
.btn-primary, .btn-action { width: 100%; padding: 15px; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: 0.2s; }
.btn-primary { background: #42b983; color: white; }
.btn-action { background: #3498db; color: white; }
.btn-primary:hover { background: #3aa876; } .btn-action:hover { background: #2980b9; }
table { width: 100%; text-align: center; border-collapse: collapse; }
th, td { padding: 10px; border-bottom: 1px solid #444; }
td { font-size: 1.5rem; font-weight: bold; }
.danger { color: #e74c3c; } 
.warning-text { color: #f1c40f; font-size: 0.9rem; text-align: center; margin-top: 10px; }
.error-toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #c0392b; color: white; padding: 15px; border-radius: 50px; cursor: pointer; }
.badge { background: #444; padding: 5px 10px; border-radius: 4px; font-size: 0.8rem; font-family: monospace; }
.btn-text { background: none; border: none; color: #aaa; text-decoration: underline; cursor: pointer; margin-left: 10px; }
</style>
