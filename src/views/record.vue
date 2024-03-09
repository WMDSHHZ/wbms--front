<template>
	<div class="container">
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
					<el-button @click="getNewRecord">获取最新记录</el-button>
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
								<el-button size="small" @click="getDetail(scope.$index)" type="info" plain>详情</el-button>
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
								<el-button size="small" @click="getDetail(scope.$index)" type="info" plain>详情</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts" name="tabs">
import { ref, reactive, h } from 'vue';
import axios from 'axios';
import { ElDivider } from 'element-plus';

var macValue = ref(0)
var page = ref('first')
var dateValue = ref([])
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
			id: '123',
			mac: '123',
			voltage: '123',
			before: '123',
			after: '123',
			state: '警告',
			time: '123'
		},
		{
			id: '123',
			mac: '123',
			voltage: '123',
			before: '123',
			after: '123',
			state: '警告',
			time: '123'
		},
		{
			id: '123',
			mac: '123',
			voltage: '123',
			before: '123',
			after: '123',
			state: '警告',
			time: '123'
		},
		{
			id: '123',
			mac: '123',
			voltage: '123',
			before: '123',
			after: '123',
			state: '警告',
			time: '123'
		}
	]
})

const getNewRecord = () => {
	//todo 待完善
}

//获取详情
const getDetail = (index: number) => {
	//todo 待完善
}

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
.selectContainer{
	display: flex;
}
</style>
