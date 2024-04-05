import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import router from './router';
import { usePermissStore } from './store/permiss';
import 'element-plus/dist/index.css';
import './assets/css/icon.css';
import axios from "axios";
import 'lib-flexible/flexible.js'

const app = createApp(App);
app.use(createPinia());
app.use(router);
axios.defaults.baseURL = "http://localhost:5000";
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$target = "http://localhost:5000";
app.config.globalProperties.$config = {
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
};

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
// 自定义权限指令
const permiss = usePermissStore();
app.directive('permiss', {
    mounted(el, binding) {
        if (!permiss.key.includes(String(binding.value))) {
            el['hidden'] = true;
        }
    },
});

app.mount('#app');
