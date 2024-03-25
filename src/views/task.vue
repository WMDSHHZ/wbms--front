<template>
	<div class="container">
		<el-tabs v-model="message">
			<el-tab-pane :label="`待审批任务(${taskList.unread.length})`" name="first">
				<el-table :data="taskListForShow.unread" style="width: 100%" border>
					<el-table-column prop="id" label="编号" width="180"></el-table-column>
					<el-table-column prop="title" label="主题"></el-table-column>
					<el-table-column width="200" label="操作">
						<template #default="scope">
							<div class="opreation">
								<el-button size="small" @click="unreadToRead(scope.$index)" type="success" plain>通过</el-button>
								<el-button size="small" @click="readToBack(scope.$index)" type="danger" plain>驳回</el-button>
								<el-button size="small" @click="getTaskDetail(scope.$index,'unread')" type="info" plain>详情</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
				v-model:current-page="currentPage.unread"
				v-model:page-size="pageSize"
				layout="total, prev, pager, next, jumper"
				:total="taskList.unread.length"
				@current-change="handleCurrentChange('unread')"
				/>
				<div class="handle-row">
					<el-button type="primary" @click="readAll">全部通过</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane :label="`已审批任务(${taskList.pass.length})`" name="second">
				<template v-if="message === 'second'">
					<el-table :data="taskListForShow.pass" style="width: 100%" border>
						<el-table-column prop="id" label="编号" width="180"></el-table-column>
						<el-table-column prop="title" label="主题"></el-table-column>
						<el-table-column width="200" label="操作">
							<template #default="scope">
								<div class="opreation">
									<el-button type="danger" size="small" @click="passToStop(scope.$index)" plain>停止</el-button>
									<el-button size="small" @click="getTaskDetail(scope.$index,'pass')" type="info" plain>详情</el-button>
								</div>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination
					v-model:current-page="currentPage.pass"
					v-model:page-size="pageSize"
					layout="total, prev, pager, next, jumper"
					:total="taskList.pass.length"
					@current-change="handleCurrentChange('pass')"
					/>
				</template>
			</el-tab-pane>
			<el-tab-pane :label="`已驳回任务(${taskList.back.length})`" name="third">
				<template v-if="message === 'third'">
					<el-table :data="taskListForShow.back" style="width: 100%" border>
						<el-table-column prop="id" label="编号" width="180"></el-table-column>
						<el-table-column prop="title" label="主题"></el-table-column>
						<el-table-column width="200" label="操作">
							<template #default="scope">
								<div class="opreation">
									<el-button size="small" @click="backToPass(scope.$index)" type="success" plain>恢复</el-button>
									<el-button size="small" @click="getTaskDetail(scope.$index,'back')" type="info" plain>详情</el-button>
								</div>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination
					v-model:current-page="currentPage.back"
					v-model:page-size="pageSize"
					layout="total, prev, pager, next, jumper"
					:total="taskList.back.length"
					@current-change="handleCurrentChange('back')"
					/>
				</template>
			</el-tab-pane>
		</el-tabs>
		
		<div>
			<el-dialog 
			v-model="allocateTaskDialog" 
			title="请选择要分配的设备"
			@close="handleAllocatedChange">
				<el-checkbox-group v-model="selectedDeviceList">
					<el-checkbox
					v-for="(device, index) in deviceList"
					:key="index"
					:label="device.name"
					:disabled="!device.status" 
					:min="1">
						{{ device.name }}
					</el-checkbox>
				</el-checkbox-group>
				<el-button type="success" plain @click="allocateTaskDialog = false;selected = true" size="small">确定</el-button>
				<el-button type="danger" plain @click="allocateTaskDialog = false;selected = false" size="small">取消</el-button>
			</el-dialog>
		</div>

		<div>
			<el-dialog 
			v-model="infoDialog" 
			width="90%" 
			:modal="false" 
			:draggable="true">
				<div>
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
							<el-input placeholder="MAC地址" v-model="macValue"></el-input>
							<el-button @click="check">筛选</el-button>
						</el-space>
					</div>
				</div>
				<el-tabs v-model="page">
					<el-tab-pane :label="`已完成(${taskStatus.finish})`" name="first">
						<el-table :data="reflashData.finish" border class="table" style="width: 100%" >
							<el-table-column prop="suite_number" label="托号"></el-table-column>
							<el-table-column prop="mac_address" label="MAC地址"></el-table-column>
							<el-table-column v-if="reflashData.type == 'pass'" label="版本号">
								<el-table-column label="刷新前版本号">
									<template #default="scope">
										{{ reflashData.finish[scope.$index].version_info.FIRMWARE.oldversion }}
									</template>
								</el-table-column>
								<el-table-column label="刷新后版本号">
									<template #default="scope">
										{{ reflashData.finish[scope.$index].version_info.FIRMWARE.newversion}}
									</template>
								</el-table-column>
						    </el-table-column>
							<el-table-column v-else label="目标版本号"></el-table-column>
							<el-table-column prop="status" label="刷新状态"></el-table-column>
							<el-table-column prop="update_time" label="刷新时间"></el-table-column>
							<el-table-column v-if="reflashData.type == 'pass'" prop="device_id" label="执行任务设备编号"></el-table-column>
							<el-table-column label="操作">
								<template #default="scope">
									<div class="opreation">
										<el-button size="small" @click="getInsideDetail(reflashData.finish[scope.$index].mac_address)" type="info" plain>详情</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane :label="`刷新中(${taskStatus.working})`" name="second">
						<el-table :data="reflashData.working" border class="table" style="width: 100%" >
							<el-table-column prop="suite_number" label="托号"></el-table-column>
							<el-table-column prop="mac_address" label="MAC地址"></el-table-column>
							<el-table-column label="版本号">
								<el-table-column label="刷新前版本号">
									<template #default="scope">
										{{ reflashData.working[scope.$index].version_info.FIRMWARE.oldversion }}
									</template>
								</el-table-column>
								<el-table-column label="刷新后版本号">
									<template #default="scope">
										{{ reflashData.working[scope.$index].version_info.FIRMWARE.newversion}}
									</template>
								</el-table-column>
						    </el-table-column>
							<el-table-column prop="status" label="刷新状态"></el-table-column>
							<el-table-column prop="update_time" label="刷新时间"></el-table-column>
							<el-table-column label="操作">
								<template #default="scope">
									<div class="opreation">
										<el-button size="small" @click="getInsideDetail(reflashData.working[scope.$index].mac_address)" type="info" plain>详情</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>

					<el-tab-pane :label="`刷新失败(${taskStatus.failed})`" name="third">
						<el-table :data="reflashData.failed" border class="table" style="width: 100%" >
							<el-table-column prop="suite_number" label="托号"></el-table-column>
							<el-table-column prop="mac_address" label="MAC地址"></el-table-column>
							<el-table-column label="版本号">
								<el-table-column label="刷新前版本号">
									<template #default="scope">
										{{ reflashData.failed[scope.$index].version_info.FIRMWARE.oldversion }}
									</template>
								</el-table-column>
								<el-table-column label="刷新后版本号">
									<template #default="scope">
										{{ reflashData.failed[scope.$index].version_info.FIRMWARE.newversion}}
									</template>
								</el-table-column>
						    </el-table-column>
							<el-table-column prop="status" label="刷新状态"></el-table-column>
							<el-table-column prop="update_time" label="刷新时间"></el-table-column>
							<el-table-column label="操作">
								<template #default="scope">
									<div class="opreation">
										<el-button size="small" @click="getInsideDetail(reflashData.failed[scope.$index].mac_address)" type="info" plain>详情</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</el-dialog>


			<el-dialog 
			v-model="insideInfoDialog" 
			width="80%" 
			:modal="false" 
			:draggable="true">
				<el-table :data="reflashDetailData">
					<el-table-column prop="mac_address" label="MAC地址"></el-table-column>
					<el-table-column prop="module_number" label="模组编号"></el-table-column>
					<el-table-column prop="product_number" label="产品编号"></el-table-column>
					<el-table-column prop="status" label="状态"></el-table-column>
					<el-table-column prop="suite_number" label="托号"></el-table-column>
					<el-table-column prop="trace_code" label="回退码"></el-table-column>
					<el-table-column prop="update_time" label="更新时间"></el-table-column>
					<el-table-column label='版本信息'>
						<el-table-column label="校验码">
							<el-table-column label="旧校验码">
								<template #default="scope">
									{{ reflashDetailData[scope.$index].version_info.BMS_CONTAINER.oldcrc }}
								</template>
							</el-table-column>
							<el-table-column label="新校验码">
								<template #default="scope">
									{{ reflashDetailData[scope.$index].version_info.BMS_CONTAINER.newcrc }}
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column label="版本号">
							<el-table-column label="刷新前版本号">
								<template #default="scope">
									{{ reflashDetailData[scope.$index].version_info.FIRMWARE.oldversion }}
								</template>
							</el-table-column>
							<el-table-column label="刷新后版本号">
								<template #default="scope">
									{{ reflashDetailData[scope.$index].version_info.FIRMWARE.newversion}}
								</template>
							</el-table-column>
						</el-table-column>
					</el-table-column>
				</el-table>
			</el-dialog>


		</div>
	</div>
