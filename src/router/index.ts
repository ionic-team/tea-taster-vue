import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TeaList from '../views/TeaList.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/teas',
  },
  {
    path: '/teas',
    name: 'Tea List',
    component: TeaList,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
