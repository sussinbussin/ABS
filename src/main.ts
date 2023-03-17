import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import routes from 'virtual:generated-pages'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
import 'anu-vue/dist/style.css'
import '@anu-vue/preset-theme-default/dist/style.css'

import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css';

import pb from './api/pocketbase'
import { pbSymbol } from './symbols/injectionSymbols'

const app = createApp(App)
const pinia = createPinia()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  if (to.name !== 'Login' && localStorage.getItem('user') === '{}')
    return { name: 'Login' }
})

app.use(router)
app.use(pinia)
app.use(MotionPlugin)
app.use(ToastPlugin)
app.provide(pbSymbol, pb)
app.mount('#app')
