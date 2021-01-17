import { createRouter, createWebHistory } from '@ionic/vue-router';
import {
  NavigationGuardNext,
  RouteRecordRaw,
  RouteLocationNormalized,
} from 'vue-router';

import { authenticationService } from '@/services/AuthenticationService';
import Tabs from '../views/Tabs.vue';

async function checkAuthStatus(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  if (to.matched.some(r => r.meta.requiresAuth)) {
    if (!(await authenticationService.isAuthenticated())) {
      return next('/login');
    }
  }
  next();
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/teas',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/teas',
      },
      {
        path: 'teas',
        name: 'Tea List',
        component: () => import('@/views/TeaList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'teas/tea/:id',
        name: 'Tea Details',
        component: () => import('@/views/TeaDetails.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/About.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'tasting-notes',
        name: 'Tasting Notes',
        component: () => import('@/views/TastingNotes.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(checkAuthStatus);

export default router;
