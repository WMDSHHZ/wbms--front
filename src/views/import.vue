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
                <el-button type="primary">上传数据</el-button>
                <el-button type="danger" @click="deleteData">清空数据</el-button>
            </div>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header" show-overflow-tooltip="true">
                <el-table-column prop="number" label="托号" width="200px" align="center"></el-table-column>
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
var progressPercent = ref()

var importList = ref<any>([]);
const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
    let param = new FormData();
    param.append("file",rawFile)
    param.append("file_type", "DEVICE_INFO")
    
    axios.post('/file/output', param)
    .then(res => {
        ElMessage({
            type: 'success',
            message: '上传成功'
        })
    })
    .catch(error => {
        console.log(error)
    })
    importList.value = await analysisExcel(rawFile);
    console.log(importList.value.length)
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
    
    if (list.length > 50) {
        for (let i = 0; i < 50; i++) {
            tableData.value.push(list[i]);
        }
    } else {
        tableData.value.push(...list);
    }

    console.log(tableData.value);
      
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
