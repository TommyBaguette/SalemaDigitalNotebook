<template>
  <div class="container">
    <h1>Salema Digital 🐟</h1>
    
    <button @click="criarJogo" :disabled="loading" class="btn-start">
      {{ loading ? 'A criar...' : 'Novo Jogo' }}
    </button>

    <div v-if="jogoAtual" class="success-box">
      <h3>✅ Jogo Criado!</h3>
      <p>ID: {{ jogoAtual.gameId }}</p>
      <p>Jogadores: {{ jogoAtual.players.join(', ') }}</p>
    </div>

    <div v-if="erro" class="error-box">
      ❌ {{ erro }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);
const jogoAtual = ref(null);
const erro = ref(null);

const API_URL = "https://bfcfzzm5v27k4qaiqrwa5ukqbu0bwiri.lambda-url.eu-north-1.on.aws/"; 

async function criarJogo() {
  loading.value = true;
  erro.value = null;

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "createGame",
        players: ["Eu", "Tu", "Ele", "Nós", "Vós"] // Jogadores de teste
      })
    });

    if (!resposta.ok) throw new Error("Erro na AWS");

    const dados = await resposta.json();
    jogoAtual.value = dados.game; // Guarda o jogo recebido
    console.log("Resposta da AWS:", dados);

  } catch (e) {
    console.error(e);
    erro.value = "Deu barraca! Verifica a consola.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container { font-family: sans-serif; text-align: center; margin-top: 50px; }
.btn-start { padding: 10px 20px; font-size: 1.2rem; cursor: pointer; background: #42b983; color: white; border: none; border-radius: 5px; }
.btn-start:disabled { background: #ccc; }
.success-box { margin-top: 20px; padding: 20px; background: #e0f7fa; border: 1px solid #00695c; display: inline-block; }
.error-box { margin-top: 20px; color: red; font-weight: bold; }
</style>