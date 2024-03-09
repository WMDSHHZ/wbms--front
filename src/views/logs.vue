<template>
	<div class="container">
		<div class="handle-box">
			<el-table :data="logData" class="table" style="width: 100%" border>
				<el-table-column prop="message" label="内容"></el-table-column>
				<el-table-column prop="level" label="错误等级" width="120px"></el-table-column>
				<el-table-column prop="timestamp" label="日期" width="200px"></el-table-column>
				<el-table-column width="100px" align="center" label="操作">
					<template #default="scope">
                        <div class="opreation">
                            <el-button size="small" @click="getDetail(scope.$index)" type="info" plain>详情</el-button>
                        </div>
                    </template>
				</el-table-column>
			</el-table>
		</div>

		<div>
			<el-dialog v-model="dialogTableVisible">
				details
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="logs">
import axios from 'axios';
import { ref, reactive } from 'vue';

interface TableItem {
    message: string,
    level: string,
    timestamp: string,
}

var logData = reactive([
	{
		message: '123',
		level: 'warning',
		timestamp: '123'
	},
	{
		message: '123',
		level: 'warning',
		timestamp: '123'
	}
]);
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
const getDetail = (index : number) => {
	//todo 获取详情
	console.log("111")
	console.log(dialogTableVisible)
	dialogTableVisible.value = true
	console.log(dialogTableVisible)
}

//getLog()
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