</template>

<script setup lang="ts" name="tabs">
import { ref, reactive, h } from 'vue';
import { ElDivider, ElMessage } from 'element-plus';
import axios from 'axios';

const message = ref('first');
var taskList = reactive({
	unread: [
		{
			id: '202101010001',
			date: '2018-04-19 20:00:00',
			title: '升级至2.0.8.10'
		},
		{
			id: '202101010002',
			date: '2018-04-19 21:00:00',
			title: '升级至2.0.8.8'
		},
		{
			id: '202101010003',
			date: '2018-04-19 20:00:00',
			title: '升级至2.0.8.10'
		},
		{
			id: '202101010004',
			date: '2018-04-19 21:00:00',
			title: '升级至2.0.8.8'
		},
		{
			id: '202101010005',
			date: '2018-04-19 20:00:00',
			title: '升级至2.0.8.10'
		},
		{
			id: '202101010006',
			date: '2018-04-19 21:00:00',
			title: '升级至2.0.8.8'
		},
		{
			id: '202101010007',
			date: '2018-04-19 20:00:00',
			title: '升级至2.0.8.10'
		},
		{
			id: '202101010008',
			date: '2018-04-19 21:00:00',
			title: '升级至2.0.8.8'
		},		{
			id: '202101010009',
			date: '2018-04-19 20:00:00',
			title: '升级至2.0.8.10'
		},
		{
			id: '202101010010',
			date: '2018-04-19 21:00:00',
			title: '升级至2.0.8.8'
		},
		{
			id: '202101010011',
			date: '2018-04-19 20:00:00',
			title: '升级至2.0.8.10'
		},
		{
			id: '202101010012',
			date: '2018-04-19 21:00:00',
			title: '升级至2.0.8.8'
		}
	],
	pass: [
		{
			id: '202101010003',
			date: '2018-04-19 20:00:00',
			title: '升级至2.0.8.8'
		}
	],
	back:[
		{
			id: '202101010004',
			date: '2018-04-19 20:00:00',
			title: '升级至2.0.8.10'
		},
		{
			id: '202101010005',
			date: '2018-04-19 21:00:00',
			title: '升级至2.0.8.10'
		}
	]
});
var taskListForShow = reactive({
	unread: [],
	pass: [],
	back: []
})
const spacer = h(ElDivider, { direction: 'vertical' })

