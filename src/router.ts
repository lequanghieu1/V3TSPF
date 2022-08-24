import { createRouter, createWebHistory } from 'vue-router'

import Home from './components/TodoApp.vue'
import Login from './components/Login.vue'
import NotFound from './components/404.vue'

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/:catchAll(.*)',
        component: NotFound
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})
router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    const auth = localStorage.getItem("user");

    if (authRequired && !auth) {
        return '/login';
    }
    else if(publicPages.includes(to.path)&&auth){
        return '/';
    }

});

export default router