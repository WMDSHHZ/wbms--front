<template>
    <el-button plain @click="outerVisible = true">
      Open the outer Dialog
    </el-button>
  
    <div>
      <el-dialog v-model="outerVisible" title="Outer Dialog" width="90%" :modal = "false">
        <el-table :data="tableData">
          <el-table-column prop="name"></el-table-column>
          <el-table-column label="1">
            <el-button @click="innerVisible = true">详情</el-button>
          </el-table-column>
        </el-table>

        <div class="dialog-footer">
          <el-button @click="outerVisible = false">Cancel</el-button>
          <el-button type="primary" @click="innerVisible = true">
            Open the inner Dialog
          </el-button>
        </div>
      </el-dialog>

      <el-dialog
        v-model="innerVisible"
        width="80%"
        title="Inner Dialog"
      >
        <el-table></el-table>>
      </el-dialog>
    </div>



  </template>
  
  <script lang="ts" setup name="test">
  import { ref } from 'vue'
  
  var outerVisible = ref(false)
  var innerVisible = ref(false)

  const tableData = ref([
    {
      name: '1'
    }
  ])
  </script>
  