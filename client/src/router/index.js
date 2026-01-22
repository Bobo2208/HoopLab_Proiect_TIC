import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ],
})

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.currentUser) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router