<template>
  <div class="container">
    <header class="app-header">
      <h1 class="title"> Salema Digital</h1>
      <div class="tabs" v-if="!jogoAtivo">
        <button @click="tab = 'inicio'" :class="{active: tab==='inicio'}">Jogar</button>
        <button @click="tab = 'ranking'" :class="{active: tab==='ranking'}">Ranking</button>
      </div>
    </header>

    <GameScreen 
      v-if="jogoAtivo" 
      :initialGame="jogoAtivo" 
      @exit="jogoAtivo = null" 
    />

    <div v-else>
      <StartScreen v-if="tab === 'inicio'" @game-started="entrarNoJogo" />
      <RankingScreen v-if="tab === 'ranking'" />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import StartScreen from './components/StartScreen.vue';
import GameScreen from './components/GameScreen.vue';
import RankingScreen from './components/RankingScreen.vue';

const tab = ref('inicio');
const jogoAtivo = ref(null); 

function entrarNoJogo(dadosDoJogo) {
  jogoAtivo.value = dadosDoJogo;
}
</script>

<style>
body { margin: 0; background-color: #1a1a1a; color: #eee; font-family: 'Segoe UI', sans-serif; }
.container { max-width: 500px; margin: 0 auto; padding: 15px; min-height: 100vh; }
.title { text-align: center; color: #42b983; margin-bottom: 20px; }
.tabs { display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; }
.tabs button { background: #333; border: none; color: #888; padding: 8px 16px; border-radius: 20px; font-weight: bold; cursor: pointer; }
.tabs button.active { background: #42b983; color: white; }
</style>