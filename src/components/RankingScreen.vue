<template>
  <div class="card">
    <div class="header-ranking">
      <h3>🏆 Hall of Fame</h3>
      
      <div class="month-selector">
        <label>Mês:</label>
        <input type="month" v-model="mesSelecionado" @change="carregarRanking" class="input-mes">
      </div>
    </div>
    
    <div v-if="loading" class="loading-text">A carregar dados...</div>
    
    <div v-else-if="lista.length === 0" class="empty-state">
      Nenhum jogo registado neste mês.
    </div>

    <div v-else>
      <div class="table-responsive">
        <table class="ranking-table">
          <thead>
            <tr>
              <th class="col-rank">#</th>
              
              <th class="col-name clickable" @click="ordenar('nickname')">
                Nome <span v-if="colunaAtual === 'nickname'">{{ getSeta('nickname') }}</span>
              </th>
              
              <th class="col-stat clickable" @click="ordenar('gamesPlayed')" title="Jogos Jogados">
                J <span v-if="colunaAtual === 'gamesPlayed'">{{ getSeta('gamesPlayed') }}</span>
              </th>
              <th class="col-stat clickable" @click="ordenar('roundsPlayed')" title="Rondas Jogadas">
                R <span v-if="colunaAtual === 'roundsPlayed'">{{ getSeta('roundsPlayed') }}</span>
              </th>

              <th class="col-stat clickable" @click="ordenar('losses')" title="Derrotas">
                ☠️ <span v-if="colunaAtual === 'losses'">{{ getSeta('losses') }}</span>
              </th>
              
              <th class="col-stat clickable" @click="ordenar('totalPoints')" title="Total de Pontos">
                Pts <span v-if="colunaAtual === 'totalPoints'">{{ getSeta('totalPoints') }}</span>
              </th>

              <th class="col-stat clickable" @click="ordenar('mediaPontos')" title="Média de Pontos (Menor é Melhor)">
                Pts/J <span v-if="colunaAtual === 'mediaPontos'">{{ getSeta('mediaPontos') }}</span>
              </th>
              
              <th class="col-stat clickable" @click="ordenar('mediaSalemas')" title="Média Salemas">
                <img src="/dama.jpg" alt="Dama" class="icon-dama">/J 
                <span v-if="colunaAtual === 'mediaSalemas'">{{ getSeta('mediaSalemas') }}</span>
              </th>
              
              <th class="col-stat clickable" @click="ordenar('mediaCargas')" title="Média de 20s">
                <span class="icon-20">20</span>/J 
                <span v-if="colunaAtual === 'mediaCargas'">{{ getSeta('mediaCargas') }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in listaOrdenada" :key="p.nickname">
              <td class="col-rank">{{ i + 1 }}º</td>
              <td class="col-name">{{ p.nickname }}</td>
              
              <td class="col-stat">{{ p.gamesPlayed || 0 }}</td>
              <td class="col-stat">{{ p.roundsPlayed || 0 }}</td>

              <td class="col-stat">{{ p.losses }}</td>
              <td class="col-stat">{{ p.totalPoints }}</td>
              
              <td class="col-stat highlight-stat">{{ calculaMedia(p.totalPoints, p.gamesPlayed) }}</td>

              <td class="col-stat">{{ calculaMedia(p.salemasCount, p.gamesPlayed) }}</td>
              <td class="col-stat">{{ calculaMedia(p.cleanSweeps, p.gamesPlayed) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p class="legend">
        <small>
          J Jogos | R Rondas | ☠️ Derrotas | Pts/J Pontos/Jogo
        </small>
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

const colunaAtual = ref('totalPoints');
const ordemDesc = ref(true);

async function carregarRanking() {
  loading.value = true;
  try {
    const dados = await apiGetRanking(mesSelecionado.value);
    lista.value = dados.ranking || [];
    // Define ordenação padrão ao carregar
    colunaAtual.value = 'totalPoints'; 
    ordemDesc.value = true;
  } catch (e) {
    console.error(e);
    alert("Erro ao carregar ranking");
  } finally {
    loading.value = false;
  }
}

function ordenar(coluna) {
  if (colunaAtual.value === coluna) {
    ordemDesc.value = !ordemDesc.value;
  } else {
    colunaAtual.value = coluna;
    
    // Se for Pts/J, queremos começar Ascendente (Menor para Maior) porque o menor é o melhor.
    // Para as outras (Pontos, Salemas), queremos Descendente (Maior para Menor).
    if (coluna === 'mediaPontos') {
      ordemDesc.value = false; // Começa com o melhor (menor) em cima
    } else {
      ordemDesc.value = true; // Começa com o maior em cima
    }
  }
}

function getSeta(coluna) {
  if (colunaAtual.value !== coluna) return '';
  // Mostra seta invertida visualmente dependendo do tipo de ordenação, mas o básico funciona
  return ordemDesc.value ? '▼' : '▲';
}

function getValorOrdenacao(player, coluna) {
  if (coluna === 'mediaPontos') {
    if (!player.gamesPlayed || player.gamesPlayed === 0) {
      return 999999; // CORREÇÃO: Se não jogou, vale "infinito" para ir para o fundo
    }
    return player.totalPoints / player.gamesPlayed;
  }
  if (coluna === 'mediaSalemas') {
    return player.gamesPlayed ? (player.salemasCount / player.gamesPlayed) : 0;
  }
  if (coluna === 'mediaCargas') {
    return player.gamesPlayed ? (player.cleanSweeps / player.gamesPlayed) : 0;
  }
  return player[coluna] || 0; 
}

const listaOrdenada = computed(() => {
  return [...lista.value].sort((a, b) => {
    let valorA = getValorOrdenacao(a, colunaAtual.value);
    let valorB = getValorOrdenacao(b, colunaAtual.value);

    if (typeof valorA === 'string') {
      return ordemDesc.value 
        ? valorB.localeCompare(valorA) 
        : valorA.localeCompare(valorB);
    }

    // Ordenação Numérica Simples (A lógica de "quem é melhor" está no getValorOrdenacao ou no clique inicial)
    return ordemDesc.value ? valorB - valorA : valorA - valorB;
  });
});

onMounted(() => {
  carregarRanking();
});

function calculaMedia(total, jogos) {
  if (!jogos || jogos === 0) return "-"; // Mostra traço se não jogou
  return (total / jogos).toFixed(1);
}
</script>

<style scoped>
.card { background: #2d2d2d; padding: 20px; border-radius: 12px; }

.header-ranking { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 20px; }
h3 { color: #f1c40f; margin: 0; font-size: 1.5rem; }

.month-selector { 
  display: flex; align-items: center; gap: 10px; 
  background: #333; padding: 5px 15px; border-radius: 20px; border: 1px solid #444;
}
.month-selector label { color: #aaa; font-size: 0.9rem; }
.input-mes { 
  background: transparent; border: none; color: white; 
  font-family: inherit; font-size: 1rem; cursor: pointer; outline: none;
}
.input-mes::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }

.loading-text { text-align: center; color: #888; margin: 20px 0; }
.empty-state { text-align: center; color: #666; font-style: italic; padding: 20px; }

.table-responsive { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.ranking-table { 
  width: 100%; 
  border-collapse: collapse; 
  color: #eee; 
  min-width: 420px;
}

th, td { 
  padding: 10px 4px; 
  border-bottom: 1px solid #444; 
  font-size: 0.9rem; 
  vertical-align: middle;
}

th { color: #888; font-weight: normal; user-select: none; white-space: nowrap; }

.clickable { cursor: pointer; transition: color 0.2s; }
.clickable:hover { color: #fff; background-color: #333; }

.col-rank { width: 35px; text-align: center; color: #666; font-size: 0.8rem; }
.col-name { text-align: left; font-weight: bold; color: white; padding-left: 5px; min-width: 80px; }
.col-stat { width: 45px; text-align: center; color: #ddd; }

.highlight-stat { color: #fff; font-weight: bold; }

.icon-dama { height: 20px; width: auto; vertical-align: middle; margin-bottom: 2px; }
.icon-dama-small { height: 14px; vertical-align: middle; }
.icon-20 { color: #f1c40f; font-weight: 900; font-size: 0.9rem; }

.legend { text-align: center; color: #666; margin-top: 15px; font-size: 0.75rem; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;}

@media (max-width: 600px) {
  .card { padding: 10px; }
  th, td { padding: 8px 2px; font-size: 0.85rem; }
  .col-stat { width: 38px; }
  .icon-dama { height: 18px; }
}
</style>