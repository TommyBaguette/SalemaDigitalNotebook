import { createRouter, createWebHistory } from 'vue-router'

import StartView from '../views/StartView.vue'
import RankingView from '../views/RankingView.vue'
import HistoryView from '../views/HistoryView.vue'
import LiveView from '../views/LiveView.vue'
import FeedbackView from '../views/FeedbackView.vue'

const routes = [
  { path: '/', name: 'jogar', component: StartView },
  { path: '/ranking', name: 'ranking', component: RankingView },
  { path: '/direto', name: 'direto', component: LiveView },
  { path: '/historico', name: 'historico', component: HistoryView },
  { path: '/feedback', name: 'feedback', component: FeedbackView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router