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
			<el-dialog v-model="infoDialog">
				info
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="tabs">
import { ref, reactive } from 'vue';

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

var infoDialog = ref(false)
//获取详情
const getDetail = (index: number) => {
	infoDialog.value = true
	//todo 待完善
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
