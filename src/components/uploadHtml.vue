<template>
  <div class="upload-box">
    <el-upload
      class="upload-body"
      ref="upload"
      accept=".html"
      :on-success="onSuccess"
      action="#"
      :limit="1"
      :http-request="importFile"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-tooltip effect="light" content="上传html文件" placement="top">
        <el-button type="primary" plain :icon="Upload" circle></el-button>
      </el-tooltip>
      <template #tip><div class="el-upload__tip">上传html，生成表格</div> </template>
    </el-upload>
    <div class="upload-body">
      <el-tooltip effect="light" content="生成表格" placement="top">
        <el-button type="primary" plain :icon="DocumentChecked" circle @click="onSuccess"></el-button>
      </el-tooltip>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { Upload, DocumentChecked } from "@element-plus/icons-vue";
// Hook 导出excel文件
import importHtml from "@/hook/importHtml";
import type {
  UploadInstance,
  UploadFile,
  UploadFiles,
  UploadUserFile,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions,
} from "element-plus";
import { ElMessage, genFileId } from "element-plus";

// 导入hook
const { importf, transformTable } = importHtml();

const emits = defineEmits(["transformTable"]); // 触发父组件事件
// 导入文件列表
const fileList = ref<UploadUserFile[]>([]);
const upload = ref<UploadInstance>();

const handleChange: UploadProps["onChange"] = (file: UploadFile, files: UploadFiles) => {
  // 这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
  let isJPG = file.raw!.type === "text/html";
  if (!isJPG) {
    ElMessage({
      message: "只能上传html文件",
      type: "warning",
    });
    fileList.value.pop();
  }
  fileList.value = files;
};
const handleRemove: UploadProps["onRemove"] = (file: UploadFile, files: UploadFiles) => {
  fileList.value = files;
};
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
const importFile = (options: UploadRequestOptions) => {
  importf(options.file);
};
const onSuccess = () => {
  emits("transformTable", transformTable.value);
};
</script>
<style lang="scss" scoped>
.upload-box {
  display: flex;
}
.upload-body {
  flex: 1;
}
</style>