const page = ref('first')

interface reflashInfo {
	mac_address: string;
    module_number: string;
    product_number: string;
    status: string;
    suite_number: string;
    trace_code: string;
    update_time: string;
    version_info: string;
}

//var reflashData = ref<reflashInfo[]>([])
var reflashDetailData = ref([
	{
		mac_address: "64F9C0000022BC9F",
		module_number: "00FMEASY000004DBV0190513",
		product_number: "1234811BS40644",
		status: "finish",
		suite_number: "BEV(1416)S311088",
		trace_code: "NS23331MASY40513",
		update_time: "2024-03-09 15:36:55",
		version_info: {
			BMS_CONTAINER: {
			newcrc: "1827640944",
			oldcrc: "1027640944"
			},
			FIRMWARE: {
			newversion: "2.0.8.22",
			oldversion: "2.0.8.10"
			}
		}
	}
])
var reflashData = reactive({
	finish: [
		{
			mac_address: "64F9C0000022BC9F",
			module_number: "00FMEASY000004DBV0190513",
			product_number: "1234811BS40644",
			status: "finish",
			suite_number: "BEV(1416)S311088",
			trace_code: "NS23331MASY40513",
			update_time: "2024-03-09 15:36:55",
			version_info: {
				BMS_CONTAINER: {
				newcrc: "1827640944",
				oldcrc: "1027640944"
				},
				FIRMWARE: {
				newversion: "2.0.8.22",
				oldversion: "2.0.8.10"
				}
			}
		},
		{
			mac_address: "64F9C0000022BC9F",
			module_number: "00FMEASY000004DBV0190513",
			product_number: "1234811BS40644",
			status: "finish",
			suite_number: "BEV(1416)S311088",
			trace_code: "NS23331MASY40513",
			update_time: "2024-03-09 15:36:55",
			version_info: {
				BMS_CONTAINER: {
				newcrc: "1827640944",
				oldcrc: "1027640944"
				},
				FIRMWARE: {
				newversion: "2.0.8.22",
				oldversion: "2.0.8.10"
				}
			}
		}
	],
	working: [
		{
			mac_address: "64F9C0000022BC9F",
			module_number: "00FMEASY000004DBV0190513",
			product_number: "1234811BS40644",
			status: "working",
			suite_number: "BEV(1416)S311088",
			trace_code: "NS23331MASY40513",
			update_time: "2024-03-09 15:36:55",
			version_info: {
				BMS_CONTAINER: {
				newcrc: "1827640944",
				oldcrc: "1027640944"
				},
				FIRMWARE: {
				newversion: "2.0.8.22",
				oldversion: "2.0.8.10"
				}
			}
		}
	],
	failed: [
		{
			mac_address: "64F9C0000022BC9F",
			module_number: "00FMEASY000004DBV0190513",
			product_number: "1234811BS40644",
			status: "failed",
			suite_number: "BEV(1416)S311088",
			trace_code: "NS23331MASY40513",
			update_time: "2024-03-09 15:36:55",
			version_info: {
				BMS_CONTAINER: {
				newcrc: "1827640944",
				oldcrc: "1027640944"
				},
				FIRMWARE: {
				newversion: "2.0.8.22",
				oldversion: "2.0.8.10"
				}
			}
		}
	],
	type: 'pass'
})

