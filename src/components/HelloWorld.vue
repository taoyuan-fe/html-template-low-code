<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside>
        <formTable @createTable="createdTable"/>
      </el-aside>
      <el-main>
        <table ref="table" border="1" cellspacing="0" cellpadding="0">
          <!-- 标签用于对表格中的列进行组合，以便对其进行格式化 -->
          <colgroup>
            <col v-for="(item, index) in colgroup" :key="index" :width="item.width"/>
          </colgroup>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <template v-for="(subItem, subIndex) in item" :key="subIndex">
                <td
                  @click="chooseTd(index, subIndex, subItem.columnIndex)"
                  :colspan="subItem.colSpan"
                  :rowspan="subItem.rowSpan"
                  v-if="subItem.show"
                  class="table-cell"
                >
                  {{ subItem.value }}
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </el-main>
      <el-aside>
        <el-button @click="merge">合并单元格</el-button>
        <el-button @click="export2Excel">导出Html</el-button>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import formTable from './createTable.vue';
import getHtml from "../util/exportHtml";

defineProps({
  msg: String,
});
const tableData = ref([]); // 表格数据
const colgroup = ref([]); // 标签用于对表格中的列进行组合
const keyList = ref([]); // 设置一个二维数组 记录

onMounted(() => {
  createdTable(6, 5);
});
// 创建新表单数据
// 创建 3行 2列的表格
function createdTable(row, column) {
  if (!row && !column) {
    colgroup.value = [];
    tableData.value = [];
    return;
  }
  colgroup.value = Array(column).fill({ width: "150" });
  tableData.value = Array(row)
    .fill(0)
    .map((item, index) => {
      const res = [];
      for (let columnIndex = 0; columnIndex < column; columnIndex++) {
        res.push({
          columnIndex,
          colSpan: 1,
          rowSpan: 1,
          show: true,
          value: `第${index}行，第${columnIndex}列`,
        });
      }
      return res;
    });
}
// 选择tab
function chooseTd(row, column, columnIndex) {
  // 如果长度
  if (keyList.value.length < 2) {
    keyList.value.push({ row, column, columnIndex });
  } else {
    keyList.value = [{ row, column, columnIndex }];
  }
}
// 合并单元格
function merge() {
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
}
// table的
const table = ref(null);
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

<style scoped>
.row-active {
  background-color: #42b983;
}
</style>
