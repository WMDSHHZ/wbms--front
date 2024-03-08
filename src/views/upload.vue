<template>
    <div class="container">
        <div class="content-title">上传刷新软件包</div>
        <el-table :data="list">
            <el-table-column prop="title" label="文件类型" width="200px"></el-table-column>
            <el-table-column prop="info" label="回读信息填写">
                <template #default="scope">
                    <el-input :placeholder="getInfo(scope.$index)"></el-input> 
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140px">
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
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ElMessage } from 'element-plus';

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

var upload_file, file_type
const headers = {
    'Content-Type': 'multipart/form-data'
}
const handle = (rawFile: any) => {
    upload_file = rawFile
    console.log(rawFile);
};

const upload = () => {
    console.log(upload_file.raw.name)
    console.log(file_type)
    var param = new FormData();
    param.append("file", upload_file.raw)
    param.append("file_type", file_type)
    console.log(param.get("file"))

    axios.post('/file/output', param)
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
    console.log(file_type)
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
.upload-demo {
    width: 360px;
}

.upload-main-area-1{
    display: flex;
    justify-content: space-between;
}

.upload-main-area-2{
    display: flex;
    justify-content: space-between;
}

.upload-sub-area{
    margin-top: 20px;
    align-content: center;
}

.upload-name{

}
</style>
