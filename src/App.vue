<template>
  <div class="container">
    <h1 class="title">🐟 Salema Digital</h1>

    <div v-if="!jogoAtual" class="start-screen">
      <div class="card">
        <h3>Quem vai jogar hoje?</h3>
        
        <div class="name-inputs">
          <div v-for="(nome, index) in nomesJogadores" :key="index" class="input-group">
            <label>Jogador {{ index + 1 }}</label>
            <input 
              v-model="nomesJogadores[index]" 
              placeholder="Nome do artista..."
              maxlength="12"
            >
          </div>
        </div>

        <button @click="criarJogo" :disabled="loading || !nomesValidos" class="btn-primary">
          {{ loading ? 'A criar...' : 'Começar a Partida 🃏' }}
        </button>
        
        <p v-if="!nomesValidos" class="hint-text">Preenche os 5 nomes para começar.</p>
      </div>
    </div>

    <div v-else class="game-screen">
      <div class="header-info">
        <span class="badge">Game ID: {{ jogoAtual.gameId.slice(0,8) }}...</span>
        <button @click="sairDoJogo" class="btn-text">Sair</button>
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
                  :class="{ 'danger': jogoAtual.currentTotals[index] >= 80, 'eliminated': jogoAtual.currentTotals[index] >= 100 }">
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
            <label class="player-label">{{ player }}</label>
            <input type="number" v-model.number="pontosRonda[index]" min="0" max="20" class="score-input">
          </div>
        </div>

        <div class="actions">
          <p class="total-mesa" :class="{'total-ok': somaRonda === 20}">
            Total na mesa: <strong>{{ somaRonda }}</strong> / 20
          </p>

          <button @click="adicionarRonda" :disabled="loading" class="btn-action">
            {{ loading ? 'A Somar...' : 'Registar Ronda ✅' }}
          </button>
        </div>
      </div>

      <div v-else class="game-over card">
        <h2>🏆 FIM DO JOGO! 🏆</h2>
        <p>Alguém rebentou a escala.</p>
        <button @click="jogoAtual = null" class="btn-primary">Novo Jogo</button>
      </div>

      <div class="history">
        <h4>Histórico de Rondas</h4>
        <ul>
          <li v-for="ronda in jogoAtual.rounds.slice().reverse()" :key="ronda.roundNumber">
            <span class="round-num">#{{ ronda.roundNumber }}</span>
            <span class="round-scores">{{ ronda.scores.join(' - ') }}</span>
            <span v-if="ronda.isCleanSweep" class="fire">🔥 CARGA!</span>
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

// Estado dos Nomes (Inicialmente vazios)
const nomesJogadores = ref(["", "", "", "", ""]);
const pontosRonda = ref([0, 0, 0, 0, 0]);

// Validação: Verifica se todos os nomes têm pelo menos 1 letra
const nomesValidos = computed(() => {
  return nomesJogadores.value.every(nome => nome.trim().length > 0);
});

const somaRonda = computed(() => {
  return pontosRonda.value.reduce((a, b) => a + b, 0);
});

async function criarJogo() {
  // Envia os nomes que escreveste para o Backend
  await chamadaAPI("createGame", {
    players: nomesJogadores.value
  });
}

async function adicionarRonda() {
  await chamadaAPI("addRound", {
    gameId: jogoAtual.value.gameId,
    roundScores: pontosRonda.value
  });
  // Reset aos inputs da ronda
  pontosRonda.value = [0, 0, 0, 0, 0];
}

function sairDoJogo() {
  if(confirm("Tens a certeza que queres sair? O jogo continua guardado na cloud.")) {
    jogoAtual.value = null;
  }
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

    if (!resposta.ok) throw new Error("Erro na AWS");

    const dados = await resposta.json();
    if (dados.game) {
      jogoAtual.value = dados.game;
    }
    
  } catch (e) {
    console.error(e);
    erro.value = "Erro de ligação. Tenta de novo.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Estilos melhorados para telemóvel */
.container { max-width: 500px; margin: 0 auto; padding: 15px; font-family: 'Segoe UI', sans-serif; background-color: #1a1a1a; min-height: 100vh; color: #eee; }
.card { background: #2d2d2d; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
.title { text-align: center; color: #42b983; margin-bottom: 20px; font-size: 1.8rem; }

/* Inputs de Nomes */
.name-inputs { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.name-inputs input { padding: 12px; background: #444; border: 1px solid #555; color: white; border-radius: 6px; font-size: 1rem; }
.hint-text { text-align: center; color: #888; font-size: 0.8rem; margin-top: 10px; }

/* Scoreboard */
table { width: 100%; text-align: center; table-layout: fixed; }
th { color: #888; font-size: 0.8rem; padding-bottom: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
td { font-size: 1.6rem; font-weight: bold; padding: 5px; }
.danger { color: #e67e22; }
.eliminated { color: #e74c3c; text-decoration: line-through; }

/* Ronda Inputs */
.inputs-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; margin-bottom: 15px; }
.player-label { font-size: 0.7rem; text-align: center; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px; color: #aaa; }
.score-input { width: 100%; padding: 10px 0; text-align: center; background: #333; border: 1px solid #555; color: white; border-radius: 6px; font-size: 1.2rem; font-weight: bold; }
.score-input:focus { border-color: #42b983; outline: none; background: #3a3a3a; }

/* Botões e Ações */
.btn-primary { width: 100%; padding: 15px; background: #42b983; color: white; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; }
.btn-primary:disabled { background: #444; color: #888; cursor: not-allowed; }
.btn-action { width: 100%; padding: 15px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; }
.total-mesa { text-align: center; margin-bottom: 10px; font-size: 0.9rem; color: #aaa; }
.total-ok { color: #42b983; font-weight: bold; }

/* Histórico */
.history ul { list-style: none; padding: 0; max-height: 200px; overflow-y: auto; }
.history li { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #444; font-family: monospace; }
.fire { color: #e74c3c; font-weight: bold; }
.error-toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #c0392b; color: white; padding: 12px 24px; border-radius: 50px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 100; }
.btn-text { background: none; border: none; color: #666; cursor: pointer; }
</style>