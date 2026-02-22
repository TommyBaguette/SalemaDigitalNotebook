<template>
  <div class="feedback-screen-container">
    <div class="feedback-box">
      <h2>Enviar Feedback</h2>
      <p class="feedback-desc">Caixinha de sugestões</p>
      
      <input v-model="feedbackName" type="text" placeholder="O teu Nome / Nickname" class="feedback-input">
      <textarea v-model="feedbackMsg" placeholder="Escreve aqui a tua mensagem..." class="feedback-textarea"></textarea>
      
      <button @click="enviarFeedback" :disabled="loadingFeedback || !feedbackMsg.trim()" class="btn-send">
        {{ loadingFeedback ? 'A enviar...' : ' Enviar Feedback' }}
      </button>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="success-modal">
        <h3 class="success-title"> Sucesso!</h3>
        <p class="success-text">Mensagem enviada com sucesso! Obrigado pelo feedback.</p>
        <button @click="fecharSucesso" class="btn-ok">OK</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const feedbackName = ref('');
const feedbackMsg = ref('');
const loadingFeedback = ref(false);
const showSuccessModal = ref(false);

async function enviarFeedback() {
  loadingFeedback.value = true;
  
  const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL; 
  
  try {
    const resposta = await fetch(FORMSPREE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        Nome: feedbackName.value || "Anónimo",
        Mensagem: feedbackMsg.value
      })
    });

    if (resposta.ok) {
      feedbackName.value = ''; 
      feedbackMsg.value = '';
      showSuccessModal.value = true;
    } else {
      alert("Erro ao enviar. Tenta novamente mais tarde.");
    }
  } catch (erro) {
    alert("Erro de ligação. Verifica a tua internet.");
  } finally {
    loadingFeedback.value = false;
  }
}

function fecharSucesso() {
  showSuccessModal.value = false;
  router.push('/'); 
}
</script>

<style scoped>
.feedback-screen-container {
  padding-top: 15px;
}

.feedback-box {
  background: #1a1a1a;
  padding: 30px 20px;
  border-radius: 15px;
  border: 1px solid #333;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.feedback-box h2 { color: #42b983; margin-bottom: 10px; }
.feedback-desc { color: #aaa; font-size: 0.95rem; margin-bottom: 25px; }

.feedback-input, .feedback-textarea {
  width: 100%; padding: 15px; margin-bottom: 15px; border-radius: 8px;
  border: 1px solid #444; background: #222; color: white;
  font-family: inherit; font-size: 1rem;
}

.feedback-textarea { resize: vertical; min-height: 120px; }

.btn-send {
  background: #3498db; color: white; border: none; padding: 15px;
  width: 100%; border-radius: 10px; font-weight: bold; font-size: 1.1rem;
  cursor: pointer; transition: background 0.3s;
}
.btn-send:disabled { background: #555; color: #888; cursor: not-allowed; }
.btn-send:hover:not(:disabled) { background: #2980b9; }

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.85); z-index: 100; display: flex; justify-content: center; align-items: center;
}

.success-modal {
  background: #1a1a1a; padding: 30px 20px; border-radius: 20px;
  border: 1px solid #333; text-align: center; max-width: 320px; width: 90%;
}

.success-title { color: #42b983; margin-bottom: 10px; font-size: 1.5rem; }
.success-text { color: #ddd; margin-bottom: 25px; font-size: 1.1rem; }

.btn-ok {
  background: #42b983; color: white; border: none; padding: 12px 30px;
  border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 1rem; width: 100%;
}
</style>