<template>
  <div id="app">
    <header v-if="!store.currentGame" class="main-header">
      <h1>Salema Notebook</h1>
      <nav class="nav-simple">
        <router-link to="/" class="nav-link">Jogar</router-link>
        <router-link to="/ranking" class="nav-link">Ranking</router-link>

        <router-link to="/direto" class="nav-link btn-live">
          <span class="dot" :class="store.activeGames && store.activeGames.length > 0 ? 'live-dot' : 'offline-dot'"></span> Direto
        </router-link>

        <router-link to="/historico" class="nav-link">Histórico</router-link>
        <router-link to="/feedback" class="nav-link">Feedback</router-link>
      </nav>
    </header>

    <main class="content">
      <GameView v-if="store.currentGame" />
      
      <router-view v-else /> 
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useGameStore } from './stores/game';
import GameView from './views/GameView.vue';

const store = useGameStore();

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

.nav-simple { 
  display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; 
}

.nav-simple .nav-link { 
  background: #2d2d2d; border: 1px solid #444; color: #888; 
  padding: 8px 15px; border-radius: 20px; font-size: 0.9rem;
  cursor: pointer; transition: all 0.2s ease;
  text-decoration: none;
}

.nav-simple .router-link-active { 
  background: #42b983; color: white; border-color: #42b983; 
}

.content { padding: 10px; max-width: 600px; margin: 0 auto; }

.btn-live { display: flex; align-items: center; gap: 6px; }

.dot { width: 8px; height: 8px; border-radius: 50%; transition: all 0.3s; }
.offline-dot { background-color: #555; box-shadow: none; }
.live-dot { background-color: #e74c3c; box-shadow: 0 0 5px #e74c3c; animation: blink 1s infinite; }

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}
</style>