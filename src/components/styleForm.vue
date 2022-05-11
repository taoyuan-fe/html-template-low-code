<template>
  <el-form :model="form" label-width="80px">
    <el-form-item label="表格值">
      <el-input v-model="form.value" />
    </el-form-item>
  </el-form>
  <el-form :model="style" label-width="80px" size="small">
    <el-form-item label="宽度">
      <el-input v-model="style.width" @change="widthChange"/>
      <div class="describe">这会改变这整列的宽度</div>
    </el-form-item>
    <el-form-item label="高度">
      <el-input v-model="style.height" @change="heightChange"/>
      <div class="describe">这会改变这行的高度</div>
    </el-form-item>
    <el-form-item label="字体方向">
      <el-select v-model="style.textAlign" placeholder="Select">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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
import { reactive, defineProps, computed } from "vue";
import { TdOption, TdStyleModule } from "../interface/TdModule"; // 样式表

const props = defineProps({
  tDOption: {
    type: TdOption,
    default: () => new TdOption(),
  },
});

const options = [
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

const form = computed(() => props.tDOption);

const style = computed(() => props.tDOption.style);

// 宽度变化
const widthChange = (width: Number) => {
  props.tDOption.width = `${width}px`
}

// 高度变化
const heightChange = (height: Number) => {
  props.tDOption.height = `${height}px`
}

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