<template>
  <div class="card history-main-card">
    <div class="header-history">
      
      <div class="month-selector">
        <label>Mês:</label>
        <input type="month" v-model="mesSelecionado" @change="carregarHistorico" class="input-mes">
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>...</p>
    </div>

    <div v-else-if="jogos.length === 0" class="empty-state">
      <p>Nada registado</p>
    </div>

    <div v-else class="timeline">
      <div 
        v-for="j in jogos" 
        :key="j.id" 
        class="game-card"
        :class="{ 'is-expanded': jogoExpandido === j.id }"
      >
        <div class="game-header clickable" @click="toggleDetalhes(j.id)">
          <div class="game-info">
            <span class="game-id">Jogo #{{ j.id }}</span>
            <span class="game-date">{{ formatDate(j.date) }}</span>
          </div>
          <div class="game-winner">
            <span class="winner-text" title="Vencedor(es)">
              🏆 {{ getVencedores(j) }}
            </span>
            <span class="expand-icon">{{ jogoExpandido === j.id ? '▲' : '▼' }}</span>
          </div>
        </div>

        <transition name="slide-fade">
          <div v-if="jogoExpandido === j.id" class="game-body">
            <div class="table-responsive">
              <table class="rounds-table">
                <thead>
                  <tr>
                    <th class="col-ronda">Ronda</th>
                    <th v-for="p in j.players" :key="p">{{ p }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in j.rondas" :key="i">
                    <td class="col-ronda font-bold">{{ i + 1 }}</td>
                    
                    <td v-for="p in j.players" :key="p" :class="getEstiloPonto(getPontos(r, p))">
                      {{ getPontos(r, p) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiGetGames } from '../services/api';

const mesSelecionado = ref(new Date().toISOString().slice(0, 7));
const jogos = ref([]);
const loading = ref(false);
const jogoExpandido = ref(null);

async function carregarHistorico() {
  loading.value = true;
  try {
    jogos.value = await apiGetGames(mesSelecionado.value);
    jogoExpandido.value = null; 
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function formatDate(dStr) {
  if (!dStr) return '';
  const d = new Date(dStr);
  return d.toLocaleString('pt-PT', { 
    day: '2-digit', month: 'short', 
    hour: '2-digit', minute: '2-digit' 
  });
}

function getVencedores(j) {
  if (!j.rondas || j.rondas.length === 0) return '-';
  const ultima = j.rondas[j.rondas.length - 1];
  if (!ultima.scores) return '-';

  let min = 9999;
  let vencedores = [];
  for (const [p, pts] of Object.entries(ultima.scores)) {
    if (pts < min) {
      min = pts;
      vencedores = [p];
    } else if (pts === min) {
      vencedores.push(p);
    }
  }
  return vencedores.join(', ');
}

function toggleDetalhes(id) {
  if (jogoExpandido.value === id) {
    jogoExpandido.value = null;
  } else {
    jogoExpandido.value = id;
  }
}

function getPontos(ronda, player) {
  if (!ronda || !ronda.scores) return '-';
  return ronda.scores[player] !== undefined ? ronda.scores[player] : '-';
}

function getEstiloPonto(pts) {
  if (pts === '-') return 'text-muted';
  const num = Number(pts);
  if (num === 0) return 'text-teal font-bold';
  if (num >= 20) return 'text-coral font-bold'; 
  return 'text-main';
}

onMounted(() => {
  carregarHistorico();
});
</script>

<style scoped>
.history-container { 
  padding: 10px; 
  padding-bottom: 80px; 
  max-width: 600px; 
  margin: 0 auto; 
}

h3 { 
  text-align: center; 
  color: var(--primary-teal); 
  margin-bottom: 20px; 
  text-transform: uppercase; 
  letter-spacing: 2px;
}

.loading, .empty { 
  text-align: center; 
  color: var(--text-muted); 
  padding: 30px; 
  background: var(--card-glass); 
  border-radius: 12px; 
  border: 1px solid var(--border-glass);
}

.games-list { 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
}
</style>