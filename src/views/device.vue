<template>
    <div class="container">
        <div class="handle-box">
            <el-table 
            :data="deviceList" 
            class="table" 
            v-loading="getDeviceListLoading"
            element-loading-text="获取设备信息中......"
            border>
                <el-table-column label="设备名称" prop="name"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <div class="opreation">
                            <!---<el-button size="small" @click="getDetail(scope.$index)" type="info" plain>详情</el-button>-->
                            <el-button size="small" @click="getTask(scope.$index)" type="info" plain>任务查看</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div>
            <el-dialog 
            width="75%"
            v-model="taskInfoDialog">
                <div class="selectContainer">
                    <el-space :spacer="spacer">
                        <span>筛选条件</span>
                        <el-date-picker
                            v-model="dateValue"
                            type="daterange"
                            range-separator="To"
                            start-placeholder="起始日期"
                            end-placeholder="结束日期"
                            value-format="YYYY-MM-DD"
                        />
                        <el-input placeholder="托号" v-model="palletNumberValue"></el-input>
                        <el-button @click="check">筛选</el-button>
                    </el-space>
                </div>
                <div v-if="status" class="status">
                    该设备空闲中
                </div>
                <div v-else class="status">
                    该设备执行任务中
                </div>
                <el-table :data="taskListForShow" border>
                    <el-table-column label="组件名称" prop="pallet_number"></el-table-column>
                    <el-table-column label="扫描时间" prop="scan_time"></el-table-column>
                    <el-table-column label="任务状态" prop="status"></el-table-column>
                </el-table>
                <el-pagination
				v-model:current-page="currentPage"
				v-model:page-size="pageSize"
				layout="total, prev, pager, next, jumper"
				:total="totalPage"
				@current-change="handleCurrentChange"
				/>
            </el-dialog>
        </div>

    </div>
</template>

<script setup lang="ts" name="device">
import axios from 'axios';
import { ElDivider, ElMessage } from 'element-plus';
import { ref, onBeforeMount, h } from "vue";


//获取设备列表
var deviceList = ref([])
var taskList = ref([]);
const getDeviceListLoading = ref(false)

const getDeviceList = () => {
    getDeviceListLoading.value = true
    axios.get('/controllers')
    .then(res => {
        deviceList.value = res.data.controllerList;
        getDeviceListLoading.value = false
        ElMessage.success('设备信息获取成功')
    })
    .catch(error => {
        getDeviceListLoading.value = false
        ElMessage.error('无法获取设备信息，请检查网络连接')
    })
}

var taskInfoDialog = ref(false)
const status = ref(true)    //true表示该设备空闲中
const getTask = (index: number) => {
    taskInfoDialog.value = true
    taskList.value = deviceList.value[index].tasks
    if(deviceList.value[index].status == 'working'){
        currentPage.value = 1
        status.value = false
    }else{
        status.value = true
    }
    handleCurrentChange()
}

//分页设置
const taskListForShow = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPage = ref(0)

const handleCurrentChange = () => {
    let tempList
	if((dateValue.value == undefined || dateValue.value.length == 0) && 
    (palletNumberValue.value == '' || palletNumberValue.value == undefined)){
		//没有筛选信息，show数组信息应从原始数组中获取
        console.log("111")
		tempList = taskList.value      
	}else{
		//有筛选信息，show数组信息应从select数组中获取
        console.log("222")
		tempList = taskListForSelected.value
	}

        totalPage.value = tempList.length

    let temp
    taskListForShow.value = []
    if(currentPage.value*pageSize.value > tempList.length){
        temp = tempList.slice((currentPage.value-1)*pageSize.value)
    }else{
        temp = tempList.slice((currentPage.value-1)*pageSize.value, 
                                    currentPage.value*pageSize.value)
    }
    taskListForShow.value = taskListForShow.value.concat(temp)
}

//筛选设置
const spacer = h(ElDivider, { direction: 'vertical'})
const dateValue = ref([])
const palletNumberValue = ref()
const taskListForSelected = ref([]) //用于保存筛选后符合条件的内容

const check = () => {
    console.log(dateValue.value)
    console.log(palletNumberValue.value)
	//筛选条件为空，则展示所有信息(Show数组信息从原始数组中获得)不为空则进入判断
	if(dateValue.value !== undefined || palletNumberValue.value !== ''){
        let showDataList = []
        let dataList = taskList.value
        for(let i=0;i<dataList.length;i++){
            //如果时间选项不存在
            if(dateValue.value == undefined || dateValue.value.length == 0){
                if(dataList[i].pallet_number == palletNumberValue.value){
                    showDataList.push(dataList[i])
                }
            }else{
                //如果时间选项存在
                //先判断mac地址是否为空
                if(palletNumberValue.value == '' || palletNumberValue.value == undefined){
                    //若mac地址为空则根据时间筛选
                    if(dataList[i].scan_time.slice(0,10) >= dateValue.value[0] && dataList[i].scan_time.slice(0,10) <= dateValue.value[1]){
                        showDataList.push(dataList[i])
                    }
                }else{
                    //否则根据两者筛选
                    if(dataList[i].scan_time.slice(0,10) >= dateValue.value[0] && dataList[i].scan_time.slice(0,10) <= dateValue.value[1] &&
                        dataList[i].pallet_number == palletNumberValue.value){
                        showDataList.push(dataList[i])
                    }
                }
            }

            taskListForSelected.value = showDataList
        }
        
	}

    currentPage.value = 1
    handleCurrentChange()

}

onBeforeMount(async () => {
    await getDeviceList()
})
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
.status{
    margin-bottom: 10px;
}
.selectContainer{
	margin-bottom: 10px;
}
</style>