<template>
	<div class="container">
		<el-tabs v-model="message">
			<el-tab-pane :label="`待审批任务(${state.unread.length})`" name="first">
				<el-table :data="state.unread" style="width: 100%" border>
					<el-table-column prop="id" label="编号" width="180"></el-table-column>
					<el-table-column prop="title" label="主题"></el-table-column>
					<el-table-column width="200" label="操作">
						<template #default="scope">
							<div class="opreation">
								<el-button size="small" @click="unreadToRead(scope.$index)" type="success" plain>通过</el-button>
								<el-button size="small" @click="readToBack(scope.$index)" type="danger" plain>驳回</el-button>
								<el-button size="small" @click="getDetail(scope.$index)" type="info" plain>详情</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
				<div class="handle-row">
					<el-button type="primary" @click="readAll">全部通过</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane :label="`已审批任务(${state.pass.length})`" name="second">
				<template v-if="message === 'second'">
					<el-table :data="state.pass" style="width: 100%" border>
						<el-table-column prop="id" label="编号" width="180"></el-table-column>
						<el-table-column prop="title" label="主题"></el-table-column>
						<el-table-column width="200" label="操作">
							<template #default="scope">
								<div class="opreation">
									<el-button type="danger" size="small" @click="handleDel(scope.$index)">删除</el-button>
									<el-button type="danger" size="small" @click="passToStop(scope.$index)" plain>停止</el-button>
									<el-button size="small" @click="getDetail(scope.$index)" type="info" plain>详情</el-button>
								</div>
							</template>
						</el-table-column>
					</el-table>
					<div class="handle-row">
						<el-button type="danger" @click="deleteAll">删除全部</el-button>
					</div>
				</template>
			</el-tab-pane>
			<el-tab-pane :label="`已驳回任务(${state.back.length})`" name="third">
				<template v-if="message === 'third'">
					<el-table :data="state.back" style="width: 100%" border>
						<el-table-column prop="id" label="编号" width="180"></el-table-column>
						<el-table-column prop="title" label="主题"></el-table-column>
						<el-table-column width="200" label="操作">
							<template #default="scope">
								<div class="opreation">
									<el-button type="danger" size="small" @click="handleDel(scope.$index)" plain>删除</el-button>
									<el-button size="small" @click="backToPass(scope.$index)" type="success" plain>恢复</el-button>
									<el-button size="small" @click="getDetail(scope.$index)" type="info" plain>详情</el-button>
								</div>
							</template>
						</el-table-column>
					</el-table>
					<div class="handle-row">
						<el-button type="danger" @click="deleteAll">删除全部</el-button>
					</div>
				</template>
			</el-tab-pane>
		</el-tabs>
		
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
							<el-input placeholder="MAC地址" :model="macValue"></el-input>
							<el-button @click="check">筛选</el-button>
						</el-space>
					</div>
				</div>
				<el-tabs v-model="page">
					<el-tab-pane :label="`警告(${recordData.warning.length})`" name="first">
						<el-table :data="recordData.warning" border class="table" style="width: 100%" >
							<el-table-column prop="id" label="托号"></el-table-column>
							<el-table-column prop="mac" label="MAC地址"></el-table-column>
							<el-table-column prop="before" label="起始版本"></el-table-column>
							<el-table-column prop="after" label="刷新后版本"></el-table-column>
							<el-table-column prop="state" label="刷新状态"></el-table-column>
							<el-table-column prop="time" label="刷新时间"></el-table-column>
							<el-table-column label="操作">
								<template #default="scope">
									<div class="opreation">
										<el-button size="small" @click="getInsideDetail(recordData.warning[scope.$index].id)" type="info" plain>详情</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane :label="`错误(${recordData.error.length})`" name="second">
						<el-table :data="recordData.error" border class="table" style="width: 100%" >
							<el-table-column prop="id" label="托号"></el-table-column>
							<el-table-column prop="mac" label="MAC地址"></el-table-column>
							<el-table-column prop="before" label="起始版本"></el-table-column>
							<el-table-column prop="after" label="刷新后版本"></el-table-column>
							<el-table-column prop="state" label="刷新状态"></el-table-column>
							<el-table-column prop="time" label="刷新时间"></el-table-column>
							<el-table-column label="操作">
								<template #default="scope">
									<div class="opreation">
										<el-button size="small" @click="getInsideDetail(recordData.error[scope.$index].id)" type="info" plain>详情</el-button>
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
				<el-table :data="reflashData">
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
									{{ reflashData[scope.$index].version_info.BMS_CONTAINER.oldcrc }}
								</template>
							</el-table-column>
							<el-table-column label="新校验码">
								<template #default="scope">
									{{ reflashData[scope.$index].version_info.BMS_CONTAINER.newcrc }}
								</template>
							</el-table-column>
						</el-table-column>
						<el-table-column label="版本号">
							<el-table-column label="刷新前版本号">
								<template #default="scope">
									{{ reflashData[scope.$index].version_info.FIRMWARE.oldversion }}
								</template>
							</el-table-column>
							<el-table-column label="刷新后版本号">
								<template #default="scope">
									{{ reflashData[scope.$index].version_info.FIRMWARE.newversion}}
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
const state = reactive({
	unread: [
		{
			date: '2018-04-19 20:00:00',
			title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
		},
		{
			date: '2018-04-19 21:00:00',
			title: '今晚12点整发大红包，先到先得'
		}
	],
	pass: [
		{
			date: '2018-04-19 20:00:00',
			title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
		}
	],
	back:[
		{
			date: '2018-04-19 20:00:00',
			title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
		},
		{
			date: '2018-04-19 21:00:00',
			title: '今晚12点整发大红包，先到先得'
		}
	]
});
const spacer = h(ElDivider, { direction: 'vertical' })
const recordData = reactive({
	error: [
		{
			id: '123',
			mac: '123',
			voltage: '123',
			before: '123',
			after: '123',
			state: '错误',
			time: '123'
		},
		{
			id: '123',
			mac: '123',
			voltage: '123',
			before: '123',
			after: '123',
			state: '错误',
			time: '123'
		},
		{
			id: '123',
			mac: '123',
			voltage: '123',
			before: '123',
			after: '123',
			state: '错误',
			time: '123'
		}
	],
	warning: [
		{
			id: '1',
			mac: '123',
			voltage: '123',
			before: '123',
			after: '123',
			state: '警告',
			time: '123'
		},
		{
			id: '2',
			mac: '123',
			voltage: '123',
			before: '123',
			after: '123',
			state: '警告',
			time: '123'
		},
		{
			id: '3',
			mac: '123',
			voltage: '123',
			before: '123',
			after: '123',
			state: '警告',
			time: '123'
		},
		{
			id: '4',
			mac: '123',
			voltage: '123',
			before: '123',
			after: '123',
			state: '警告',
			time: '123'
		}
	]
})
var page = ref('first')
var dateValue = ref([])
var macValue = ref(0)

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

