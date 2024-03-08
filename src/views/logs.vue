<template>
	<div class="container">
		<div class="handle-box">
			<el-table :data="logData" class="table" style="width: 100%" border>
				<el-table-column prop="message" label="内容"></el-table-column>
				<el-table-column prop="level" label="错误等级" width="120px"></el-table-column>
				<el-table-column prop="timestamp" label="日期" width="200px"></el-table-column>
				<el-table-column width="100px" align="center">
					<el-button @click="getDeatil">详情</el-button>
				</el-table-column>
			</el-table>
		</div>

		<el-dialog v-model="dialogTableVisible">
			details
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="tabs">
import axios from 'axios';
import { ref, reactive } from 'vue';

interface TableItem {
    message: string,
    level: string,
    timestamp: string,
}

//var logData = ref<TableItem[]>([]);
var logData = reactive([]);
const getLog = () => {
	axios.get('/log/get')
		.then(res => {
			logData.push(...res.data)
			//logData = res.data
			console.log(logData)
		})
		.catch(e => {
			console.log(e)
		})
}

var dialogTableVisible = ref(false)
const getDeatil = () => {
	console.log("111")
	console.log(dialogTableVisible)
	dialogTableVisible.value = true
	console.log(dialogTableVisible)
}

getLog()
</script>

<style scoped>
.message-title {
	cursor: pointer;
}
.handle-row {
	margin-top: 30px;
}

.handle-box {
    display: flex;
    margin-bottom: 20px;
}

.table {
    width: 100%;
    font-size: 14px;
}
</style>
