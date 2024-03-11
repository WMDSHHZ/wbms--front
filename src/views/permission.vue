<template>
	<el-tabs v-model="page">
		<el-tab-pane name="first" label="账号管理">
			<el-table :data="userList">
				<el-table-column prop="id" label="ID"></el-table-column>
				<el-table-column prop="password" label="密码"></el-table-column>
				<el-table-column prop="group" label="所属用户组"></el-table-column>
				<el-table-column label="操作" width="170px">
					<template #default="scope">
						<el-button type="primary" @click="changeUser(scope.$index)">修改</el-button>
						<el-button type="danger" @click="deleteUser">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-button type="primary" @click="creatUser">创建账户</el-button>
		</el-tab-pane>

		<el-tab-pane name="second" label="权限管理">
			<div class="container">
				<div class="mgb20">
					<span class="label">角色：</span>
					<el-select v-model="role" @change="handleChange">
						<el-option label="管理员" value="admin"></el-option>
						<el-option label="普通用户" value="user"></el-option>
						<el-option label="超级管理员" value="superAdmin"></el-option>
					</el-select>
				</div>
				<div class="mgb20 tree-wrapper">
					<el-tree
						ref="tree"
						:data="data"
						node-key="id"
						default-expand-all
						show-checkbox
						:default-checked-keys="checkedKeys"
					/>
				</div>
				<el-button type="primary" @click="onSubmit">保存权限</el-button>
			</div>
		</el-tab-pane>
	</el-tabs>

	<el-dialog
	v-model="changeUserDialog">
		<el-form :model="changeUserForm">
			<el-form-item label="id">
				<el-input v-model="changeUserForm.id" />
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-model="changeUserForm.password" />
			</el-form-item>
			<el-form-item label="所属用户组">
				<el-select v-model="selectedGroup">
					<el-option v-for="item in groups"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="success">确认修改</el-button>
				<el-button type="danger">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>

	<el-dialog
	v-model="createUserDialog">
		<el-form :model="createUserForm">
			<el-form-item label="id">
				<el-input v-model="createUserForm.id" />
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-model="createUserForm.password" />
			</el-form-item>
			<el-form-item label="所属用户组">
				<el-select v-model="selectedGroup">
					<el-option v-for="item in groups"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="success">确认创建</el-button>
				<el-button type="danger">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script setup lang="ts" name="permission">
import { reactive, ref } from 'vue';
import { ElTree } from 'element-plus';
import { usePermissStore } from '../store/permiss';
import { tr } from 'element-plus/es/locale';

const role = ref<string>('admin');

interface Tree {
	id: string;
	label: string;
	children?: Tree[];
}

const data: Tree[] = [
	{
		id: '1',
		label: '系统首页'
	},
	{
		id: '2',
		label: '配置管理',
		children: [
			{
				id: '3',
				label: '导入Excel'
			},
			{
				id: '4',
				label: '软件包上传'
			}
		]
	},
	{
		id: '5',
		label: '日志管理'
	},
	{
		id: '6',
		label: '任务管理'
	},
	{
		id: '7',
		label: '刷新纪录'
	},

	{
		id: '8',
		label: '系统设置'
	},
	{
		id: '9',
		label: '设备管理'
	},
	{
		id: '10',
		label: '权限管理'
	}
	
	
];

const permiss = usePermissStore();

// 获取当前权限
const checkedKeys = ref<string[]>([]);
const getPremission = () => {
	//todo 请求接口返回权限
	checkedKeys.value = permiss.defaultList[role.value];
};
getPremission();

// 保存权限
const tree = ref<InstanceType<typeof ElTree>>();
const onSubmit = () => {
	// 获取选中的权限
	console.log(tree.value!.getCheckedKeys(false));

	//todo将权限保存
};

var page = ref('first')

const handleChange = (val: string[]) => {
	tree.value!.setCheckedKeys(permiss.defaultList[role.value]);
};

var userList = reactive([
	{
		id: '123',
		password: '123',
		group: '普通用户'
	},
	{
		id: 'admin',
		password: '123',
		group: '管理员'
	},
	{
		id: '456',
		password: '123',
		group: '普通用户'
	}
])

var changeUserDialog = ref(false)
var changeUserForm = reactive({
	id: '',
	password: '',
	group: ''
})
const groups = [
	{
		value: 'user',
		label: '普通用户'
	},
	{
		value: 'admin',
		label: '管理员'
	},
	{
		value: 'superAdmin',
		label: '超级管理员'
	}
]
var selectedGroup = ref('')
const changeUser = (index: number) => {
	changeUserDialog.value = true
	changeUserForm = userList[index]
	selectedGroup.value = changeUserForm.group
}

const deleteUser = () => {
	
}

var createUserForm = reactive({
	id: '',
	password: '',
	group: ''
})
const creatUser = () => {
	createUserDialog.value = true
}

var createUserDialog = ref(false)

</script>

<style scoped>
.tree-wrapper {
	max-width: 500px;
}
.label {
	font-size: 14px;
}
</style>
