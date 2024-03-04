<template>
	<div class="container">

		<el-table :data="state.log" :show-header="false" style="width: 100%">
			<el-table-column>
				<template #default="scope">
					<span class="message-title">{{ scope.row.title }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="date" width="180"></el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts" name="tabs">
import { ref, reactive } from 'vue';

const state = reactive({
	log: [
		{
			date: '2018-04-19 20:00:00',
			title: 'BRFM FIRMWARE版本检查：BRFM FIRMWARE版本已刷新为2.0.8.14'
		},
		{
			date: '2018-04-19 21:00:00',
			title: 'CMU FIRMWARE版本检查：CMU FIRMWARE版本已刷新为2.0.8.22'
		}
	]
});

</script>

<style>
.message-title {
	cursor: pointer;
}
.handle-row {
	margin-top: 30px;
}
</style>