var taskStatus = reactive({
	finish: 2,
	working: 1,
	failed: 1
})

var deviceList = ref([
	{
		name: '设备一',
		status: true,
	},
	{
		name: '设备二',
		status: true,
	},
	{
		name: '设备三',
		status: true,
	},	{
		name: '设备四',
		status: true,
	},	{
		name: '设备五',
		status: true,
	}
])
//待处理->通过
var allocateTaskDialog = ref(false)
var readIndex = 0
const unreadToRead = (index: number) => {
	allocateTaskDialog.value = true
	readIndex = index	
	//todo 设备分配
	
};

var selectedDeviceList = ref([])
var selected = false
const handleAllocatedChange = () => {
	if(selectedDeviceList.value.length == 0 && selected){
		ElMessage({
			type: 'error',
			message: '未选择设备'
		})
	}else if(selected){
		for(let i=0;i<selectedDeviceList.value.length;i++){
			for(let j=0;j<deviceList.value.length;j++){
				if(selectedDeviceList.value[i] == deviceList.value[j].name){
					deviceList.value[j].status = false
				}
			}
		}
		let item = taskList.unread.splice(readIndex, 1);
		taskList.pass = item.concat(taskList.pass);
	}
	selectedDeviceList = ref([])
	
	//todo 数据同步到数据库
}

