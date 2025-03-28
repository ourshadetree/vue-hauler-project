import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGoogleMaps from '@fawmi/vue-google-maps'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDYpNJXRFRuQq5IV8LQZi8E90r1gIaiORI',
    libraries: 'places'
  }
})

app.mount('#app')
