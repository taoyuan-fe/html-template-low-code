<template>
  <!-- 遮罩层 -->
  <div
    class="mask"
    v-if="positionList.is_show_mask"
    :style="'width:' + mask_width + 'left:' + mask_left + 'height:' + mask_height + 'top:' + mask_top"
  ></div>
  <el-aside class="aside">
    <el-card>
      <template #header> 表单操作 </template>
      <form-table @createTable="createdTable" @merge="merge" @exportFile="exportFile" />
    </el-card>
    <el-card>
      <template #header> 导入文件 </template>
      <upload-html @transformTable="transformTable" />
    </el-card>
  </el-aside>
  <el-main class="content-box" @click="clear" @mousedown="handleMouseDown">
    <div class="content">
      <table
        ref="table"
        class="table-box"
        :cellspacing="0"
        :cellpadding="0"
        :border="1"
        style="border-collapse: collapse"
        :class="{ hideSelect: positionList.is_show_mask }"
      >
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <template v-for="(subItem, subIndex) in item" :key="subIndex">
              <!-- 点击可以直接输入 -->
              <!-- @input="changeValue(subItem, $event)"
                :contenteditable="true" -->
              <td
                v-if="subItem.show"
                @click.stop="chooseTd(subItem)"
                v-mouse-menu="{
                  params: { row: index, column: subIndex },
                  ...menuOptions,
                }"
                :colspan="subItem.colSpan"
                :rowspan="subItem.rowSpan"
                :id="subItem.id"
                :style="subItem.style"
                :class="{ active: tDOption.id === subItem.id }"
                v-html="subItem.value"
              ></td>
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
import { ref, onMounted, nextTick, getCurrentInstance } from "vue";
import FormTable from "./createTable.vue"; // 生成表单form表单
import uploadHtml from "./uploadHtml.vue"; // 导入html 并且重新生成
import StyleForm from "./styleForm.vue"; // 样式修改
import { TdOption } from "@/interface/TdModule"; // 样式表

// hook 拖拽框
import maskHook from "@/hook/mask";
// Hook 导出html文件
import exportHtmlHook from "@/hook/exportHtml";
// Hook 导出excel文件
import tableToExcel from "@/hook/tableToExcel";
// 鼠标右键菜单行为
import { MouseMenuDirective } from "@howdyjs/mouse-menu";

// 拖拽框架 Hook 解构
const {
  positionList, //
  mask_width, // 拖拽框宽度
  mask_height, // 拖拽框高度
  mask_left, // 拖拽框左边
  mask_top, // 拖拽框顶部
  selectDomList, // 拖拽框选中的dom
  selectDomMap, // 拖拽框选中的map
  handleMouseDown, // 鼠标单击后事件
  resSetXY, // 清除
} = maskHook();
// 导出html文件hook
const { getHtml } = exportHtmlHook();
// 导出excel文件hook
const { exportExcel } = tableToExcel();

const tableData = ref<TdOption[][]>([]); // 表格数据

const tDOption = ref<TdOption>(new TdOption()); // 当前选中的表单样式-和属性
const table = ref<any>(null); // table的Ref

const vMouseMenu: any = MouseMenuDirective; // 自定义指令

// 右键菜单
const menuOptions = {
  menuList: [
    {
      label: "左侧插入列",
      tips: "1列",
      fn: (params: { column: number }) => {
        const index = params.column - 1 < 0 ? 0 : params.column - 1;
        addColumn(index);
      },
    },
    {
      label: "右侧插入列",
      tips: "1列",
      fn: (params: { column: number }) => {
        addColumn(params.column + 1);
      },
    },
    {
      label: "上方插入行",
      tips: "1行",
      fn: (params: { row: number }) => {
        const index = params.row - 1 < 0 ? 0 : params.row - 1;
        addRow(index);
      },
    },
    {
      label: "下方插入行",
      tips: "1行",
      fn: (params: { row: number }) => {
        addRow(params.row + 1);
      },
    },
  ],
  menuWrapperCss: {
    background: "#fff",
    borderRadius: "10px",
  },
};

onMounted(() => {
  console.log(getCurrentInstance());
  createdTable(6, 5);
});

