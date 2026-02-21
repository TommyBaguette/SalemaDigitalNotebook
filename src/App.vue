<template>
  <div id="app">
    <header v-if="!store.currentGame" class="main-header">
      <h1>Salema Notebook</h1>
      <div class="nav-simple">
        <button @click="tab = 'jogar'" :class="{ active: tab === 'jogar' }">Jogar</button>
        <button @click="tab = 'ranking'" :class="{ active: tab === 'ranking' }">Ranking</button>
        
        <button @click="tab = 'direto'" :class="{ active: tab === 'direto' }" class="btn-live">
          <span class="dot" :class="store.activeGames && store.activeGames.length > 0 ? 'live-dot' : 'offline-dot'"></span> Direto
        </button>

        <button @click="tab = 'historico'" :class="{ active: tab === 'historico' }">Histórico</button>
        
        <button @click="tab = 'feedback'" :class="{ active: tab === 'feedback' }">Feedback</button>
      </div>
    </header>

    <main class="content">
      <GameScreen v-if="store.currentGame" />
      <div v-else>
        <StartScreen v-if="tab === 'jogar'" />
        <RankingScreen v-if="tab === 'ranking'" />
        <HistoryScreen v-if="tab === 'historico'" />
        <LiveScreen v-if="tab === 'direto'" />
        
        <FeedbackScreen v-if="tab === 'feedback'" @backToHome="tab = 'jogar'" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGameStore } from './stores/game';
import StartScreen from './components/StartScreen.vue';
import RankingScreen from './components/RankingScreen.vue';
import HistoryScreen from './components/HistoryScreen.vue';
import GameScreen from './components/GameScreen.vue';
import LiveScreen from './components/LiveScreen.vue';
import FeedbackScreen from './components/FeedbackScreen.vue';

const store = useGameStore();
const tab = ref('jogar');

onMounted(() => {
  store.fetchActiveGames();
  setInterval(() => {
    store.fetchActiveGames();
  }, 10000);
});
</script>

<style scoped>
.main-header { padding: 20px 10px; background: #1a1a1a; text-align: center; }
h1 { margin: 0 0 15px 0; font-size: 1.8rem; color: #42b983; }

/* O CSS que dá a magia aos botões do menu */
.nav-simple { 
  display: flex; 
  justify-content: center; 
  gap: 8px; 
  flex-wrap: wrap; /* 🔥 Garante que os 5 botões cabem no ecrã sem esmagar */
}

.nav-simple button { 
  background: #2d2d2d; 
  border: 1px solid #444; 
  color: #888; 
  padding: 8px 15px; 
  border-radius: 20px; 
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-simple button.active { 
  background: #42b983; 
  color: white; 
  border-color: #42b983; 
}

.content { padding: 10px; max-width: 600px; margin: 0 auto; }

/* O botão do Direto e a respetiva bolinha */
.btn-live { display: flex; align-items: center; gap: 6px; }

.dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  transition: all 0.3s;
}

.offline-dot { background-color: #555; box-shadow: none; }
.live-dot {
  background-color: #e74c3c;
  box-shadow: 0 0 5px #e74c3c;
  animation: blink 1s infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}
</style>