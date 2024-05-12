<template>
	<div>
		<el-tabs v-model="page">
			<el-tab-pane name="first" label="账号管理">
				<el-table :data="userList">
					<el-table-column prop="username" label="用户名"></el-table-column>
					<el-table-column prop="role" label="所属用户组"></el-table-column>
					<el-table-column label="操作" width="400px">
						<template #default="scope">
							<el-button type="primary" @click="changeUser(scope.$index)">修改</el-button>
							<el-button type="danger" @click="deleteUser(scope.$index)">删除</el-button>
							<el-button type="danger" @click="resetPassword(scope.$index)">重置密码</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-row>
					<el-col :offset="10" :span="2">
						<el-button type="primary" @click="createUserDialog = true" style="margin-top: 20px;">创建账户</el-button>
					</el-col>
				</el-row>
			</el-tab-pane>

			<el-tab-pane name="second" label="权限管理">
				<div class="container">
					<div>
						<span class="label">角色：</span>
						<el-select v-model="role" @change="handleChange" style="width: 50%;">
							<el-option
							v-for="item in roleOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
							/>
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
							@change="changeSelectedRole"
						/>
					</div>
					<el-button type="primary" @click="onSubmit">保存权限</el-button>
				</div>
			</el-tab-pane>
		</el-tabs>

		<el-dialog
		v-model="changeUserDialog"
		@close="changeUserDialogClose"
		>
			<el-form 
			:model="changeUserForm"
			label-position = "Right"
			label-width="auto">
				<el-form-item label="用户名">
					<el-input v-model="changeUserForm.username" />
				</el-form-item>
				<el-form-item label="所属用户组">
					<el-select v-model="changeUserForm.role">
						<el-option v-for="item in roles"
						:key="item.value"
						:label="item.label"
						:value="item.value"
						:disabled="item.disable">
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
					<el-input v-model="createUserForm.username" />
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="createUserForm.password" />
				</el-form-item>
				<el-form-item label="所属用户组">
					<el-select v-model="createUserForm.role">
						<el-option v-for="item in roles"
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
import axios from 'axios';

const role = ref<string>('operator');
var roleOptions = ref([
	{
		value: "operator",
		label: "普通用户",
	},
	{
		value: "admin",
		label: "管理员",
	},
	{
		value: "super_admin",
		label: "超级管理员",
	}
])

interface Tree {
	id: string;
	label: string;
	children?: Tree[];
}

const data: Tree[] = [
	{
		id: '1',
		label: '导入Excel'
	},
	{
		id: '2',
		label: '上传刷新包'
	},
	{
		id: '3',
		label: '任务管理'
	},
	{
		id: '4',
		label: '设备管理'
	},
	{
		id: '5',
		label: '权限管理'
	},
	{
		id: '6',
		label: '系统设置'
	},
	
];

const permiss = usePermissStore();

// 获取当前权限
var checkedKeys = ref<string[]>([]);
const getPremission = () => {
	checkedKeys.value = permiss.defaultList[role.value];
};

const changeSelectedRole = () => {
	//获取选择的权限并暂存
	let temp = tree.value!.getCheckedNodes().map(node => node.id)
	permiss.defaultList[role.value] = temp
}



// 保存权限
const tree = ref<InstanceType<typeof ElTree>>();
var selectedPermission = {
	"Import Excel": false,
	"Upload Package": false,
	"Task Management": false,
	"Device Management": false,
	"Permission Management": false,
	"System Settings": false
}
const onSubmit = () => {
	// 获取选中的权限
	let temp = tree.value!.getCheckedNodes().map(node => node.id)
	let i=0
	while(i<temp.length){
		switch(temp[i]){
			case '1' : selectedPermission['Import Excel'] = true; break;
			case '2' : selectedPermission['Upload Package'] = true; break;
			case '3' : selectedPermission['Task Management'] = true; break;
			case '4' : selectedPermission['Device Management'] = true; break;
			case '5' : selectedPermission['Permission Management'] = true; break;
			case '6' : selectedPermission['System Settings'] = true; break;
		}
		i++;	
	}
	let tempRole = role.value
	let param = {
		role_name: tempRole,
		permissions: selectedPermission
	}
	//将权限保存
	axios.post('/user/role/update', param)
	.then(res => {
		ElMessage.success('权限修改成功')
	})
	.catch(error => {
		ElMessage.error(tempRole + '权限修改失败，请检查网络连接后重试')
	})
};

