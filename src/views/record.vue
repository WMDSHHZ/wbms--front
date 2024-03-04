<template>
	<div class="container">
		<div style="margin-bottom: 10px;">
			<span width="100px" style="margin-right: 50px;">失败个数: 12{{ successNum }}</span>
			<span width="100px">成功个数: 0{{ failNum }}</span>
		</div>
		<el-table :data="recordData" border class="table" style="width: 100%" >
			<el-table-column prop="id" label="托号"></el-table-column>
			<el-table-column prop="voltage" label="电压"></el-table-column>
			<el-table-column prop="temperature" label="温度"></el-table-column>
			<el-table-column prop="before" label="起始版本"></el-table-column>
			<el-table-column prop="after" label="刷新后版本"></el-table-column>
			<el-table-column prop="state" label="刷新状态"></el-table-column>
			<el-table-column prop="time" label="刷新时间"></el-table-column>
		</el-table>

	</div>
</template>

<script setup lang="ts" name="tabs">
import { ref, reactive } from 'vue';

interface TableItem {
	id: number,
	voltage: string,
	temperature: string,
    before: string,
    after: string
	state: string,
    time: string
}

var successNum, failNum;

const recordData = ref<TableItem[]>([]);
const getRecord = () => {
	recordData.value = [
		{
			id: 123,
			voltage: '3.3270V',
			temperature: '16℃',
			before: '刷新前版本',
    		after: '刷新后版本',
			state: '成功',
    		time: '2018-04-19 21:00:00'
		},		
		{
			id: 123,
			voltage: '3.3314V',
			temperature: '16℃',
			before: '刷新前版本',
    		after: '刷新后版本',
			state: '成功',
    		time: '2018-04-19 21:00:00'
		},
		{
			id: 123,
			voltage: '3.3039V',
			temperature: '16℃',
			before: '刷新前版本',
    		after: '刷新后版本',
			state: '成功',
    		time: '2018-04-19 21:00:00'
		},		
		{
			id: 123,
			voltage: '3.3106V',
			temperature: '16℃',
			before: '刷新前版本',
    		after: '刷新后版本',
			state: '成功',
    		time: '2018-04-19 21:00:00'
		},
		{
			id: 123,
			voltage: '3.3140V',
			temperature: '16℃',
			before: '刷新前版本',
    		after: '刷新后版本',
			state: '成功',
    		time: '2018-04-19 21:00:00'
		},		
		{
			id: 123,
			voltage: '3.3061V',
			temperature: '16℃',
			before: '刷新前版本',
    		after: '刷新后版本',
			state: '成功',
    		time: '2018-04-19 21:00:00'
		},
		{
			id: 123,
			voltage: '3.3276V',
			temperature: '16℃',
			before: '刷新前版本',
    		after: '刷新后版本',
			state: '成功',
    		time: '2018-04-19 21:00:00'
		},		
		{
			id: 123,
			voltage: '3.3105V',
			temperature: '16℃',
			before: '刷新前版本',
    		after: '刷新后版本',
			state: '成功',
    		time: '2018-04-19 21:00:00'
		},
		{
			id: 123,
			voltage: '3.3222V',
			temperature: '16℃',
			before: '刷新前版本',
    		after: '刷新后版本',
			state: '成功',
    		time: '2018-04-19 21:00:00'
		},		
		{
			id: 123,
			voltage: '3.3102V',
			temperature: '16℃',
			before: '刷新前版本',
    		after: '刷新后版本',
			state: '成功',
    		time: '2018-04-19 21:00:00'
		},
		{
			id: 123,
			voltage: '3.3093V',
			temperature: '16℃',
			before: '刷新前版本',
    		after: '刷新后版本',
			state: '成功',
    		time: '2018-04-19 21:00:00'
		},		
		{
			id: 123,
			voltage: '3.3292V',
			temperature: '16℃',
			before: '刷新前版本',
    		after: '刷新后版本',
			state: '成功',
    		time: '2018-04-19 21:00:00'
		},
	]
}
const getNum = () => {
	for(var i=0;i<recordData.value.length;i++){
		if(recordData.value[i].state == '成功')
			successNum++;
		else
			failNum++;
	}
}

getRecord();

</script>

<style>
.message-title {
	cursor: pointer;
}
.handle-row {
	margin-top: 30px;
}
</style>
