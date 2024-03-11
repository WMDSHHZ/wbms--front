import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/import',
                name: 'import',
                meta: {
                    title: '导入Excel',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/import.vue'),
            },
            {
                path: '/upload',
                name: 'upload',
                meta: {
                    title: '上传刷新包',
                    permiss: '4',
                },
                component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue'),
            },
            {
                path: '/logs',
                name: 'logs',
                meta: {
                    title: '日志管理',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "logs" */ '../views/logs.vue'),
            },
            {
                path: '/task',
                name: 'task',
                meta: {
                    title: '任务管理',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "task" */ '../views/task.vue'),
            },
            {
                path: '/record',
                name: 'record',
                meta: {
                    title: '刷新纪录',
                    permiss: '7',
                },
                component: () => import(/* webpackChunkName: "record" */ '../views/record.vue'),
            },
            {
                path: '/settings',
                name: 'settings',
                meta: {
                    title: '系统设置',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "settings" */ '../views/settings.vue'),
            },
            {
                path: '/device',
                name: 'Device',
                meta: {
                    title: '设备管理',
                    permiss: '9',
                },
                component: () => import(/* webpackChunkName: "device" */ '../views/device.vue'),
            },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限管理',
                    permiss: '10',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission.vue'),
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
    {
        path: '/user',
        name: 'user',
        meta: {
            title: '个人中心',
        },
        component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
    },
    {
        path: '/test',
        name: 'test',
        meta: {
            title: '11',
        },
        component: () => import(/* webpackChunkName: "test" */ '../views/test.vue'),
    }

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
