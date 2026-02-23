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
        
        <div v-if="soUmVinte" class="motivo-area">
          <input type="text" v-model="motivo" placeholder="Motivo dos 20? (Ex: Renúncia)" class="motivo-input">
        </div>

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
const motivo = ref('');
const soUmVinte = computed(() => pontos.value.filter(p => p === 20).length === 1);

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

  const sucesso = await store.addRound(pontos.value, quemTemSalema.value, motivo.value);
  if (sucesso) {
    emit('close');
  }
}
</script>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100; display: flex; justify-content: center; align-items: flex-end; backdrop-filter: blur(4px); }

.modal-content { 
  background: #0a1622; width: 100%; max-width: 500px; 
  border-radius: 24px 24px 0 0; padding: 25px 20px 35px 20px; 
  animation: slideUp 0.3s ease-out; border-top: 2px solid #4CC9F0; 
  box-shadow: 0 -10px 40px rgba(0,0,0,0.5); 
}
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.modal-header h3 { color: #4CC9F0; margin: 0; font-size: 1.3rem; text-transform: uppercase; font-weight: 900; letter-spacing: 1px; }
.btn-close { background: rgba(255,255,255,0.05); border: none; color: #fff; font-size: 1.2rem; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }

.inputs-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px; }
.player-input-row { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }

.player-label-area { width: 35%; display: flex; align-items: center; gap: 8px; cursor: pointer; }
.player-label-area label { font-weight: 800; color: #4CC9F0; font-size: 1rem; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.dama-toggle { font-size: 1.4rem; color: rgba(255,255,255,0.1); transition: 0.3s; }
.dama-toggle.active { color: #ef476f; text-shadow: 0 0 10px rgba(239, 71, 111, 0.6); transform: scale(1.2); }

.input-wrapper { display: flex; gap: 8px; width: 60%; align-items: center; }
.score-input { 
  width: 100%; padding: 12px; text-align: center; background: rgba(0,0,0,0.5); 
  border: 1px solid rgba(76, 201, 240, 0.2); color: #ffffff; border-radius: 8px; 
  font-weight: 900; font-size: 1.3rem; outline: none; transition: 0.3s; 
}
.score-input:focus { border-color: #4CC9F0; box-shadow: 0 0 10px rgba(76, 201, 240, 0.2); }

.btn-carga { 
  background: rgba(239, 71, 111, 0.1); border: 1px solid rgba(239, 71, 111, 0.3); 
  border-radius: 8px; width: 60px; height: 50px; font-size: 1.1rem; font-weight: 900; 
  color: #ef476f; cursor: pointer; 
}

.total-info { text-align: center; margin-bottom: 15px; color: #888; font-size: 1.1rem; }
.status-ok { color: #4CC9F0; font-weight: 900; text-shadow: 0 0 5px rgba(76, 201, 240, 0.3); }

.btn-action { 
  width: 100%; padding: 16px; background: #4CC9F0; color: #0a1622; border: none; 
  border-radius: 12px; font-weight: 900; font-size: 1.2rem; cursor: pointer; 
  text-transform: uppercase; letter-spacing: 1px; 
}

.motivo-area { margin-bottom: 15px; animation: fadeIn 0.3s; }
.motivo-input { 
  width: 100%; padding: 12px; 
  background: rgba(239, 71, 111, 0.1); 
  border: 1px solid #ef476f; 
  color: #ffffff; border-radius: 8px; 
  font-size: 1rem; outline: none; 
}
.motivo-input::placeholder { color: rgba(239, 71, 111, 0.6); font-style: italic; }
</style>