<template>
    <div class="container">
        <div class="handle-box">
            <el-table :data="deviceList" class="table" border>
                <el-table-column label="设备名称" prop="name"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <div class="opreation">
                            <el-button size="small" @click="getDetail(scope.$index)" type="info" plain>详情</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div>
            <el-dialog v-model="infoDialog">
                details
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
            name: '123'
        },
        {
            name: '456'
        },
        {
            name: '789'
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