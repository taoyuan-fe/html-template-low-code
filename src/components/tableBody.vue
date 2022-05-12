<template>
  <!-- 遮罩层 -->
  <div
    class="mask"
    :style="'width:' + mask_width + 'left:' + mask_left + 'height:' + mask_height + 'top:' + mask_top"
  ></div>
  <el-aside class="aside">
    <el-card>
      <template #header> 表单操作 </template>
      <form-table @createTable="createdTable" />
      <el-button @click="merge" type="primary">合并单元格</el-button>
      <el-button @click="export2Excel" type="primary">导出Html</el-button>
    </el-card>
  </el-aside>
  <el-main class="content-box" @click="clear" @mousedown="handleMouseDown">
    <div class="content">
      <table ref="table" border="1" cellspacing="0" cellpadding="0" class="easy">
        <!-- 标签用于对表格中的列进行组合，以便对其进行格式化 -->
        <colgroup>
          <col v-for="(item, index) in colgroup" :key="index" :width="item.width" />
        </colgroup>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <template v-for="(subItem, subIndex) in item" :key="subIndex">
              <td
                @click.stop="chooseTd(subItem)"
                :colspan="subItem.colSpan"
                :rowspan="subItem.rowSpan"
                :id="subItem.id"
                v-if="subItem.show"
                class="table-cell"
                :style="subItem.style"
              >
                {{ subItem.value }}
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </el-main>
  <el-aside class="aside">
    <!-- 样式修改表单 -->
    <style-form v-if="tDOption.id" :tDOption="tDOption" />
  </el-aside>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs } from "vue";
import FormTable from "./createTable.vue"; // 生成表单form表单
import StyleForm from "./styleForm.vue"; // 样式修改
import { TdOption, ColgroupModule } from "@/interface/TdModule"; // 样式表

// hook 拖拽框
import maskHook from "@/hook/mask";
// 导出html文件
import exportHtmlHook from "@/hook/exportHtml";

directives: {
}
// 拖拽框架 Hook 解构
const {
  mask_width, // 拖拽框宽度
  mask_height, // 拖拽框高度
  mask_left, // 拖拽框左边
  mask_top, // 拖拽框顶部
  handleMouseDown, // 鼠标单击后事件
  selectDomList, // 拖拽框选中的dom
  resSetXY, // 清除
} = maskHook();
// 导出html文件hook
const { getHtml } = exportHtmlHook();

const tableData = ref<TdOption[][]>([]); // 表格数据
const colgroup = ref<ColgroupModule[]>([]); // 标签用于对表格中的列进行组合

const tDOption = ref<TdOption>(new TdOption()); // 当前选中的表单样式-和属性
const table = ref<any>(null); // table的Ref

onMounted(() => {
  createdTable(6, 5);
});

// 清空
const clear = () => {
  tDOption.value = new TdOption(); // 清空当前选中项
  // keyList.value = []; // 选中范围
};
// 创建新表单数据
// 创建 3行 2列的表格
const createdTable = (row: number, column: number) => {
  clear();
  if (!row && !column) {
    colgroup.value = [];
    tableData.value = [];
    return;
  }
  colgroup.value = Array(column).fill({ width: "150px" });
  tableData.value = Array(row)
    .fill(0)
    .map((item, index) => {
      const res = [];
      for (let columnIndex = 0; columnIndex < column; columnIndex++) {
        res.push(new TdOption(index, columnIndex));
      }
      return res;
    });
};
// 选择tab
const chooseTd = (subItem: TdOption) => {
  // 设置表单的数据值 + 样式
  tDOption.value = subItem;
};
// 合并单元格
const merge = () => {
  if (selectDomList.value.length < 2) {
    return;
  }
  const start = selectDomList.value[0]; // 开始节点
  const end = selectDomList.value[selectDomList.value.length - 1]; // 结束节点
  // const [start, end] = keyList.value;
  // 首先合并行
  for (let i = start.row; i <= end.row; i++) {
    let value = tableData.value[i][start.column];
    value.colSpan = end.column + 1 - start.column;
    for (let k = start.column + 1; k <= end.column; k++) {
      tableData.value[i][k].show = false;
    }
  }
  // 合并列
  // 首先遍历列 - 取出需要进行合并的第一项数据
  for (let i = start.column; i <= end.column; i++) {
    // 取出需要进行合并的列
    let value = tableData.value[start.row][i];
    value.rowSpan = end.row + 1 - start.row;
    for (let j = start.row + 1; j <= end.row; j++) {
      tableData.value[j][start.column].show = false;
    }
  }
  // 合并单元格
  resSetXY();
};

function export2Excel() {
  if (!table!.value) {
    return;
  }
  let template = table.value.outerHTML;
  const a = document.createElement("a");
  const url = window.URL.createObjectURL(
    new Blob([getHtml(template)], {
      type: "",
    })
  );
  a.href = url;
  a.download = "模板.html";
  a.click();
  window.URL.revokeObjectURL(url);
}
</script>

<style lang="scss" scoped>
.aside {
  padding: 10px;
  height: auto;
}
.card-header {
  display: flex;
}
.content-box {
  border: 1px solid #ebeef5;
  height: 100%;
}
.content {
  display: flex;
  justify-content: center;
}
.easy {
  width: 100%;
  margin: 0;
  border-collapse: collapse;
  border-spacing: 0;
}
.mask {
  position: absolute;
  background: #409eff;
  z-index: 1;
  opacity: 0.4;
}
</style>
