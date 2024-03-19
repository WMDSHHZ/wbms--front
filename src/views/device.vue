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
                <div v-if="taskList.length == null">
                    该设备空闲中
                </div>
                <el-table v-else :data="taskList">
                    <el-table-column label="组件名称" prop="suite_number"></el-table-column>
                </el-table>
            </el-dialog>
        </div>

    </div>
</template>

<script setup lang="ts" name="device">
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { ref, reactive } from "vue";


//获取设备列表
var deviceList = ref([])
var taskList = ref([]);
const getDeviceList = async () => {
  try {
    const res = await axios.get('/controllers');
    deviceList.value = res.data.controllerList;
  } catch (error) {
    ElMessage.error('无法获取设备信息，请检查网络连接')
    console.error(error);
  }
}


//获取详情
var infoDialog = ref(false)
const getDetail = (index: number) => {
    infoDialog.value = true
	//todo 待完善
    console.log(deviceList.value[index])
}

var taskInfoDialog = ref(false)
const getTask = (index: number) => {
    taskInfoDialog.value = true
    console.log(deviceList.value[index].status)
    if(deviceList.value[index].status == 'working'){
        //todo 任务相关待完善
        taskList.value = deviceList.value[index].tasks
    }else{
        taskList.value = []
    }
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