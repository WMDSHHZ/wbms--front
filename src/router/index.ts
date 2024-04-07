import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus';

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
                    permiss: '1',
                },
                
                component: () => import(/* webpackChunkName: "import" */ '../views/import.vue'),
                
            },
            {
                path: '/upload',
                name: 'upload',
                meta: {
                    title: '上传刷新包',
                    permiss: '2',
                },
                beforeEnter: (to, from, next) => {
                    // 路由进入前的操作
                    if(sessionStorage.getItem('flag')  == 'true'){
                        next()
                    }else{
                        ElMessage.error('请先导入MAC地址')
                        next('/import')
                    }
                    
                },
                component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue'),
            },
            {
                path: '/task',
                name: 'task',
                meta: {
                    title: '任务管理',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "task" */ '../views/task.vue'),
            },
            {
                path: '/device',
                name: 'Device',
                meta: {
                    title: '设备管理',
                    permiss: '4',
                },
                component: () => import(/* webpackChunkName: "device" */ '../views/device.vue'),
            },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限管理',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission.vue'),
            },
            {
                path: '/settings',
                name: 'settings',
                meta: {
                    title: '系统设置',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "settings" */ '../views/settings.vue'),
            },
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
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    NProgress.start();
    const role = sessionStorage.getItem('ms_username');
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
