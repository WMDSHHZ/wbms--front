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
import { ElMessage } from 'element-plus';

const app = createApp(App);
app.use(createPinia());
app.use(router);
//axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.baseURL = "http://122.51.105.149:5000";
axios.defaults.timeout = 20000
app.config.globalProperties.$axios = axios;
//app.config.globalProperties.$target = "http://localhost:5000";
app.config.globalProperties.$target = "http://122.51.105.149:5000";
app.config.globalProperties.$config = {
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
};

// 设置 Axios 请求拦截器
axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 设置 Axios 响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response;
  },
  error => {
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      // 可以在这里显示一个超时提示
      ElMessage.error('请求超时，请稍后重试');
    }
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

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
