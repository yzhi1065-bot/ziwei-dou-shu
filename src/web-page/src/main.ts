import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'input', component: () => import('./views/InputPage.vue') },
    { path: '/chart', name: 'chart', component: () => import('./views/MainChart.vue') },
    { path: '/fortune', name: 'fortune', component: () => import('./views/FortunePages.vue') },
    { path: '/knowledge', name: 'knowledge', component: () => import('./views/KnowledgeBase.vue') },
    { path: '/hepan', name: 'hepan', component: () => import('./views/HePan.vue') },
  ]
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