//待处理->驳回
const readToBack = (index: number) => {
	let item = taskList.unread.splice(index, 1)
	taskList.back = item.concat(taskList.back)
}

//驳回->通过
const backToPass = (index: number) => {
	let item = taskList.back.splice(index, 1)
	taskList.pass = item.concat(taskList.pass)
}

//停止处理该任务
const passToStop = (index: number) => {
	taskList.pass.splice(index, 1)
	//todo 待完善
}

//获取任务详情
var infoDialog = ref(false)
const getTaskDetail = (index: number, type: string) => {
	infoDialog.value = true
	reflashData.type = type
	//todo 待完善
}

//获取任务更加详情信息
var insideInfoDialog = ref(false)
const getInsideDetail = (id: string) => {
	insideInfoDialog.value = true
	/*
	axios.get('/device/detailedInfo' + id)
	.then(res => {
		
		console.log(res)
	})
	.catch(error => {
		ElMessage({
			type: 'error',
			message: '获取刷新详细记录失败，请检查网络连接或稍后重试'
		})
	})
	*/
	
	console.log(id)
}

//全部通过
const readAll = () => {
	let item = taskList.unread.splice(0,taskList.unread.length)
	taskList.pass = item.concat(taskList.pass);
}

//获取任务列表
const getTask = () => {
	//todo
	handleCurrentChange('unread')
	handleCurrentChange('pass')
	handleCurrentChange('back')
}

//筛选
var dateValue = ref([])
var macValue = ref()
const check = () => {
	var showDataList = []
	var dataList = []
	console.log(macValue)
	switch(page.value)
	{
		case 'first': dataList = reflashData.finish
		case 'second': dataList = reflashData.working
		case 'third': dataList = reflashData.failed
	}

	for(let i=0;i<dataList.length;i++){
		if(dataList[i].mac_address == macValue){
			showDataList.push(dataList[i])
			console.log(showDataList)
		}
	}

}

//分页设置######################################
const pageSize = ref(10)	//设置每页最大展示数量

//当前页码
var currentPage = reactive({
	unread: 1,
	pass: 1,
	back: 1,
})

//页码改变事件
const handleCurrentChange = (type: string) => {
	let temp
	switch(type){
		case 'unread': 
			taskListForShow.unread = []
			if(currentPage.unread*pageSize.value >  taskList.unread.length){
				temp = taskList.unread.slice((currentPage.unread-1)*pageSize.value)
			}else{
				temp = taskList.unread.slice((currentPage.unread-1)*pageSize.value, 
											currentPage.unread*pageSize.value)
			}
			taskListForShow.unread = taskListForShow.unread.concat(temp)
			break
		case 'pass':
			taskListForShow.pass = []
			if(currentPage.pass*pageSize.value >  taskList.pass.length){
				temp = taskList.pass.slice((currentPage.pass-1)*pageSize.value)
			}else{
				temp = taskList.pass.slice((currentPage.pass-1)*pageSize.value, 
											currentPage.pass*pageSize.value)
			}
			taskListForShow.pass = taskListForShow.pass.concat(temp)
			break
		case 'back':
			taskListForShow.back = []
			if(currentPage.back*pageSize.value >  taskList.back.length){
				temp = taskList.back.slice((currentPage.back-1)*pageSize.value)
			}else{
				temp = taskList.back.slice((currentPage.back-1)*pageSize.value, 
											currentPage.back*pageSize.value)
			}
			taskListForShow.back = taskListForShow.back.concat(temp)
			break
	}
}


getTask()
</script>

<style scoped>
.handle-row {
	margin-top: 30px;
}

.opreation{
	display: flex;
}
</style>
