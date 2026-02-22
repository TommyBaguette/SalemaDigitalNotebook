<template>
  <div id="app">
    <header v-if="!store.currentGame" class="main-header">
      <h1>Salema <span>Notebook</span></h1>
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

.main-header { 
  padding: 20px 10px; 
  background: transparent; 
  text-align: center; 
  margin-bottom: 10px;
}

h1 { 
  margin: 0 0 20px 0; 
  font-size: 2rem; 
  font-weight: 800;
  color: var(--text-main); 
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(76, 201, 240, 0.4);
}

h1 span {
  color: var(--primary-teal);
}

.nav-simple { 
  display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; 
}

.nav-simple .nav-link { 
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid var(--border-glass); 
  color: var(--text-muted); 
  padding: 8px 18px; 
  border-radius: 20px; 
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer; 
  transition: all 0.3s ease;
  text-decoration: none;
  backdrop-filter: blur(5px);
}

.nav-simple .nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-main);
  border-color: rgba(255, 255, 255, 0.2);
}

.nav-simple .router-link-active { 
  background: rgba(76, 201, 240, 0.15); 
  color: var(--primary-teal); 
  border-color: var(--primary-teal); 
  box-shadow: 0 0 15px rgba(76, 201, 240, 0.2);
}

.content { padding: 10px; max-width: 600px; margin: 0 auto; }

.btn-live { display: flex; align-items: center; gap: 6px; }
.dot { width: 8px; height: 8px; border-radius: 50%; transition: all 0.3s; }
.offline-dot { background-color: var(--text-muted); box-shadow: none; }
.live-dot { 
  background-color: var(--danger-coral); 
  box-shadow: 0 0 8px var(--danger-coral); 
  animation: blink 1.5s infinite; 
}

@keyframes blink {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}
</style>