<template>
    <div class="container">
        <div class="content-title">上传刷新软件包</div>
        <el-table :data="list">
            <el-table-column prop="type" label="文件类型" width="200px"></el-table-column>
            <el-table-column prop="info" label="回读信息填写">
                <template #default="scope">
                    <el-input :placeholder="getinfo(scope.$index)"></el-input> 
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140px">
                <el-button type="primary" icon="upload" plain>上传文件</el-button>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';

const list = [
    {
        type: 'CMU FPA文件上传',
        info: '请填写回读信息,例2.0.8.14'
    },
    {
        type: 'BRFM FPA文件上传',
        info: '请填写回读信息,例2.0.8.14'
    },
    {
        type: 'CMU OPFW文件上传',
        info: '请填写回读信息,例2.0.8.14'
    },
    {
        type: 'BRFM OPFW文件上传',
        info: '请填写回读信息,例2.0.8.14'
    },
    {
        type: 'BMS Container文件上传',
        info: '请填写回读信息,例1027640944'
    },
    {
        type: 'PMS Container文件上传',
        info: '请填写回读信息,例1027640944'
    },
    {
        type: 'EMS Container文件上传',
        info: '请填写回读信息,例1027640944'
    }
]

var upload_file
const headers = {
    'Content-Type': 'multipart/form-data'
}
const handle = (rawFile: any) => {
    upload_file = rawFile
    console.log(rawFile);
};

const upload = () => {
    console.log(upload_file.raw.name)
    var param = new FormData();
    param.append("file", upload_file.raw)
    console.log(param.get("file"))

    axios.post('/file/output', param)
    .catch(function (error){
        console.log(error.response.data)
    })
}

const getinfo = (index: number) => {
    return list[index].info
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
