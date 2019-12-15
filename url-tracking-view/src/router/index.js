import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [{
        path: '/',
        component: () => import('@/pages/index.vue'),
        redirect: '/tools',
        children: [{
            path: 'tools',
            name: '网址重定向追踪',
            component: () => import('@/pages/tools.vue'),
        }, {
            path: 'setting',
            name: '设置',
            component: () => import('@/pages/setting.vue'),
        }, {
            path: 'about',
            name: '关于',
            component: () => import('@/pages/about.vue'),
        }]
    }, {
        path: '*',
        name: 'error-404',
        component: () => import('@/pages/error/error-404.vue')
    }]
});