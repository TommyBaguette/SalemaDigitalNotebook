<template>
  <div class="card">
    <h3>🏆 Hall of Fame ({{ mes }})</h3>
    
    <div v-if="loading">A carregar estatísticas...</div>
    
    <div v-else>
      <div class="table-responsive">
        <table class="ranking-table">
          <thead>
            <tr>
              <th>#</th>
              <th class="col-name">Nome</th>
              <th title="Derrotas" class="danger-icon">☠️</th>
              <th title="Total de Pontos">Pts</th>
              <th title="Média Salemas (Dama) por Jogo">
                <img src="/dama.jpg" alt="Dama" class="icon-dama">/J
              </th>
              <th title="Média de 20s (Cargas) por Jogo">
                <span class="icon-20">20</span>/J
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in lista" :key="p.nickname">
              <td>{{ i + 1 }}º</td>
              <td class="col-name">{{ p.nickname }}</td>
              
              <td class="bold danger">{{ p.losses }}</td>
              
              <td>{{ p.totalPoints }}</td>
              
              <td>{{ calculaMedia(p.salemasCount, p.gamesPlayed) }}</td>
              
              <td>{{ calculaMedia(p.cleanSweeps, p.gamesPlayed) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p class="legend">
        <small>
          <span class="danger-icon">☠️</span> Derrotas | 
          <img src="/dama.jpg" alt="Dama" class="icon-dama-small"> Salemas/Jogo | 
          <span class="icon-20-small">20</span> Cargas/Jogo
        </small>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiGetRanking } from '../services/api';

const lista = ref([]);
const mes = ref("");
const loading = ref(true);

onMounted(async () => {
  try {
    const dados = await apiGetRanking();
    lista.value = dados.ranking || [];
    mes.value = dados.month;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

function calculaMedia(total, jogos) {
  if (!jogos || jogos === 0) return "0.0";
  return (total / jogos).toFixed(1);
}
</script>

<style scoped>
.card { background: #2d2d2d; padding: 20px; border-radius: 12px; }
h3 { text-align: center; color: #42b983; margin-bottom: 15px; }

.table-responsive { width: 100%; overflow-x: auto; }
.ranking-table { width: 100%; text-align: center; border-collapse: collapse; color: #eee; min-width: 300px; }
th, td { padding: 10px 5px; border-bottom: 1px solid #444; font-size: 0.9rem; vertical-align: middle; }
th { color: #aaa; font-weight: normal; }

.col-name { text-align: left; font-weight: bold; color: white; min-width: 80px; }
.bold { font-weight: bold; font-size: 1.1rem; }
.danger { color: #e74c3c; }

.icon-dama { height: 24px; vertical-align: middle; margin-bottom: 2px; }
.icon-dama-small { height: 16px; vertical-align: middle; }

.icon-20 { color: #f1c40f; font-weight: 900; font-size: 1.1rem; }
.icon-20-small { color: #f1c40f; font-weight: bold; }

.danger-icon { color: #e74c3c; font-size: 1.1rem; }

.legend { text-align: center; color: #888; margin-top: 15px; font-size: 0.8rem; display: flex; justify-content: center; gap: 10px; align-items: center;}
</style>