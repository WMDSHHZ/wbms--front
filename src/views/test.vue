<template>
  <div>
    <el-button plain @click="dialogTableVisible = true">
      Open the outer Dialog
    </el-button>
  </div>


  <div>
    <el-dialog
    v-model="dialogTableVisible"
    style="z-index: 20;">
      <el-tabs v-model="page" >
        <el-tab-pane name="first" label="卫星数据">
          <el-table :data="tableTleData">
            <el-table-column prop="name" label="卫星名称"></el-table-column>
            <el-table-column prop="data1" label="tle1"></el-table-column>
            <el-table-column prop="data1" label="tle2"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
  
<script lang="ts" setup name="test">
import { ref } from 'vue'

var dialogTableVisible = ref(false)
var page = ref('first')

const tableTleData = [
{
  name: 'aaa',
  data1: '1 11962U 80073A   80253.44930232  .00000016  00000-0  00000+0 0    12',
  data2: '2 11962  81.2400 177.7389 0060506 293.5174  65.9686 14.13684653    07'
},
{
  name: 'bbb',
  data1: '1 11962U 80073A   80253.52032942  .00000015  00000-0  00000+0 0    22',
  data2: '2 11962  81.2574 177.6557 0031206 251.7983 107.9348 14.06430944    11'
}
]

var dialogTableVisible = ref(false)
const getlogDialog = () => {
  console.log('111')
  console.log(dialogTableVisible)
  dialogTableVisible.value = true
  console.log(dialogTableVisible)
  /*
  let dialog = document.querySelector("dialog")
  if(!dialogTableVisible){
    dialog.show()
  }else{
    dialog.close()
  }
  dialogTableVisible = !dialogTableVisible
  */
}
</script>
  