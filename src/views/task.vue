<template>
	<div class="container">
		<el-tabs v-model="message" v-loading="taskLoading">
			<el-tab-pane :label="`待审批任务(${taskList.unread.length})`" name="first">
				<el-table :data="taskListForShow.unread" style="width: 100%" border>
					<el-table-column prop="task_id" label="编号" width="180"></el-table-column>
					<el-table-column prop="topic" label="主题"></el-table-column>
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
						<el-table-column prop="task_id" label="编号" width="180"></el-table-column>
						<el-table-column prop="topic" label="主题"></el-table-column>
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
						<el-table-column prop="task_id" label="编号" width="180"></el-table-column>
						<el-table-column prop="topic" label="主题"></el-table-column>
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
					:label="device.id"
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
			:draggable="true"
			v-loading="taskDetailLoading">
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
				<el-tabs v-model="page">
					<el-tab-pane :label="`已完成(${taskStatus.finish})`" name="first">
						<el-table :data="reflashDataForShow.finish" border class="table" style="width: 100%" >
							<el-table-column prop="suite_number" label="托号"></el-table-column>
							<el-table-column prop="mac_address" label="MAC地址"></el-table-column>
							<el-table-column v-if="reflashDataForShow.type == 'pass'" label="版本号">
								<el-table-column label="刷新前版本号">
									<template #default="scope">
										{{ reflashDataForShow.finish[scope.$index].version_info.FIRMWARE.oldversion }}
									</template>
								</el-table-column>
								<el-table-column label="刷新后版本号">
									<template #default="scope">
										{{ reflashDataForShow.finish[scope.$index].version_info.FIRMWARE.newversion}}
									</template>
								</el-table-column>
						    </el-table-column>
							<el-table-column v-else label="目标版本号"></el-table-column>
							<el-table-column prop="status" label="刷新状态"></el-table-column>
							<el-table-column prop="update_time" label="刷新时间"></el-table-column>
							<el-table-column v-if="reflashDataForShow.type == 'pass'" prop="device_id" label="执行任务设备编号"></el-table-column>
							<el-table-column label="操作">
								<template #default="scope">
									<div class="opreation">
										<el-button size="small" @click="getInsideDetail(reflashDataForShow.finish[scope.$index].mac_address)" type="info" plain>详情</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination
						v-model:current-page="detailCurrentPage.finish"
						v-model:page-size="detailPageSize"
						layout="total, prev, pager, next, jumper"
						:total="taskStatus.finish"
						@current-change="handleDetailCurrentChange('finish')"
						/>
					</el-tab-pane>
					<el-tab-pane :label="`刷新中(${taskStatus.working})`" name="second">
						<el-table :data="reflashDataForShow.working" border class="table" style="width: 100%" >
							<el-table-column prop="suite_number" label="托号"></el-table-column>
							<el-table-column prop="mac_address" label="MAC地址"></el-table-column>
							<el-table-column v-if="reflashDataForShow.type == 'pass'" label="版本号">
								<el-table-column label="刷新前版本号">
									<template #default="scope">
										{{ reflashDataForShow.working[scope.$index].version_info.FIRMWARE.oldversion }}
									</template>
								</el-table-column>
								<el-table-column label="刷新后版本号">
									<template #default="scope">
										{{ reflashDataForShow.working[scope.$index].version_info.FIRMWARE.newversion}}
									</template>
								</el-table-column>
						    </el-table-column>
							<el-table-column v-else label="目标版本号"></el-table-column>
							<el-table-column prop="status" label="刷新状态"></el-table-column>
							<el-table-column prop="update_time" label="刷新时间"></el-table-column>
							<el-table-column v-if="reflashDataForShow.type == 'pass'" prop="device_id" label="执行任务设备编号"></el-table-column>
							<el-table-column label="操作">
								<template #default="scope">
									<div class="opreation">
										<el-button size="small" @click="getInsideDetail(reflashDataForShow.working[scope.$index].mac_address)" type="info" plain>详情</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination
						v-model:current-page="detailCurrentPage.working"
						v-model:page-size="detailPageSize"
						layout="total, prev, pager, next, jumper"
						:total="taskStatus.working"
						@current-change="handleDetailCurrentChange('working')"
						/>
					</el-tab-pane>
					<el-tab-pane :label="`刷新失败(${taskStatus.failed})`" name="third">
						<el-table :data="reflashDataForShow.failed" border class="table" style="width: 100%" >
							<el-table-column prop="suite_number" label="托号"></el-table-column>
							<el-table-column prop="mac_address" label="MAC地址"></el-table-column>
							<el-table-column v-if="reflashDataForShow.type == 'pass'" label="版本号">
								<el-table-column label="刷新前版本号">
									<template #default="scope">
										{{ reflashDataForShow.failed[scope.$index].version_info.FIRMWARE.oldversion }}
									</template>
								</el-table-column>
								<el-table-column label="刷新后版本号">
									<template #default="scope">
										{{ reflashDataForShow.failed[scope.$index].version_info.FIRMWARE.newversion}}
									</template>
								</el-table-column>
						    </el-table-column>
							<el-table-column v-else label="目标版本号"></el-table-column>
							<el-table-column prop="status" label="刷新状态"></el-table-column>
							<el-table-column prop="update_time" label="刷新时间"></el-table-column>
							<el-table-column v-if="reflashDataForShow.type == 'pass'" prop="device_id" label="执行任务设备编号"></el-table-column>
							<el-table-column label="操作">
								<template #default="scope">
									<div class="opreation">
										<el-button size="small" @click="getInsideDetail(reflashDataForShow.failed[scope.$index].mac_address)" type="info" plain>详情</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination
						v-model:current-page="detailCurrentPage.failed"
						v-model:page-size="detailPageSize"
						layout="total, prev, pager, next, jumper"
						:total="taskStatus.failed"
						@current-change="handleDetailCurrentChange('failed')"
						/>
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
import { ref, reactive, h, onMounted, onBeforeMount } from 'vue';
import { ElDivider, ElMessage } from 'element-plus';
import axios from 'axios';

