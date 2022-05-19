<template>
  <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="80px" size="small" label-suffix="：">
    <el-form-item label="行" prop="row">
      <el-input-number v-model="form.row" :min="1" :max="15" />
    </el-form-item>
    <el-form-item label="列" prop="column">
      <el-input-number v-model="form.column" :min="1" :max="15" />
    </el-form-item>
    <el-form-item label="操作">
      <el-tooltip effect="light" content="生成表格" placement="top">
        <el-button type="primary" @click="submitForm" plain :icon="Edit" circle></el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="合并单元格" placement="top">
        <el-button type="primary" @click="merge" plain :icon="Expand" circle></el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="导出html文件" placement="top">
        <el-button type="primary" @click="exportFile('html')" plain :icon="Notebook" circle></el-button>
      </el-tooltip>
      <el-tooltip effect="light" content="导出excel文件" placement="top">
        <el-button type="primary" @click="exportFile('xlsx')" plain :icon="Film" circle></el-button>
      </el-tooltip>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { Film, Edit, Notebook, Expand } from "@element-plus/icons-vue";



const ruleFormRef = ref<FormInstance>(); // 组件校验项
const form = reactive({
  row: 6,
  column: 5,
});
const emits = defineEmits(["createTable", "merge", "exportFile", "transform"]); // 触发父组件事件

const check = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("请输入"));
  }
  if (!Number.isInteger(value)) {
    callback(new Error("请输入正确值"));
  } else {
    if (value < 0) {
      callback(new Error("请输入正确值"));
    } else {
      callback();
    }
  }
};
const rules = reactive<FormRules>({
  row: [{ validator: check, trigger: "blur" }],
  column: [{ validator: check, trigger: "blur" }],
});
// 校验
const submitForm = async () => {
  if (!ruleFormRef) return;
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      emits("createTable", form.row, form.column);
    }
  });
};
const merge = () => {
  emits("merge");
};
const exportFile = (type: string) => {
  emits("exportFile", type);
};

</script>
<style scoped>
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
