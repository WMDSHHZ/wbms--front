import { defineStore } from 'pinia';
import axios from 'axios';
import { ElMessage } from 'element-plus';

interface ObjectList {
	[key: string]: string[];
}

//权限管理类，对应数字代表对应用户对象能访问的页面的permission值
export const usePermissStore = defineStore('permiss', {
	state: () => {
		const keys = localStorage.getItem('ms_keys');
		let permiss = {
			key: keys ? JSON.parse(keys) : <string[]>[],
			defaultList: <ObjectList>{
				operator: ['1','2','6'],
				admin: ['1', '2', '3', '4','6'],
				super_admin: ['1', '2', '3', '4', '5', '6']
			}
		};
		//获取普通用户权限信息
		axios.get('/user/role/get?role_name=operator')
		.then(res => {
			let temp = []
			if(res.data.permissions["Import Excel"] == true){
				temp.push('1')
			}
			if(res.data.permissions["Upload Package"] == true){
				temp.push('2')
			}
			if(res.data.permissions["Task Management"] == true){
				temp.push('3')
			}
			if(res.data.permissions["Device Management"] == true){
				temp.push('4')
			}
			if(res.data.permissions["Permission Management"] == true){
				temp.push('5')
			}
			if(res.data.permissions["System Settings"] == true){
				temp.push('6')
			}
			permiss.defaultList.operator = temp
		})
		.catch(error => {
			ElMessage.error('获取普通用户权限信息失败，将使用默认权限信息')
		})

		//获取管理员权限信息
		axios.get('/user/role/get?role_name=admin')
		.then(res => {
			let temp = []
			if(res.data.permissions["Import Excel"] == true){
				temp.push('1')
			}
			if(res.data.permissions["Upload Package"] == true){
				temp.push('2')
			}
			if(res.data.permissions["Task Management"] == true){
				temp.push('3')
			}
			if(res.data.permissions["Device Management"] == true){
				temp.push('4')
			}
			if(res.data.permissions["Permission Management"] == true){
				temp.push('5')
			}
			if(res.data.permissions["System Settings"] == true){
				temp.push('6')
			}
			permiss.defaultList.admin = temp
		})
		.catch(error => {
			ElMessage.error('获取管理员权限信息失败，将使用默认权限信息')
		})

		//获取超级管理员权限信息
		axios.get('/user/role/get?role_name=super_admin')
		.then(res => {
			let temp = []
			if(res.data.permissions["Import Excel"] == true){
				temp.push('1')
			}
			if(res.data.permissions["Upload Package"] == true){
				temp.push('2')
			}
			if(res.data.permissions["Task Management"] == true){
				temp.push('3')
			}
			if(res.data.permissions["Device Management"] == true){
				temp.push('4')
			}
			if(res.data.permissions["Permission Management"] == true){
				temp.push('5')
			}
			if(res.data.permissions["System Settings"] == true){
				temp.push('6')
			}
			permiss.defaultList.super_admin = temp
			console.log(permiss.defaultList.super_admin)
		})
		.catch(error => {
			ElMessage.error('获取超级管理员权限信息失败，将使用默认权限信息')
		})
		
		return permiss
	},
	actions: {
		handleSet(val: string[]) {
			this.key = val;
		},
		initPermission() {
			
		}
	},

});
