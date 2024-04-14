<template>
    <div class="container">
        <div class="content-title">
            <span>上传刷新软件包</span>
            <el-button 
            @click="forward" 
            type="success"
            style="margin-left: 20px;">上一步</el-button>
        </div>

        <el-table 
        :data="list"
        border>
            <el-table-column 
            prop="title" 
            label="文件类型" 
            width="270px"/>
            <el-table-column label="回读信息填写">
                <template #default="scope">
                    <el-input :placeholder="getInfo(scope.$index)" v-model="infoList[scope.$index]"></el-input> 
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
                <template #default="scope">
                    <el-upload
                        :on-change="handle"
                        :http-request="upload"
                        :show-file-list="false">
                        <el-button type="primary" icon="upload" plains @click="getType(scope.$index)">上传文件</el-button>
                    </el-upload>
                </template>
            </el-table-column>
        </el-table>

        <div class="titleContainer">
            <el-text>主题：</el-text>
            <el-input placeholder="请输入主题"
            v-model="title"
            style="width: 80%;"/>
            <el-button 
            @click="createTask" 
            type="success"
            v-loading.fullscreen.lock="createTaskLoading"
            element-loading-text="创建任务中，请稍后"
            style="width: 200px;">创建任务</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const list = [
    {
        title: 'CMU FPA文件上传',
        info: '请填写回读信息,例2.0.8.14',
        type: 'CMU_FPA'
    },
    {
        title: 'BRFM FPA文件上传',
        info: '请填写回读信息,例2.0.8.14',
        type: 'BRFM_FPA'
    },
    {
        title: 'CMU OPFW文件上传',
        info: '请填写回读信息,例2.0.8.14',
        type: 'CMU_OPFW'
    },
    {
        title: 'BRFM OPFW文件上传',
        info: '请填写回读信息,例2.0.8.14',
        type: 'BRFM_OPFW'
    },
    {
        title: 'BMS Container文件上传',
        info: '请填写回读信息,例1027640944',
        type: 'BMS_CN'
    },
    {
        title: 'PMS Container文件上传',
        info: '请填写回读信息,例1027640944',
        type: 'PMS_CN'
    },
    {
        title: 'EMS Container文件上传',
        info: '请填写回读信息,例1027640944',
        type: 'EMS_CN'
    }
]

//回读信息列表
var infoList = ref([])

var upload_file, file_type

const handle = (rawFile: any) => {
    upload_file = rawFile
};

const upload = () => {
    var param = new FormData();
    param.append("file", upload_file.raw)
    param.append("file_type", file_type)

    axios.post('/file/input', param)
    .then(res => {
        ElMessage({
            type: 'success',
            message: '上传成功'
        })
    })
    .catch(function (error){
        ElMessage({
            type: 'error',
            message: '上传失败，请检查网络或文件类型'
        })
        console.log(error.response.data)
    })
}

const getInfo = (index: number) => {
    return list[index].info
}

const getType = (index: number) => {
    file_type = list[index].type
}

//返回MAC地址导入页面
const router = useRouter();
const forward = () => {
    router.push('/import')
}

const createTaskLoading = ref(false)

//创建任务
var title = ref()
const createTask = () => {
    if(title.value != null && upload_file != null){
        //创建任务 数据库同步信息
        createTaskLoading.value = true
        axios.put('/big/task/create?topic=' + title.value)
        .then(res => {
            ElMessage.success('任务创建成功')
            createTaskLoading.value = false
            initPage()
        })
        .catch(error => {
            ElMessage.error('任务创建失败，请稍后再试')
            createTaskLoading.value = false
        })
    }else{
        if(upload_file != null){
            ElMessage.error('请输入主题')
        }else{
            ElMessage.error('请先上传刷新包文件')
        }
    }
}

//任务创建成功后执行函数
const initPage = () => {
    infoList.value = [] //重置回读信息
    title.value = ''    //重置标题信息
    upload_file = null
    sessionStorage.setItem('refresh', 'true')
    forward()
}

</script>

<style scoped>
.content-title {
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
.titleContainer{
    display: flex; 
    justify-content: space-between;
    margin-top: 15px;
}
</style>