const message = ref('first');
const taskLoading = ref(true)	//大任务列表加载页面
const taskDetailLoading = ref(true)	//小任务列表加载页面
var taskList = reactive({
	unread:[],
	pass:[],
	back:[]
})
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
		},
		{
			mac_address: "64F9C0000022BC9A",
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
	]
})

var reflashDataForShow = reactive({
	finish:[],
	working:[],
	failed:[],
	type: 'pass'
})

var taskStatus = reactive({
	finish: 0,
	working: 0,
	failed: 0
})

var deviceList = ref([])
//获取设备列表
const getDeviceList = () => {
	axios.get('/controllers')
	.then(res => {
		deviceList.value = res.data.controllerList
		for(let i=0;i<deviceList.value.length;i++){
			if(deviceList.value[i].status == 'idle'){
				deviceList.value[i].status = true
			}else{
				deviceList.value[i].status = false
			}
		}
	})
	.catch(error => {
		ElMessage.error('获取设备信息失败，请检查网络连接或刷新页面')
	})
}
//待处理->通过
var allocateTaskDialog = ref(false)
var readIndex = 0	//保存所选任务在数组中的位置，以便分配设备后将其从数组中删除
const unreadToRead = (index: number) => {
	allocateTaskDialog.value = true
	readIndex = index		
};

