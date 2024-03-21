import { defineStore } from 'pinia';

interface ObjectList {
	[key: string]: string[];
}

//权限管理类，对应数字代表对应用户对象能访问的页面的permission值
export const usePermissStore = defineStore('permiss', {
	state: () => {
		const keys = localStorage.getItem('ms_keys');
		return {
			key: keys ? JSON.parse(keys) : <string[]>[],
			defaultList: <ObjectList>{
				admin: ['1', '2', '3', '4', '5', '6', '8'],
				operator: ['1', '2', '3', '4'],
				super_admin: ['1', '2', '3', '4', '5', '6', '7', '8']
			}
		};
	},
	actions: {
		handleSet(val: string[]) {
			this.key = val;
		}
	}
});
