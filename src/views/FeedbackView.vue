<template>
  <div class="feedback-container">
    <div class="card feedback-card">
      <div class="header-feedback">
        <h3>Caixinha de sugestões</h3>
      </div>

      <form @submit.prevent="enviarFeedback" class="feedback-form">
        <div class="input-group">
          <label for="nome">Nome</label>
          <input 
            id="nome" 
            v-model="nome" 
            type="text" 
            placeholder="Ex: Bummy" 
            required 
          />
        </div>

        <div class="input-group">
          <label for="mensagem">A tua mensagem:</label>
          <textarea 
            id="mensagem" 
            v-model="mensagem" 
            rows="5" 
            placeholder="Escreve aqui a tua mensagem" 
            required 
          ></textarea>
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="loading">A enviar mensagem...</span>
          <span v-else>Enviar Mensagem </span>
        </button>
      </form>
    </div>

    <transition name="slide-up">
      <div v-if="sucesso" class="toast-msg">
        Mensagem enviada com sucesso
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const nome = ref('');
const mensagem = ref('');
const loading = ref(false);
const sucesso = ref(false);

async function enviarFeedback() {
  loading.value = true;
  try {
    const response = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nome: nome.value, 
        mensagem: mensagem.value,
        data: new Date().toLocaleString()
      })
    });
    
    if (response.ok) {
      sucesso.value = true;
      nome.value = ''; 
      mensagem.value = '';

      setTimeout(() => {
        sucesso.value = false;
      }, 3000);
    } else {
      alert('Algo de errado aconteceu');
    }
  } catch (error) {
    console.error("Erro:", error);
    alert('Ocorreu um erro ao enviar a mensagem');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.feedback-container {
  position: relative; 
  min-height: 100%;
}

.feedback-card {
  background: var(--card-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  padding: 30px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  margin: 0 auto;
}

.header-feedback { margin-bottom: 25px; }
.header-feedback h3 {
  color: var(--primary-teal); text-transform: uppercase; letter-spacing: 2px;
  font-weight: 800; margin: 0 0 10px 0; text-shadow: 0 0 10px rgba(76, 201, 240, 0.3);
}
.subtitle { color: var(--text-muted); font-size: 0.9rem; margin: 0; }

.feedback-form { display: flex; flex-direction: column; gap: 20px; }
.input-group { display: flex; flex-direction: column; text-align: left; gap: 5px; }
.input-group label { color: var(--text-main); font-size: 0.9rem; font-weight: 600; padding-left: 5px; }

input, textarea {
  width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border-glass);
  color: var(--text-main); padding: 12px 15px; border-radius: 10px; font-family: inherit;
  font-size: 1rem; outline: none; transition: all 0.3s ease;
}
input::placeholder, textarea::placeholder { color: rgba(143, 166, 181, 0.5); }
input:focus, textarea:focus {
  border-color: var(--primary-teal); box-shadow: 0 0 8px rgba(76, 201, 240, 0.2); background: rgba(0, 0, 0, 0.4);
}
textarea { resize: vertical; }

.btn-submit {
  background: var(--primary-teal); color: var(--bg-deep); font-weight: 800; font-size: 1rem;
  width: 100%; padding: 14px; border: none; border-radius: 10px; cursor: pointer;
  text-transform: uppercase; letter-spacing: 1px; transition: transform 0.2s, box-shadow 0.2s; margin-top: 10px;
}
.btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(76, 201, 240, 0.4); }
.btn-submit:disabled { background: var(--text-muted); cursor: not-allowed; opacity: 0.7; }

.toast-msg {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(11, 37, 58, 0.95);
  border: 1px solid var(--primary-teal);
  color: var(--text-main);
  padding: 12px 25px;
  border-radius: 30px; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(76, 201, 240, 0.2);
  font-weight: 600;
  z-index: 9999;
  white-space: nowrap; 
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 30px);
}
</style>