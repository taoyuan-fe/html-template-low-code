<template>
  <el-form :model="form" label-width="80px" size="small">
    <el-form-item label="单元格内容">
      <el-input
        v-model="form.value"
        maxlength="40"
        placeholder="Please input"
        show-word-limit
        type="textarea"
      />
    </el-form-item>
  </el-form>
  <el-form :model="style" label-width="80px" size="small">
    <el-form-item label="宽度">
      <!-- <el-input v-model="style.width"/> -->
      <input-px v-model="style.width"/>
      <div class="describe">这会改变这整列的宽度</div>
    </el-form-item>
    <el-form-item label="高度">
      <input-px v-model="style.height"/>
      <div class="describe">这会改变这行的高度</div>
    </el-form-item>
    <el-form-item label="字体方向">
      <el-select v-model="style.textAlign" placeholder="Select">
        <el-option v-for="item in optionsAlign" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="字体粗细">
      <el-select v-model="style.fontWeight" placeholder="Select">
        <el-option v-for="item in optionsFontWeight" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="字体颜色">
      <el-color-picker v-model="style.color" show-alpha />
    </el-form-item>
    <el-form-item label="背景颜色">
      <el-color-picker v-model="style.backgroundColor" show-alpha />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {  defineProps, computed } from "vue";
import { TdOption } from "@/interface/TdModule"; // 样式表
import inputPx from './inputPx.vue'
const props = defineProps({
  tDOption: {
    type: TdOption,
    default: () => new TdOption(),
  },
});

const optionsAlign = [
  {
    value: "center",
    label: "居中",
  },
  {
    value: "left",
    label: "靠左",
  },
  {
    value: "right",
    label: "靠右",
  },
];
const optionsFontWeight = [
  {
    value: "normal",
    label: "标准",
  },
  {
    value: "bold",
    label: "加粗",
  },
  {
    value: "lighter",
    label: "变细",
  },
]

const form = computed(() => props.tDOption);

const style = computed(() => props.tDOption.style);


const onSubmit = () => {
  console.log("submit!");
};
</script>
<style lang="scss" scoped>
.describe {
  color: #F56C6C;
  font-size: 12px;
}
</style>