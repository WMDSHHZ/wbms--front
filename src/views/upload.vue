<template>
    <div class="container">
        <div class="content-title">上传刷新软件包</div>

        <el-table :data="list">
            <el-table-column label="文件类型"></el-table-column>
            <el-table-column label="回读信息填写">
                <el-input></el-input>
            </el-table-column>
            <el-table-column label="操作">
                <el-button type="success"></el-button>
            </el-table-column>
        </el-table>

        <!--被隐藏的界面-->
        <el-main direction="vertical" style="visibility: hidden;">
            <div class="upload-main-area-1">
                <div class="upload-sub-area">
                    <el-upload
                    class="upload-demo"
                    drag
                    action="#"
                    :headers="headers"
                    :on-change="handle"
                    :http-request="upload"
                    :data="{type : 'FPA'}"
                >
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                    <el-text class="upload-name">FPA文件上传</el-text>
                    <el-input placeholder="请填写回读信息,例2.0.8.14"></el-input>
                </div>

                <div class="upload-sub-area">
                    <el-upload
                    class="upload-demo"
                    drag
                    action="http://jsonplaceholder.typicode.com/api/posts/"
                    multiple
                    :on-change="handle"
                    accept=".otap3"
                >
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                    <el-text class="upload-name">OPFW文件上传</el-text>
                    <el-input placeholder="请填写回读信息,例2.0.8.14"></el-input>
                </div>

                <div class="upload-sub-area">
                    <el-upload
                    class="upload-demo"
                    drag
                    action="http://jsonplaceholder.typicode.com/api/posts/"
                    multiple
                    :on-change="handle"
                    accept=".bin"
                >
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                    <el-text class="upload-name">BMS Container文件上传</el-text>
                    <el-input placeholder="请填写回读信息，例1027640944"></el-input>
                </div>
            </div>


            <div class="upload-main-area-2">
                <div class="upload-sub-area">
                    <el-upload
                    class="upload-demo"
                    drag
                    action="http://jsonplaceholder.typicode.com/api/posts/"
                    multiple
                    :on-change="handle"
                    accept=".bin"
                >
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                    <el-text class="upload-name">PMS Container文件上传</el-text>
                    <el-input placeholder="请填写回读信息，例1027640944"></el-input>
                </div>

                <div class="upload-sub-area">
                    <el-upload
                    class="upload-demo"
                    drag
                    action="http://jsonplaceholder.typicode.com/api/posts/"
                    method="put"
                    multiple
                    :on-change="handle"
                    accept=".bin"
                >
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                    <el-text class="upload-name">EMS Container文件上传</el-text>
                    <el-input placeholder="请填写回读信息，例1027640944"></el-input>
                </div>

                <div class="upload-sub-area" style="visibility: hidden;">
                    <el-upload
                    class="upload-demo"
                    drag
                    action="http://jsonplaceholder.typicode.com/api/posts/"
                    multiple
                    :on-change="handle"
                >
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                        </div>
                    </el-upload>
                    <el-text class="upload-name">类别六</el-text>
                </div>
            </div>

            <el-button>
                下一步
            </el-button>
        </el-main>
        
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
        type: 'BMS Container',
        info: '请填写回读信息,例1027640944'
    },
    {
        type: 'PMS Container',
        info: '请填写回读信息,例1027640944'
    },
    {
        type: 'EMS Container',
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
