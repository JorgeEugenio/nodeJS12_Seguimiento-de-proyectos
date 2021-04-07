import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from './components/Dashboard.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('./views/Home'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('./views/Login'),
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('./views/Register'),
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
    },
    {
        path: '/account',
        name: 'account',
        component: () => import('./components/account/Account'),
    },
    {
        path: '/notificaciones',
        name: 'notificaciones',
        component: () => import('./components/Notificaciones'),
    },
    {
        path: '/projects',
        name: 'projects',
        component: () => import('./components/projects/contenedor1/ContenedorProject'),
    },
    {
        path: '/users',
        name: 'users',
        component: () => import('./components/account/Admin'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
