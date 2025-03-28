import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import MembersView from '../views/MembersView.vue'
import FuelToolsView from '../views/FuelToolsView.vue'
import LoadBoardView from '../views/LoadBoardView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/members',
    name: 'members',
    component: MembersView
  },
  {
    path: '/fuelTools',
    name: 'fuelTools',
    component: FuelToolsView
  },
  {
    path: '/loadBoard',
    name: 'loadBoard',
    component: LoadBoardView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
