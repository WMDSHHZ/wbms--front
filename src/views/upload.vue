<template>
    <div class="container">
        <div class="content-title">
            <span>上传刷新软件包</span>
            <el-button 
            @click="forward" 
            type="success"
            style="margin-left: 20px;">上一步</el-button>
        </div>

        <!--
        <el-table 
        :data="list"
        border>
            <el-table-column 
            prop="title" 
            label="文件类型" />
            <el-table-column label="回读信息填写">
                <template #default="scope">
                    <el-input :placeholder="getInfo(scope.$index)" v-model="infoList[scope.$index]"></el-input> 
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-upload
                        :limit="1"
                        :on-change="handle"
                        :http-request="upload"
                        :on-exceed="handleExceed"
                        :show-file-list="true">
                        <el-button type="primary" icon="upload" plains @click="getType(scope.$index)">上传文件</el-button>
                    </el-upload>
                </template>
            </el-table-column>
        </el-table>
        -->
        <div class="uploadContainer">
            <div 
            v-for="(info, index) in uploadInfo1"
            :key="index">
                <el-upload
                :limit="1"
                :file-list="info.fileList"
                action="http://122.51.105.149:5000/file/input"
                :data="{ file_type: info.type }"
                :on-error="handleUploadError"
                :on-success="handleUploadSuccess"
                :on-progress="handleUploading"
                :on-change="handle"
                :on-exceed="handleExceed"
                :show-file-list="true"
                :on-remove="handleRemove"
                accept=".otap3"
                drag>
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">{{ info.title }}</div>
                    <div class="el-upload__text">拖拽文件至此或<em>点击上传</em></div>
                </el-upload>
            </div>
        </div>
        <div class="uploadContainer">
            <div 
            v-for="(info, index) in uploadInfo2"
            :key="index">
                <el-upload
                :limit="1"
                :file-list="info.fileList"
                action="http://122.51.105.149:5000/file/input"
                :data="{ file_type: info.type }"
                :on-error="handleUploadError"
                :on-success="handleUploadSuccess"
                :on-progress="handleUploading"
                :on-change="handle"
                :on-exceed="handleExceed"
                :show-file-list="true"
                :on-remove="handleRemove"
                accept=".bin"
                drag>
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">{{ info.title }}</div>
                    <div class="el-upload__text">拖拽文件至此或<em>点击上传</em></div>
                </el-upload>
            </div>
            <div style="visibility: hidden;">
                <el-upload
                drag>
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">占位控件</div>
                    <div class="el-upload__text">拖拽文件至此或<em>点击上传</em></div>
                </el-upload>
            </div>
        </div>


        <div class="titleContainer">
            <div>
                <el-text>主题：</el-text>
                <el-input placeholder="请输入主题"
                v-model="title"
                style="width: 60%;"/>
            </div>
            <div>
                <el-text>CRC码: </el-text>
                <el-input placeholder="请输入CRC码"
                v-model="CRCCode"
                style="width: 60%;"/>
            </div>
            <div>
                <el-text>版本: </el-text>
                <el-input placeholder="请输入版本"
                v-model="version"
                style="width: 60%;"/>
            </div>
        </div>
        <div style="display: flex; justify-content: center; margin-top: 50px;">
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
import { ElMessage, ElNotification } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const uploadInfo1 = ref([
    {
        title: 'CMU FPA文件上传',
        type: 'CMU_FPA',
        fileList: [],
    },
    {
        title: 'BRFM FPA文件上传',
        type: 'BRFM_FPA',
        fileList: [],
    },
    {
        title: 'CMU OPFW文件上传',
        type: 'CMU_OPFW',
        fileList: [],
    },
    {
        title: 'BRFM OPFW文件上传',
        type: 'BRFM_OPFW',
        fileList: [],
    },

])

const uploadInfo2 = ref([
    {
        title: 'BMS Container文件上传',
        type: 'BMS_CN',
        fileList: [],
    },
    {
        title: 'PMS Container文件上传',
        type: 'PMS_CN',
        fileList: [],
    },
    {
        title: 'EMS Container文件上传',
        type: 'EMS_CN',
        fileList: [],
    }
])


var upload_file

const handle = (rawFile: any) => {
    upload_file = rawFile
};

const handleRemove = () => {
    upload_file = null
}

const handleUploadError = () => {
    ElNotification.error("上传失败！")
}

const handleUploadSuccess = () => {
    ElNotification.success("上传成功！")
}

const handleUploading = () => {
    ElNotification({
    message: "上传中！"
  })
}


//返回MAC地址导入页面
const router = useRouter();
const forward = () => {
    router.push('/import')
}

//文件列表超出一个时发出提示
const handleExceed = () => {
    ElMessage.error('最多只能上传一个刷新包，请先将原来的刷新包删除后重新上传！')
}

const createTaskLoading = ref(false)

//创建任务
var title = ref()
const CRCCode = ref()
const version = ref()
const createTask = () => {
    let tempCRC = CRCCode.value
    let tempVersion = version.value
    //crc无输入
    if(CRCCode.value == null || CRCCode.value == '' || CRCCode.value == undefined){
        tempCRC = ' '
    }

    //版本无输入
    if(version.value == null || version.value == '' || version.value == undefined){
        tempVersion = ''
    }
    
    if(title.value == null || title.value == '' || title.value == undefined){
        //主题无输入
        ElMessage.error('请输入主题')
    }else if(upload_file == null){
        //刷新包文件未上传
        ElMessage.error('请先上传刷新包文件')
    }else {
        //创建任务 数据库同步信息
        createTaskLoading.value = true
        axios.put('/big/task/create?topic=' + title.value + 
                    '&targetcrc=' + tempCRC + 
                    '&targetversion=' + tempVersion)
        .then(res => {
            ElMessage.success('任务创建成功')
            createTaskLoading.value = false
            initPage()
        })
        .catch(error => {
            ElMessage.error('任务创建失败，请稍后再试')
            createTaskLoading.value = false
        })
    }
}

//任务创建成功后执行函数
const initPage = () => {
    title.value = ''    //重置标题信息
    CRCCode.value = ''
    version.value = ''
    upload_file.value = null
    for(let i=0;i<uploadInfo1.value.length;i++){
        uploadInfo1.value[i].fileList = []
    }
    for(let i=0;i<uploadInfo2.value.length;i++){
        uploadInfo1.value[i].fileList = []
    }
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
.uploadContainer{
    display: flex; 
    justify-content: space-between;
    margin-top: 20px;
}
.uploadBtnContainer{
}
.el-text{
    margin-bottom: 20px;
}
</style>
