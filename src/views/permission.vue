<template>
	<div>
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
				<el-row>
					<el-col :offset="10" :span="2">
						<el-button type="primary" @click="creatUser" style="margin-top: 20px;">创建账户</el-button>
					</el-col>
				</el-row>
			</el-tab-pane>

			<el-tab-pane name="second" label="权限管理">
				<div class="container">
					<div>
						<span class="label">角色：</span>
						<el-select v-model="role" @change="handleChange" style="width: 50%;">
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
			<el-form 
			:model="changeUserForm"
			label-position = "Right"
			label-width="auto">
				<el-form-item label="id">
					<el-input v-model="changeUserForm.id" />
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="changeUserForm.password" />
				</el-form-item>
				<el-form-item label="所属用户组">
					<el-select v-model="changeUserForm.group">
						<el-option v-for="item in groups"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-row :gutter="2" justify="center">
					<el-col :span="4">
						<el-button type="success" @click="submitChange" style="width: 90px">确认修改</el-button>
					</el-col>
					<el-col :span="4">
						<el-button type="danger" @click="changeUserDialog = false" style="width: 90px">取  消</el-button>
					</el-col>
				</el-row>

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
					<el-select v-model="createUserForm.group">
						<el-option v-for="item in groups"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="submitCreate">确认创建</el-button>
					<el-button type="danger">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="permission">
import { reactive, ref } from 'vue';
import { ElTree, ElMessageBox, ElMessage } from 'element-plus';
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

//修改用户信息###################################################
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
const changeUser = (index: number) => {
	changeUserDialog.value = true
	changeUserForm = userList[index]
}
//提交修改信息
const submitChange = () => {
	console.log(changeUserForm)
	//todo 数据同步数据库

	ElMessage({
		type: 'success',
		message: '修改成功',
	})
	changeUserDialog.value = false
}

//删除用户#######################################################
const deleteUser = () => {
	ElMessageBox.confirm(
		'是否确定要删除该用户，该操作不可逆，请谨慎考虑?',
		'Warning',
		{
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
		}
	)
	.then(() => {
	//todo 数据同步数据库
	ElMessage({
		type: 'success',
		message: '删除成功',
	})
	})
}

//创建用户#######################################################
var createUserForm = reactive({
	id: '',
	password: '',
	group: ''
})
var createUserDialog = ref(false)
const creatUser = () => {
	createUserDialog.value = true
}
const submitCreate = () => {
	console.log(createUserForm)
	//todo 数据同步数据库

	ElMessage({
		type: 'success',
		message: '新建成功',
	})
	createUserDialog.value = false
}


</script>

<style scoped>
.tree-wrapper {
	max-width: 500px;
}
.label {
	font-size: 14px;
	width: 20px;
}
</style>
