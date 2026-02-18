import { defineStore } from 'pinia';
import { apiCreateGame, apiAddRound, apiGetAllPlayers, apiGetRanking } from '../services/api';

export const useGameStore = defineStore('game', {
  state: () => ({
    currentGame: null,  
    playersList: [],
    ranking: [],    
    history: [],    
    loading: false,      
    error: null
  }),

  actions: {
    async fetchPlayers() {
      this.loading = true;
      try {
        const data = await apiGetAllPlayers();
        this.playersList = data.players || [];
      } catch (e) {
        this.error = "Erro ao carregar jogadores";
      } finally {
        this.loading = false;
      }
    },

    async fetchHistory() {
      this.loading = true;
      try {
        const data = await apiGetHistory();
        this.history = data.history || [];
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    async startGame(selectedPlayers) {
      this.loading = true;
      try {
        const data = await apiCreateGame(selectedPlayers);
        this.currentGame = data.game; 
      } catch (e) {
        alert(e.message);
      } finally {
        this.loading = false;
      }
    },

    async addRound(scores, salemaIndex) {
      if (!this.currentGame) return;
      this.loading = true;
      try {
        const data = await apiAddRound(this.currentGame.gameId, scores, salemaIndex);
        this.currentGame = data.game; 
        return true;
      } catch (e) {
        alert("Erro na ronda: " + e.message);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchRanking(month) {
      this.loading = true;
      try {
        const data = await apiGetRanking(month);
        this.ranking = data.ranking || [];
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    exitGame() {
      this.currentGame = null;
      this.ranking = [];
    }
  }
});