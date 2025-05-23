// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/composables/useAuth'
import { watch } from 'vue'

import HomeView       from '@/views/HomeView.vue'
import AboutView      from '@/views/AboutView.vue'
import MembersView    from '@/views/MembersView.vue'
import FuelToolsView  from '@/views/FuelToolsView.vue'
import LoadBoardView  from '@/views/LoadBoardView.vue'
import ProfileView    from '@/views/ProfileView.vue'
import FactoringView  from '@/views/FactoringView.vue'
import ContactView    from '@/views/ContactView.vue'
import SignInView     from '@/views/SignInView.vue'
import SignUpView     from '@/views/SignUpView.vue'

const routes = [
  { path: '/',           name: 'home',        component: HomeView },
  { path: '/about',      name: 'about',       component: AboutView },
  { path: '/members',    name: 'members',     component: MembersView },
  { path: '/fuelTools',  name: 'fuelTools',   component: FuelToolsView },
  { path: '/loadBoard',  name: 'loadBoard',   component: LoadBoardView },

  // Public auth pages
  { path: '/signin',     name: 'signin',      component: SignInView },
  { path: '/signup',     name: 'signup',      component: SignUpView },

  // Protected profile page
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },

  { path: '/factoring',  name: 'factoring',   component: FactoringView },
  { path: '/contact',    name: 'contact',     component: ContactView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { user, loadUser, sessionLoaded } = auth

  // If session is not loaded yet, load it
  if (!sessionLoaded.value) {
    await loadUser()
  }

  // If still not loaded (in case loadUser is async), wait for sessionLoaded flag reactively
  if (!sessionLoaded.value) {
    await new Promise((resolve) => {
      const stop = watch(sessionLoaded, (val) => {
        if (val) {
          stop()
          resolve()
        }
      })
    })
  }

  // Redirect signed-in users away from signin/signup pages
  if ((to.name === 'signin' || to.name === 'signup') && user.value) {
    return next({ name: 'profile' })
  }

  // Protect routes that require authentication
  if (to.meta.requiresAuth && !user.value) {
    return next({ name: 'signin' })
  }

  // Allow navigation
  next()
})

export default router