const reflashData = ref([
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


//待处理->通过
const unreadToRead = (index: number) => {
	let item = state.unread.splice(index, 1);
	state.pass = item.concat(state.pass);
};

//删除任务
const handleDel = (index: number) => {
	state.pass.splice(index, 1);
};

//待处理->驳回
const readToBack = (index: number) => {
	let item = state.unread.splice(index, 1)
	state.back = item.concat(state.back)
}

//驳回->通过
const backToPass = (index: number) => {
	let item = state.back.splice(index, 1)
	state.pass = item.concat(state.pass)
}

//停止处理该任务
const passToStop = (index: number) => {
	state.pass.splice(index, 1)
	//todo 待完善
}

//获取详情
var infoDialog = ref(false)
const getDetail = (index: number) => {
	infoDialog.value = true
	//todo 待完善
}

//获取刷新纪录详情
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
	let item = state.unread.splice(0,state.unread.length)
	state.pass = item.concat(state.pass);
}

//全部删除
const deleteAll = () => {
	state.pass.splice(0,state.pass.length)
}

//获取任务列表
const getTask = () => {
	//todo
}

//筛选
const check = () => {
	console.log(dateValue.value[0])
	console.log(dateValue.value[1])
	console.log(dateValue.value.length)
	console.log(macValue)
}
</script>

<style>
.message-title {
	cursor: pointer;
}
.handle-row {
	margin-top: 30px;
}

.opreation{
	display: flex;
}
</style>