// 清空
const clear = () => {
  tDOption.value = new TdOption(); // 清空当前选中项
};
// 创建新表单数据
const createdTable = (row: number, column: number) => {
  clear();
  if (!row && !column) {
    tableData.value = [];
    return;
  }
  tableData.value = Array(row)
    .fill(0)
    .map((item, index) => {
      const res = [];
      // 列的标志
      for (let columnIndex = 0; columnIndex < column; columnIndex++) {
        res.push(new TdOption(`${index}-${columnIndex}`));
      }
      return res;
    });
};
// 转换新表格
const transformTable = (arr: TdOption[][]) => {
  tableData.value = arr;
  // const { ctx } = getCurrentInstance();
  // ctx.$forceUpdate();
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
  // const start = selectDomList.value[0]; // 开始节点

  // let value = tableData.value[start.row][start.column];
  let targetNode = {
    id: `${selectDomList.value[0].row}-${selectDomList.value[0].column}`,
    row: -1,
    column: -1
  }
  let value: TdOption = new TdOption();
  selectDomMap.value.delete(targetNode.id) // 从合并的表格中删除掉我们用来合并的节点防止重复
  // 不仅要转换表格的合并值
  // 首先合并行
  // 从起始行开始 合并每一个单元行
  for (let i = 0; i < tableData.value.length; i++) {
    tableData.value[i] = tableData.value[i].filter((subItem, subIndex) => {
      const { id, style: {width, height}, colSpan, rowSpan } = subItem
      // 如果当前节点就是我们要进行合并的第一个节点
      // 就将这个节点取出来进行合并操作
      if(targetNode.id === id){
        value = subItem
        targetNode.row = i
        targetNode.column = subIndex
      }
      // 如果是初始节点就不进行操作了
      if (selectDomMap.value.has(id)) {
        // 已经被合并的就不加上去了
        // 还需要转换合并后的宽度
        if (i == targetNode.row) {
          value.style.width = getValue(value.style.width, width);
          value.colSpan +=  colSpan;
        }
        if (subIndex == targetNode.column) {
          value.style.height = getValue(value.style.height,height);
          value.rowSpan +=  rowSpan;
        }
      }else{
        return subItem
      }
    })
  }
  // 合并单元格
  resSetXY();
};
// 转换合并之后的宽度和长度
const getValue = (addend1: string, addend2: string) => {
  const value1 = addend1.replace("px", "");
  const value2 = addend2.replace("px", "");
  return `${Number(value1) + Number(value2)}px`;
};
// 导出文件事件
const exportFile = (type: string) => {
  if (!table!.value) {
    return;
  }
  if (type === "html") {
    exportHtml(table.value);
  } else if (type === "xlsx") {
    exportExcel(table.value);
  }
};
// 导出html
const exportHtml = (table: any) => {
  let template = table.outerHTML;
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
};
// 添加行
const addRow = (index: number) => {
  // 插入行的话，我们首先需要知道 每一行有几列
  const columnLength = tableData.value[0].length;
  const res = [];
  for (let columnIndex = 0; columnIndex < columnLength; columnIndex++) {
    res.push(new TdOption(`${index}-${columnIndex}`));
  }
  tableData.value.splice(index, 0, res);
  // 插入完毕之后
  // 然后我们需要逐一进行id的更新
  // 之后我们需要对后面的每一列的id进行更新
  const rowLength = tableData.value.length;
  for (let rowIndex = index + 1; rowIndex < rowLength; rowIndex++) {
    tableData.value[rowIndex].forEach((column, columnIndex) => {
      column.resetId(`${rowIndex}-${columnIndex}`);
    });
  }
};
// 添加列
const addColumn = (index: number) => {
  // 先确定行的长度
  const rowLength = tableData.value.length;
  for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
    // 先进性添加
    tableData.value[rowIndex].splice(index, 0, new TdOption(`${rowIndex}-${index}`));
    const columnLength = tableData.value[0].length;
    // 然后对之后的内容进行修改
    for (let columnIndex = index + 1; columnIndex < columnLength; columnIndex++) {
      tableData.value[rowIndex][columnIndex].resetId(`${rowIndex}-${columnIndex}`);
    }
  }
  // 重置一下选中项
  resSetXY();
};
// 表格内切换数据
const changeValue = (subItem: TdOption, event: Event) => {
  if (!event.target) {
    return;
  }
  subItem.value = (event.target as HTMLDivElement).innerText;
};
</script>

<style lang="scss" scoped>
.hideSelect {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10+ and Edge */
  user-select: none; /* Standard syntax */
}
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
.table-box {
  z-index: 1;
  opacity: 0.8;
  border-collapse: collapse;
  border-spacing: 0;
}
.mask {
  position: absolute;
  background: rgb(64, 158, 255, 0.7);
}
.active {
  // background: rgb(220, 219, 219, 0.4) !important;
  border: 1px solid red !important;
}
</style>
