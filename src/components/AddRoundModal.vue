<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Registar Ronda</h3>
        <button @click="$emit('close')" class="btn-close">✕</button>
      </div>

      <div class="inputs-list">
        <div v-for="(p, i) in players" :key="i" class="player-input-row">
          
          <div class="player-label-area" @click="setSalemaManual(i)">
             <label>{{ p }}</label>
             <span class="dama-toggle" :class="{ 'active': quemTemSalema === i }" title="Quem tem a Dama?">
               🂭
             </span>
          </div>

          <div class="input-wrapper">
            <input type="number" v-model.number="pontos[i]" class="score-input" min="0" max="20" @input="checkSalemaAuto">
            <button class="btn-carga" @click="aplicarCarga(i)">20</button>
          </div>
        </div>
      </div>

      <div class="actions-area">
        <p class="total-info">
          Total: <strong>{{ totalMesa }}</strong>
          <span v-if="totalMesa === 80" class="status-ok"> Looking twenty</span>
          <span v-else-if="totalMesa === 20" class="status-ok"> Conta certa</span>
        </p>
        <button @click="lancarRonda" :disabled="store.loading" class="btn-action">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGameStore } from '../stores/game';

const props = defineProps({
  players: { type: Array, required: true }
});

const emit = defineEmits(['close']);
const store = useGameStore();

const pontos = ref([0,0,0,0,0]);
const quemTemSalema = ref(null);

const totalMesa = computed(() => pontos.value.reduce((a, b) => a + b, 0));

function aplicarCarga(heroIndex) {
  pontos.value = pontos.value.map((_, index) => index === heroIndex ? 0 : 20);
  quemTemSalema.value = null;
}

function setSalemaManual(index) {
  quemTemSalema.value = index;
}

function checkSalemaAuto() {
  if (totalMesa.value >= 70) return;
  let maxPoints = -1;
  let maxIndex = -1;
  let countMax = 0;
  pontos.value.forEach((p, i) => {
    if (p > maxPoints) {
      maxPoints = p;
      maxIndex = i;
      countMax = 1;
    } else if (p === maxPoints) {
      countMax++;
    }
  });
  if (countMax === 1 && maxPoints > 0) {
    quemTemSalema.value = maxIndex;
  }
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

  if (totalMesa.value === 80) {
    const totalVintes = pontos.value.filter(p => p === 20).length;
    if (totalVintes !== 4) {
      alert("Erro de Carga: Para o total ser 80, 4 jogadores têm de levar 20 pontos e 1 jogador tem de ficar a zeros.");
      return;
    }
  }

  if (totalMesa.value === 20 && quemTemSalema.value === null) {
    alert("Quem levou a Salema (Dama de Espadas)?\n\nClica no ícone 🂭 ao lado do nome do jogador.");
    return;
  }

  const sucesso = await store.addRound(pontos.value, quemTemSalema.value);
  if (sucesso) {
    emit('close');
  }
}
</script>

<style scoped>
.modal-overlay { 
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(0,0,0,0.85); z-index: 100; display: flex; justify-content: center; align-items: flex-end; 
}
.modal-content { 
  background: #2d2d2d; width: 100%; max-width: 500px; 
  border-radius: 20px 20px 0 0; padding: 20px; animation: slideUp 0.3s ease-out;
}
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-close { background: none; border: none; color: #aaa; font-size: 1.5rem; padding: 0 10px; cursor: pointer; }

.inputs-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.player-input-row { display: flex; align-items: center; justify-content: space-between; }

.player-label-area { width: 30%; display: flex; align-items: center; gap: 8px; cursor: pointer; }
.player-label-area label { font-weight: bold; color: #ddd; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }

.dama-toggle { font-size: 1.2rem; color: #444; transition: 0.2s; }
.dama-toggle.active { color: #e74c3c; text-shadow: 0 0 5px rgba(231, 76, 60, 0.5); transform: scale(1.2); }

.input-wrapper { display: flex; gap: 8px; width: 65%; align-items: center; }
.score-input { width: 100%; padding: 12px; text-align: center; background: #333; border: 1px solid #555; color: #fff; border-radius: 8px; font-weight: bold; font-size: 1.2rem; }

.btn-carga {
  background: #000000; border: none; border-radius: 8px; width: 55px; height: 100%;
  font-size: 1.1rem; font-weight: bold; color: #bebcbc; display: flex; justify-content: center; align-items: center; padding: 0; cursor: pointer;
}

.total-info { text-align: center; margin-bottom: 15px; color: #aaa; font-size: 1.1rem; }
.status-ok { color: #42b983; font-weight: bold; }
.btn-action { width: 100%; padding: 15px; background: #3498db; color: white; border: none; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: pointer; }
</style>