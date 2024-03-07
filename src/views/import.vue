<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-upload
                    action="#"
                    :limit="1"
                    accept=".xlsx, .xls"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :http-request="handleMany"
                >
                    <el-button class="mr10" type="success">批量导入</el-button>
                </el-upload>
                <el-link href="/template.xlsx" target="_blank">下载模板</el-link>
                <el-button type="primary" @click="uploadData">上传数据</el-button>
                <el-button type="danger" @click="deleteData">清空数据</el-button>
            </div>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header" show-overflow-tooltip="true">
                <el-table-column prop="number" label="托号" width="60px" align="center"></el-table-column>
                <el-table-column prop="MAC" label="MAC地址"></el-table-column>
            </el-table>
            
        </div>
    </div>
</template>

<script setup lang="ts" name="import">
import axios from 'axios';
import { ElMessage, UploadProps } from 'element-plus';
import { ref } from 'vue';
import * as XLSX from 'xlsx';

interface TableItem {
    number: number,
    MAC: string,
    PN: string,
    "模组号": string,
    traceCode: string
}

var tableData = ref<TableItem[]>([]);
var tempTableData = ref<TableItem[]>([]);

var importList = ref<any>([]);
const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
    importList.value = await analysisExcel(rawFile);
    console.log(importList.value)
    return true;
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

//上传MAC地址
const uploadData = () => {
    var mac = new Array()
    for(let i=0;i<tableData.value.length;i++){
        mac[i] = tableData.value[i].MAC
    }
    let param = {
        mac : mac
    }

    axios.post('/battery/connect', param)
        .then( res => {
            ElMessage({
                message: '上传成功',
                type: 'success',
            })
        })
        .catch( e => {
            ElMessage({
                message: '上传失败',
                type: 'error',
            })
        })

}

const handleMany = async () => {
    const list = importList.value.map((item: any, index: number) => {
        return {
            number: item['套号'],
            MAC: item['MAC'],
            PN: item['PN'],
            "模组号": item['模组号'],
            traceCode: item['Trace code']
        };
    });
    tableData.value.push(...list)  
    if(list.length > 50){
        for(let i=0;i<50;i++){
            tempTableData.value[i] = list[i]
        }
    }
      
};

const deleteData = () => {
    console.log(tableData.value)
    tableData = ref<TableItem[]>([]);
    console.log(tableData.value)
}
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
</style>
