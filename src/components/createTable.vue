<template>
  <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="60px">
    <el-form-item label="行" prop="row">
      <el-input-number v-model="form.row" :min="1" :max="15" />
    </el-form-item>
    <el-form-item label="列" prop="column">
      <el-input-number v-model="form.column" :min="1" :max="15" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">生成</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";

const dialogFormVisible = ref(false);
const ruleFormRef = ref<FormInstance>(); // 组件校验项
const form = reactive({
  row: 6,
  column: 5,
});
const emits = defineEmits(["createTable"]);

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
