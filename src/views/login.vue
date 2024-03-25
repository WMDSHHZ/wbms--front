<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">电池刷新管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="请输入用户名">
                        <template #prepend>
                            <el-button :icon="User"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="param.password"
                        @keyup.enter="submitForm(login)"
                    >
                        <template #prepend>
                            <el-button :icon="Lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm(login)">登录</el-button>
                </div>
                <el-checkbox class="login-tips" v-model="checked" label="记住密码" size="large" />
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import axios from 'axios';

interface LoginInfo {
    username: string;
    password: string;
}

const lgStr = localStorage.getItem('login-param');
const defParam = lgStr ? JSON.parse(lgStr) : null;
const checked = ref(lgStr ? true : false);

const router = useRouter();
const param = reactive<LoginInfo>({
    username: defParam ? defParam.username : '',
    password: defParam ? defParam.password : '',
});

const rules: FormRules = {
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const permiss = usePermissStore();
const login = ref<FormInstance>();

//登录校验
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;    //如果表单类型为undefined则返回
    formEl.validate((valid: boolean) => {
        if (valid) {

            let user = {
                "username": param.username,
                "password": param.password
            }
            
            axios.post('/user/checkPassword', user)
            .then(res => {
                ElMessage.success('登录成功');
                sessionStorage.setItem('ms_username', param.username);    //用于路由守卫
                //暂存用户信息
                sessionStorage.setItem('username', param.username)
                //权限认证##################################################
                axios.get('/user/role?username=' + param.username)
                .then(res => {
                    let role = res.data.userRole.role == 'admin' ? 'admin' : 
                               res.data.userRole.role == 'operator' ? 'operator' : 'super_admin'
                    sessionStorage.setItem('role', role)
                    const keys = permiss.defaultList[role];
                    permiss.handleSet(keys);
                    localStorage.setItem('ms_keys', JSON.stringify(keys));
                })
                .catch(error => {
                    console.log(error)
                    ElMessage.warning('验证失败,请检查网络连接,当前权限默认为普通用户')
                    const keys = permiss.defaultList['operator']
                    permiss.handleSet(keys);
                    localStorage.setItem('ms_keys', JSON.stringify(keys));
                })
                //###########################################################

                router.push('/import');
                if (checked.value) {
                    localStorage.setItem('login-param', JSON.stringify(param));
                } else {
                    localStorage.removeItem('login-param');
                }
                return true
            })
            .catch(error => {
                ElMessage.error('用户不存在，请检查用户名与密码')
                return false
            })
        } else {
            ElMessage.error('登录失败')
            return false
        }
    });
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #333;
    font-weight: bold;
    padding-top: 10px;
}
.ms-login {
    width: 350px;
    border-radius: 5px;
    background: #fff;
}
.ms-content {
    padding: 10px 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #333;
}
</style>