var selectedDeviceList = ref([])
var selected = false
//设备分配
const handleAllocatedChange = () => {
	let item = taskList.unread.splice(readIndex, 1);	//用于临时存储被选中的任务
	console.log(item)
	if(selectedDeviceList.value.length == 0 && selected){
		ElMessage({
			type: 'error',
			message: '未选择设备'
		})
	}else if(selected){
		let param = {
			task_id : item[0].task_id,
			device_ids : selectedDeviceList.value
		}
		console.log(param)
		axios.post('/big/task/assign_devices', param)
		.then(res => {
			ElMessage.success('设备分配成功！')
			//更改本地设备状态
			for(let i=0;i<selectedDeviceList.value.length;i++){
				for(let j=0;j<deviceList.value.length;j++){
					if(selectedDeviceList.value[i] == deviceList.value[j].id){
						deviceList.value[j].status = false
					}
				}
			}
			//更改任务状态
			taskList.pass = item.concat(taskList.pass);
			taskListForShow.pass = item.concat(taskListForShow.pass)
			//刷新页面解决99%问题
			location.reload()
		})
		.catch(error => {
			ElMessage.error('设备分配失败，请稍后再试')
		})	
	}
	selectedDeviceList = ref([])
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
	infoDialog.value = true 	//唤出信息窗口
	//todo 有点模糊，到时候等api下来了在考虑
	reflashDataForShow.type = type		//表示目前展示的信息是哪个tab页面下的：未审批，已审批或已驳回
	reflashDataForShow.finish = reflashData.finish
	reflashDataForShow.working = reflashData.working
	reflashDataForShow.failed = reflashData.failed

	taskStatus.finish = reflashData.finish.length
	taskStatus.working = reflashData.working.length
	taskStatus.failed = reflashData.failed.length

	//todo 待完善
	switch (type) {
		case 'unread': 
			console.log(taskListForShow.unread[index].task_id)
			break;
		case 'pass': console.log(taskListForShow.pass);break;
		case 'back': console.log(taskListForShow.back);break;
	}

	taskDetailLoading.value = false
	
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
const getTask = async () => {
	axios.get('/big/tasks')
	.then(res => {
		console.log(res.data)
		for(let i=0;i<res.data.length;i++){
			if(res.data[i].status == 'pending_approval'){
				taskList.unread.push(res.data[i])
			}else if(res.data[i].status == 'approved'){
				taskList.pass.push(res.data[i])
			}else{
				taskList.back.push(res.data[i])
			}
		}
		handleCurrentChange('unread')
		handleCurrentChange('pass')
		handleCurrentChange('back')
		taskLoading.value = false
	})
	.catch(error => {
		ElMessage.error('获取任务失败！请检查网络连接或稍后重试！')
		taskLoading.value = false
	})

}

onBeforeMount(async () => {
  await getTask()
  await getDeviceList()
})

//筛选
var dateValue = ref([])
var macValue = ref()
//用于保存筛选后符合条件的内容
var reflashDataForSelected = reactive({
	finish:[],
	working:[],
	failed:[]
})
const check = () => {
	//筛选条件为空，则展示所有信息(Show数组信息从原始数组中获得)
	if(dateValue.value.length !== 0 || macValue.value !== ''){
		for(let t=0;t<3;t++){
			var showDataList = []
			var dataList = []
			switch(t)
			{
				case 0: dataList = reflashData.finish;break;
				case 1: dataList = reflashData.working;break;
				case 2: dataList = reflashData.failed;break;
			}
			
			for(let i=0;i<dataList.length;i++){
				//如果时间选项不存在
				if(dateValue.value.length == 0){	
					if(dataList[i].mac_address == macValue.value){
						showDataList.push(dataList[i])
					}
				}else{		
					//如果时间选项存在
					//先判断mac地址是否为空
					if(macValue.value == ''){
						//若mac地址为空则根据时间筛选
						if(dataList[i].update_time.slice(0,10) >= dateValue.value[0] && dataList[i].update_time.slice(0,10) <= dateValue.value[1]){
							showDataList.push(dataList[i])
						}
					}else{
						//否则根据两者筛选
						if(dataList[i].update_time.slice(0,10) >= dateValue.value[0] && dataList[i].update_time.slice(0,10) <= dateValue.value[1] &&
							dataList[i].mac_address == macValue.value){
							showDataList.push(dataList[i])
						}
					}
				}	
			}

			switch(t)
			{
				case 0: reflashDataForSelected.finish = showDataList;break;
				case 1: reflashDataForSelected.working = showDataList;break;
				case 2: reflashDataForSelected.failed = showDataList;break;
			}
		}

		taskStatus.finish = reflashDataForSelected.finish.length
		taskStatus.working = reflashDataForSelected.working.length
		taskStatus.failed = reflashDataForSelected.failed.length

		console.log(reflashDataForSelected.working)
	}else{
		taskStatus.finish = reflashData.finish.length
		taskStatus.working = reflashData.working.length
		taskStatus.failed = reflashData.failed.length
		console.log("111")
	}

	detailCurrentPage.finish = 1
	detailCurrentPage.working = 1
	detailCurrentPage.failed = 1
	handleDetailCurrentChange('finish')
	handleDetailCurrentChange('working')
	handleDetailCurrentChange('failed')

}

//分页设置######################################
const pageSize = ref(10)	//设置每页最大展示数量

//当前页码
var currentPage = reactive({
	unread: 1,
	pass: 1,
	back: 1,
})

//大任务列表页码改变事件
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


const detailPageSize = ref(10)	//设置每页最大展示数量

//小任务列表当前页码
var detailCurrentPage = reactive({
	finish: 1,
	working: 1,
	failed: 1,
})

//小任务列表页面改变事件(还应该判断是否有筛选)
const handleDetailCurrentChange = (type: string) => {
	let tempList = {
		finish:[],
		working:[],
		failed:[]
	}
	if(dateValue.value.length == 0 && macValue.value == ''){
		//没有筛选信息，show数组信息应从原始数组中获取
		tempList = reflashData
	}else{
		//有筛选信息，show数组信息应从select数组中获取
		tempList = reflashDataForSelected
	}
	switch(type){
		case 'finish' :
			reflashDataForShow.finish = []
			if(detailCurrentPage.finish*detailPageSize.value > tempList.finish.length){
				reflashDataForShow.finish = tempList.finish
											.slice((detailCurrentPage.finish-1)*detailPageSize.value)
			}else{
				reflashDataForShow.finish = tempList.finish
											.slice((detailCurrentPage.finish-1)*detailPageSize.value,
												detailCurrentPage.finish*detailPageSize.value)
			}
			break;
		case 'working' :
		reflashDataForShow.working = []
		if(detailCurrentPage.working*detailPageSize.value > tempList.working.length){
			reflashDataForShow.working = tempList.working
										.slice((detailCurrentPage.working-1)*detailPageSize.value)
		}else{
			reflashDataForShow.working = tempList.working
										.slice((detailCurrentPage.working-1)*detailPageSize.value,
											detailCurrentPage.working*detailPageSize.value)
		}
		break;	
		case 'failed' :
		reflashDataForShow.failed = []
		if(detailCurrentPage.failed*detailPageSize.value > tempList.failed.length){
			reflashDataForShow.failed = tempList.failed
										.slice((detailCurrentPage.failed-1)*detailPageSize.value)
		}else{
			reflashDataForShow.failed = tempList.failed
										.slice((detailCurrentPage.failed-1)*detailPageSize.value,
											detailCurrentPage.failed*detailPageSize.value)
		}
		break;	
	}

}
</script>

<style scoped>
.handle-row {
	margin-top: 30px;
}

.opreation{
	display: flex;
}

.selectContainer{
	margin-bottom: 10px;
}
</style>
