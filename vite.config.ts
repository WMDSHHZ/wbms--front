import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
	base: './',
	plugins: [
		vue(),
		VueSetupExtend(),
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		})
	],
	optimizeDeps: {
		include: ['schart.js']
	},
	/*
	server: {
		host: '1.15.154.157', //指定服务器应该监听哪个 IP 地址
		port: 5173,	//指定开发服务器端口
		strictPort: true, // 若端口已被占用则会直接退出
		open: false, // 启动时自动在浏览器中打开应用程序
	}
	*/
});
