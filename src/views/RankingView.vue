<template>
  <div class="card ranking-card">
    <div class="header-ranking">
      <h3> Cadeia Alimentar </h3>
      
      <div class="month-selector">
        <label>Mês:</label>
        <input type="month" v-model="mesSelecionado" @change="carregarRanking" class="input-mes">
      </div>
    </div>
    
    <div v-if="loading" class="loading-text">A carregar... </div>
    
    <div v-else-if="lista.length === 0" class="empty-state">
      Mar calmo. Nenhum jogo registado neste mês.
    </div>

    <div v-else>
      <div class="table-responsive">
        <table class="ranking-table">
          <thead>
            <tr>
              <th class="col-rank">#</th>
              
              <th class="col-name clickable" @click="ordenar('nickname')">
                Peixe <span v-if="colunaAtual === 'nickname'">{{ getSeta('nickname') }}</span>
              </th>
              
              <th class="col-stat clickable" @click="ordenar('gamesPlayed')" title="Jogos Jogados">
                J <span v-if="colunaAtual === 'gamesPlayed'">{{ getSeta('gamesPlayed') }}</span>
              </th>

              <th class="col-stat clickable" @click="ordenar('losses')" title="Derrotas">
                D <span v-if="colunaAtual === 'losses'">{{ getSeta('losses') }}</span>
              </th>

              <th class="col-stat clickable" @click="ordenar('maisMenos')" title="Eficiência (+/-)">
                +/- <span v-if="colunaAtual === 'maisMenos'">{{ getSeta('maisMenos') }}</span>
              </th>

              <th class="col-stat clickable" @click="ordenar('totalPoints')" title="Média de Pontos">
                Pts/J <span v-if="colunaAtual === 'totalPoints'">{{ getSeta('totalPoints') }}</span>
              </th>
              
              <th class="col-stat clickable" @click="ordenar('salemasCount')" title="Total Salemas">
                🂭 <span v-if="colunaAtual === 'salemasCount'">{{ getSeta('salemasCount') }}</span>
              </th>
              
              <th class="col-stat clickable" @click="ordenar('cleanSweeps')" title="Cargas de 20">
                20* <span v-if="colunaAtual === 'cleanSweeps'">{{ getSeta('cleanSweeps') }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in listaOrdenada" :key="p.nickname" :class="getRowClass(i, listaOrdenada.length)">
              <td class="col-rank">
                <template v-if="colunaAtual === 'maisMenos' && ordemDesc">
                  <span v-if="i === 0" class="rank-icon" title="Baleia">🐋</span>
                  <span v-else-if="i === 1 || i === 2" class="rank-icon" title="Tubarao">🦈</span>
                  
                  <span v-else-if="i === listaOrdenada.length - 1" class="rank-icon" title="Areia">🏖️</span>
                  
                  <span v-else-if="i === listaOrdenada.length - 2 || i === listaOrdenada.length - 3" class="rank-icon" title="Camarão">🦐</span>
                  
                  <span v-else>{{ i + 1 }}º</span>
                </template>
                
                <template v-else>
                  <span>{{ i + 1 }}º</span>
                </template>
              </td>
              
              <td class="col-name">{{ p.nickname }}</td>
              <td class="col-stat">{{ p.gamesPlayed || 0 }}</td>
              <td class="col-stat val-neg">{{ p.losses || 0 }}</td>
              
              <td class="col-stat font-bold" :class="getMaisMenosColor(calculaMaisMenos(p))">
                {{ formatMaisMenos(calculaMaisMenos(p)) }}
              </td>

              <td class="col-stat">{{ calculaMedia(p.totalPoints, p.gamesPlayed) }}</td>
              <td class="col-stat text-muted">{{ p.salemasCount || 0 }}</td>
              <td class="col-stat text-gold">{{ p.cleanSweeps || 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p class="legend">
        <small><span>J -</span> Jogos | 🂭 - Salemas | <span>D -</span> Derrotas </small>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { apiGetRanking } from '../services/api';

const lista = ref([]);
const mesSelecionado = ref(new Date().toISOString().slice(0, 7));
const loading = ref(false);
const colunaAtual = ref('maisMenos'); 
const ordemDesc = ref(true);

async function carregarRanking() {
  loading.value = true;
  try {
    const dados = await apiGetRanking(mesSelecionado.value);
    lista.value = dados.ranking || [];
    colunaAtual.value = 'maisMenos'; 
    ordemDesc.value = true;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

const maxStats = computed(() => {
  let maxJ = 0, maxH = 0, maxK = 0, maxI = 0;
  
  lista.value.forEach(p => {
    if (p.gamesPlayed > 0) {
      const j = p.losses / p.gamesPlayed;       
      const h = p.totalPoints / p.gamesPlayed;
      const k = p.cleanSweeps / p.gamesPlayed; 
      const i = p.salemasCount / p.gamesPlayed; 
      
      if (j > maxJ) maxJ = j;
      if (h > maxH) maxH = h;
      if (k > maxK) maxK = k;
      if (i > maxI) maxI = i;
    }
  });
  
  return { maxJ, maxH, maxK, maxI };
});

function calculaMaisMenos(p) {
  if (!p.gamesPlayed || p.gamesPlayed === 0) return 0;
  
  const J2 = p.losses / p.gamesPlayed;
  const H2 = p.totalPoints / p.gamesPlayed;
  const K2 = p.cleanSweeps / p.gamesPlayed;
  const I2 = p.salemasCount / p.gamesPlayed;


  const { maxJ, maxH, maxK, maxI } = maxStats.value;
  const fatorJ = maxJ > 0 ? (J2 / Math.pow(maxJ, 2)) : 0;
  const fatorH = maxH > 0 ? (H2 / maxH) : 0;
  const fatorK = maxK > 0 ? (K2 / maxK) : 0;
  const fatorI = maxI > 0 ? (I2 / maxI) : 0;
  const score = (0.4 * (1 - fatorJ)) 
              + (0.2 * (1 - fatorH)) 
              + (0.3 * fatorK) 
              + (0.1 * (1 - fatorI));
              
  return score;
}

function formatMaisMenos(valor) {
  const num = Number(valor).toFixed(2);
  return valor > 0 ? `+${num}` : num;
}

function calculaMedia(total, jogos) {
  if (!jogos) return "-";
  return (total / jogos).toFixed(1);
}

function getMaisMenosColor(val) {
  if (val > 0) return 'val-pos';
  if (val < 0) return 'val-neg';
  return '';
}

function getRowClass(i, total) {
  if (colunaAtual.value !== 'maisMenos' || !ordemDesc.value) return '';
  
  if (i === 0) return 'row-shark';
  if (i === total - 1) return 'row-sand'; 
  if (i >= total - 3) return 'row-shrimp';
  return '';
}

function ordenar(coluna) {
  if (colunaAtual.value === coluna) {
    ordemDesc.value = !ordemDesc.value;
  } else {
    colunaAtual.value = coluna;
    ordemDesc.value = (coluna !== 'totalPoints'); 
  }
}

function getSeta(coluna) {
  if (colunaAtual.value !== coluna) return '';
  return ordemDesc.value ? '▼' : '▲';
}

function getValorOrdenacao(player, coluna) {
  if (coluna === 'totalPoints') { 
    return (!player.gamesPlayed) ? 9999 : player.totalPoints / player.gamesPlayed;
  }
  if (coluna === 'maisMenos') return calculaMaisMenos(player);
  return player[coluna] || 0; 
}

const listaOrdenada = computed(() => {
  const listaLimpa = lista.value.filter(p => {
    const score = parseFloat(calculaMaisMenos(p));
    return score !== 0; 
  });

  return listaLimpa.sort((a, b) => {
    let valA = getValorOrdenacao(a, colunaAtual.value);
    let valB = getValorOrdenacao(b, colunaAtual.value);
    return ordemDesc.value ? valB - valA : valA - valB;
  });
});

onMounted(() => { carregarRanking(); });
</script>

<style scoped>
.ranking-card {
  background: var(--card-glass);
  backdrop-filter: blur(10px); 
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  padding: 20px 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.header-ranking h3 { 
  color: var(--primary-teal); 
  text-transform: uppercase; 
  letter-spacing: 2px; 
  font-weight: 800;
  text-shadow: 0 0 10px rgba(76, 201, 240, 0.3);
}

.input-mes {
  background: rgba(0,0,0,0.3); 
  border: 1px solid var(--primary-teal);
  color: white; 
  padding: 5px 10px; 
  border-radius: 20px; 
  outline: none;
  min-width: 165px;
  text-align: center; 
  font-family: inherit;
}
.input-mes::-webkit-calendar-picker-indicator { filter: invert(1); }

.ranking-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; color: var(--text-main); }
th { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; padding: 10px 4px; border: none; }
td { background: rgba(255,255,255,0.03); padding: 12px 5px; border: none; font-size: 0.95rem; }

td:first-child { border-radius: 10px 0 0 10px; }
td:last-child { border-radius: 0 10px 10px 0; }

.col-rank { font-weight: bold; color: var(--text-muted); width: 40px; }
.rank-icon { font-size: 1.4rem; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); }

.col-name { text-align: left; font-weight: bold; padding-left: 10px; }
.col-stat { text-align: center; }

.val-pos { color: var(--primary-teal); font-weight: bold; }
.val-neg { color: var(--danger-coral); font-weight: bold; }
.text-gold { color: var(--accent-gold); font-weight: bold; }
.text-muted { color: var(--text-muted); opacity: 0.7; }

.row-shark td { background: linear-gradient(90deg, rgba(76, 201, 240, 0.15), rgba(76, 201, 240, 0.05)); border-top: 1px solid rgba(76, 201, 240, 0.3); }
.row-sand td { background: rgba(255, 209, 102, 0.05); opacity: 1; }
.row-shrimp td { background: rgba(239, 71, 111, 0.05); opacity: 1; }

.legend { margin-top: 20px; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 0.5px; }
</style>