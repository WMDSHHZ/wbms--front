<template>
    <div :key="key">
        <div class="container">
            <div class="handle-box">
                <el-upload
                    action="#"
                    accept=".csv"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :http-request="handleMany"
                    v-loading.fullscreen.lock="importLoading"
                    element-loading-text="数据导入中，请稍后"
                >
                    <el-button 
                    class="mr10" 
                    type="success">批量导入</el-button>
                </el-upload>
                <el-link href="/template.xlsx" target="_blank" class="link">下载模板</el-link>
                <el-button type="danger" @click="deleteData">清空数据</el-button>
                <el-button @click="next">下一步</el-button>
            </div>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header" show-overflow-tooltip="true">
                <el-table-column prop="number" label="托号" align="center"></el-table-column>
                <el-table-column prop="MAC" label="MAC地址"></el-table-column>
            </el-table>
            <div v-if="showLengthinfoFlag">
                一共有{{ length }}条数据，已展示{{ showLength }}条数据
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="import">
import axios from 'axios';
import { ElMessage, ElNotification, UploadProps } from 'element-plus';
import { ref, onMounted, inject } from 'vue';
import * as XLSX from 'xlsx';
import { useRouter } from 'vue-router';

interface TableItem {
    number: number,
    MAC: string,
    PN: string,
    "模组号": string,
    traceCode: string
}

var tableData = ref<TableItem[]>([]);
const importLoading = ref(false)
var count=0 //用于标识上传文件数，手动控制文件数限制为1
var importList = ref<any>([]);
const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
    if(count<=0){
        count=1
        importLoading.value = true
        let param = new FormData();
        param.append("file",rawFile)
        param.append("file_type", "DEVICE_INFO")
        
        axios.post('/file/input', param)
        .then(res => {
            ElMessage.success('上传成功')
            importLoading.value = false
        })
        .catch(error => {
            ElMessage.error('上传失败')
            importLoading.value = false
        })
        importList.value = await analysisExcel(rawFile);
        console.log(importList.value.length)
        return true;
    }else{
        ElNotification.error('最多只能上传一个MAC文件')
    }
    
};
const analysisExcel = (file: any) => {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (e: any) {
            const data = e.target.result;
            let datajson = XLSX.read(data, {
                type: 'binary',
            });

            const sheetName = datajson.SheetNames[0];
            const result = XLSX.utils.sheet_to_json(datajson.Sheets[sheetName]);
            resolve(result);
        };
        reader.readAsBinaryString(file);
    });
};

var length = ref()
var showLength = ref()
var showLengthinfoFlag = ref(false)
const handleMany = async () => {
    const list = importList.value.map((item: any, index: number) => {
        return {
            number: item['pallet_number'],
            MAC: item['MAC'],
            PN: item['PN'],
            "模组号": item['module'],
            traceCode: item['Trace code']
        };
    });
    
    if (list.length > 50) {
        for (let i = 0; i < 50; i++) {
            tableData.value.push(list[i]);
        }
        showLength.value = 50
    } else {
        tableData.value.push(...list);
        showLength.value = list.length
    }

    length = list.length
    showLengthinfoFlag.value = true
      
};


const deleteData = () => {
    tableData.value = []
    showLengthinfoFlag.value = false
    count=0
}

const router = useRouter();
const next = () => {
    if(tableData.value.length == 0){
        ElMessage({
            type: 'error',
            message: '请先导入数据'
        })
    }else{
        sessionStorage.setItem('flag', 'true')
        router.push('/upload')
    }
    
}

const key = ref(0)
router.beforeEach((to, from, next) => {
    key.value = inject('count', 0)
    console.log(key.value)
    let refresh = sessionStorage.getItem('refresh')
    console.log(refresh)
    if (refresh == 'true') {
        //清空数据
        sessionStorage.setItem('refresh', 'false')
        deleteData()
    }
    next();
});

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
.mr10 {
    margin-right: 10px;
}
.link{
    margin-right: 10px;
}
</style>
