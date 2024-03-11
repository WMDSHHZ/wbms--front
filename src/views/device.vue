<template>
    <div class="container">
        <div class="handle-box">
            <el-table :data="deviceList" class="table" border>
                <el-table-column label="设备名称" prop="name"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <div class="opreation">
                            <el-button size="small" @click="getDetail(scope.$index)" type="info" plain>详情</el-button>
                            <el-button size="small" @click="getTask(scope.$index)" type="info" plain>任务查看</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div>
            <el-dialog v-model="infoDialog">
                设备详情
            </el-dialog>

            <el-dialog v-model="taskInfoDialog">
                任务信息
            </el-dialog>
        </div>

    </div>
</template>

<script setup lang="ts" name="device">
import axios from 'axios';
import { ref, reactive } from "vue";

//获取设备列表
var deviceList = reactive([])
const getDeviceList = () => {
    deviceList = [
        {
            name: '设备1'
        },
        {
            name: '设备2'
        },
        {
            name: '设备3'
        },
        {
            name: '设备4'
        },
        {
            name: '设备5'
        }
    ]
}

//获取详情
var infoDialog = ref(false)
const getDetail = (index: number) => {
    console.log(infoDialog.value)
    infoDialog.value = true
    console.log(infoDialog.value)
	//todo 待完善
}

var taskInfoDialog = ref(false)
const getTask = (index: number) => {
    taskInfoDialog.value = true
    //todo 待完善
}

getDeviceList()
</script>

<style scoped>
.handle-box {
    display: flex;
    margin-bottom: 20px;
}

.table {
    width: 100%;
    font-size: 14px;
}
</style>