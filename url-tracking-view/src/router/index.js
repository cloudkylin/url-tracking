import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [{
        path: '/',
        name: '网址重定向追踪',
        component: () => import('@/pages/tools.vue')
    }, {
        path: '*',
        name: 'error-404',
        component: () => import('@/pages/error/error-404.vue')
    }]
});