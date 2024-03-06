import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/logs',
                name: 'logs',
                meta: {
                    title: '日志管理',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "logs" */ '../views/logs.vue'),
            },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限管理',
                    permiss: '13',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            },
            {
                path: '/import',
                name: 'import',
                meta: {
                    title: '导入Excel',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/import.vue'),
            },
            {
                path: '/record',
                name: 'record',
                meta: {
                    title: '刷新纪录',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "record" */ '../views/record.vue'),
            },
            {
                path: '/settings',
                name: 'settings',
                meta: {
                    title: '系统设置',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "settings" */ '../views/settings.vue'),
            },
            {
                path: '/about',
                name: 'about',
                meta: {
                    title: '关于我们',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "about" */ '../views/about.vue'),
            },
            {
                path: '/upload',
                name: 'upload',
                meta: {
                    title: '上传刷新包',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue'),
            },
            {
                path: '/info',
                name: 'info',
                meta: {
                    title: '回读信息确认',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "info" */ '../views/info.vue'),
            }
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    const role = localStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

router.afterEach(() => {
    NProgress.done()
})

export default router;
