<template>
  <div
    class="mask"
    :style="{
      width: '600px',
      left: '649px',
      height:'240px',
      top: '21px'
    }"
  ></div>
  <el-aside class="aside">
    <el-card>
      <template #header> 表单操作 </template>
      <formTable @createTable="createdTable" />
      <el-button @click="merge" type="primary">合并单元格</el-button>
      <el-button @click="export2Excel" type="primary">导出Html</el-button>
    </el-card>
  </el-aside>
  <el-main style="background-color: #f2f6fc" @click="clear">
    <div class="content">
      <table ref="table" border="1" cellspacing="0" cellpadding="0">
        <!-- 标签用于对表格中的列进行组合，以便对其进行格式化 -->
        <colgroup>
          <col v-for="(item, index) in colgroup" :key="index" :width="item.width" />
        </colgroup>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <template v-for="(subItem, subIndex) in item" :key="subIndex">
              <td
                @click.stop="chooseTd(index, subIndex, subItem, $event)"
                :colspan="subItem.colSpan"
                :rowspan="subItem.rowSpan"
                v-if="subItem.show"
                class="table-cell"
                :class="{
                  'row-active': active(index, subItem.columnIndex),
                  'table-focus': tDOption.id === subItem.id,
                }"
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
    <styleForm v-if="tDOption.id" :tDOption="tDOption" />
  </el-aside>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import formTable from "./createTable.vue"; // 生成表单form表单
import styleForm from "./styleForm.vue"; // 样式修改
import { TdOption } from "../interface/TdModule"; // 样式表
import getHtml from "../util/exportHtml";

const tableData = ref([]); // 表格数据
const colgroup = ref([]); // 标签用于对表格中的列进行组合
const keyList = ref([]); // 设置一个长度为二的数组 记录
const tDOption = ref({}); // 当前选中的表单样式-和属性
const table = ref(null); // table的

onMounted(() => {
  createdTable(6, 5);
});
const active = (index, subIndex) => {
  const [key1, key2] = keyList.value;
  if (!key1 || !key2) {
    return false;
  }
  return index >= key1.row && subIndex >= key1.columnIndex && index <= key2.row && subIndex <= key2.columnIndex;
};
// 清空
const clear = () => {
  tDOption.value = {}; // 清空当前选中项
  keyList.value = []; // 选中范围
};
// 创建新表单数据
// 创建 3行 2列的表格
const createdTable = (row, column) => {
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
const chooseTd = (row, column, subItem, event) => {
  console.log(event.target.getBoundingClientRect());
  const { columnIndex } = subItem;
  // 设置表单的数据值
  tDOption.value = subItem;
  // 如果当前有数据的时候
  if (keyList.value.length == 1) {
    const oldTd = keyList.value[0]; // 取出第一项进行比对
    if (oldTd.row >= row && oldTd?.column >= column && oldTd?.columnIndex >= columnIndex) {
      keyList.value.unshift({ row, column, columnIndex });
      return;
    }
    keyList.value.push({ row, column, columnIndex });
  } else if (keyList.value.length === 2) {
    keyList.value = [{ row, column, columnIndex }];
  } else {
    keyList.value.push({ row, column, columnIndex });
  }
};
// 合并单元格
const merge = () => {
  const [start, end] = keyList.value;
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
};

function export2Excel() {
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
.content {
  display: flex;
  justify-content: center;
  .row-active {
    background-color: #c6e2ff !important;
  }
  table {
    z-index: 2;
    opacity: 1;
  }
}
.table-focus {
  border: 2px solid #f56c6c !important;
}
.mask {
  position: absolute;
  background: #c6e2ff;
  opacity: 1;
  z-index: 1;
}
</style>
