<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="sidebar.collapse"
            background-color="#f1f4f3"
            text-color="black"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items" :key="item.index">
                <el-menu-item :index="item.index"  v-permiss="item.permiss">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <template #title>{{ item.title }}</template>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';

const items = [
    {
        icon: 'upload',
        index: '/import',
        title: '任务创建',
        permiss: '1',
    },
    {
        icon: 'DocumentCopy',
        index: '/task',
        title: '任务管理',
        permiss: '3',
    },
    {
        icon: 'Setting',
        index: '/device',
        title: '设备管理',
        permiss: '4',
    },
    {
        icon: 'lock',
        index: '/permission',
        title: '账号管理',
        permiss: '5',
    },
    {
        icon: 'Setting',
        index: '/settings',
        title: '系统设置',
        permiss: '6',
    },
];

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