var page = ref('first')

const handleChange = (val: string[]) => {
	tree.value!.setCheckedKeys(permiss.defaultList[role.value]);
};

var userList = ref([])
const getUserList = async () => {
	try{
		const res = await axios.get('/users')
		userList.value = res.data.userList
		/*
		if(sessionStorage.getItem('role') == 'admin'){
			let temp = res.data.userList
			//当前操作员为管理员，则无权对其他管理员和超级管理员进行管理
			for(let i=0;i<temp.length;i++){
				if(temp[i].role == 'operator'){
					userList.value.push(temp[i])
				}
			}

			roles.value[2].disable = true
			console.log(roles.value)
		}else{
			userList.value = res.data.userList
		}
		*/
	}
	catch{
		ElMessage.error("获取用户信息失败，请检查网络连接")
	}
	
}

//修改用户信息###################################################
var changeUserDialog = ref(false)
var changeUserForm = reactive({
	username: '',
	role: ''
})
var roles = ref([
	{
		value: 'operator',
		label: '普通用户',
		disable: false
	},
	{
		value: 'admin',
		label: '管理员',
		disable: false
	},
	{
		value: 'super_admin',
		label: '超级管理员',
		disable: false
	}
])
const changeUser = (index: number) => {
	changeUserDialog.value = true
	changeUserForm = userList.value[index]
	sessionStorage.setItem('oldUsername', userList.value[index].username)
	sessionStorage.setItem('oldRole', userList.value[index].role)
}
//提交修改信息
const submitChange = () => {
	let param = {
		username: changeUserForm.username,
		newRole: changeUserForm.role
	}
	axios.post('/user/update', param)
	.then(res => {
		ElMessage.success('修改成功')
	})
	.catch(error => {
		ElMessage.error('修改失败，请检查网络连接或稍后再试')
	})
	changeUserDialog.value = false
}

//修改信息对话框关闭，回复原有信息
const changeUserDialogClose = () => {
	const index = userList.value.findIndex(user => user.username === changeUserForm.username);
	userList.value[index].username = sessionStorage.getItem('oldUsername')
	userList.value[index].role = sessionStorage.getItem('oldRole')
}

//删除用户
const deleteUser = (index: number) => {
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
		axios.delete('/user/delete?username=' + userList.value[index].username)
		.then(res => {
			if(res.data.success == true){
				ElMessage.success('删除成功')
				userList.value.splice(index)
			}else{
				throw new Error()
			}
		})
		.catch(error => {
			ElMessage.error('删除失败，请检查网络连接或稍后再试')
		} )
	})
	.catch(() => {
		ElMessage.warning('操作取消！')
	})
}

//创建用户
var createUserForm = reactive({
	username: '',
	password: '',
	role: ''
})
var createUserDialog = ref(false)
const submitCreate = () => {
	console.log(createUserForm)
	//todo 可以添加一个等待样式
	axios.post('/user/add', createUserForm)
	.then(res => {
		ElMessage.success('创建成功')
	})
	.catch(error => {
		ElMessage.error('创建失败，请检查网络连接')
	})
	createUserDialog.value = false
}

//重置密码
const resetPassword = (index: number) => {
	//默认重置密码为admin
	let param = {
		username: userList.value[index].username,
		newPassword: 'admin'
	}
	axios.post('/user/update', param)
	.then(res => {
		ElMessage.success('密码重置成功')
	})
	.catch(error => {
		ElMessage.error('密码重置失败，请检查网络连接或稍后再试')
	})
}

getPremission();
getUserList()
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
