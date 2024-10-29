<template>
	<div class="header">
		<!-- 折叠按钮 -->
		<div class="collapse-btn" @click="collapseChage">
			<el-icon v-if="sidebar.collapse"><Expand /></el-icon>
			<el-icon v-else><Fold /></el-icon>
		</div>
		<div class="logo">
			<el-avatar shape="square" :size="80" fit="cover" :src="url2" class="pic"/>
			<el-divider direction="vertical" class="el-divider" style=""/>
			<el-avatar shape="square" :size="80" fit="cover" :src="url1" class="pic"/>
		</div>
		<div class="header-right">电池软件升级运维系统</div>
	</div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRouter } from 'vue-router';
import imgurl from '../assets/img/img.jpg';
import pic1 from '../assets/img/img.png'
import pic2 from '../assets/img/img1.jpg'

const username: string | null = localStorage.getItem('ms_username');
const message: number = 2;

const url1 = pic1
const url2 = pic2

const sidebar = useSidebarStore();
// 侧边栏折叠
const collapseChage = () => {
	sidebar.handleCollapse();
};

onMounted(() => {
	if (document.body.clientWidth < 1500) {
		collapseChage();
	}
});

// 用户名下拉菜单选择事件
const router = useRouter();
const handleCommand = (command: string) => {
	if (command == 'loginout') {
		localStorage.removeItem('ms_username');
		router.push('/login');
	} else if (command == 'user') {
		router.push('/user');
	}
};
</script>
<style scoped>
.header {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 70px;
	font-size: 22px;
	background-color: #C0C4CC;
}
.collapse-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	float: left;
	padding: 0 21px;
	cursor: pointer;
	color: black
}
.header .logo {
	float: left;
	width: 250px;
	line-height: 70px;
	display: flex;
}
.header-right {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	float: right;
	padding: 0 21px;
	cursor: pointer;
}
.pic{
	margin-left: 5px;
	margin-right: 5px;
	margin-top: 8px;
}
.el-divider{
	border-color: black; 
	height: 60px; 
	margin-top: 5px;
}
</style>
