import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'remixicon/fonts/remixicon.css'

import App from './App.vue'
import router from './router'

// ✅ FIX GitHub Pages SPA redirect
const redirect = sessionStorage.redirect
if (redirect) {
  sessionStorage.removeItem('redirect')
  window.history.replaceState(null, null, redirect)
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
