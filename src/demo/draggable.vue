<template>
  <div class="box-img" @mousedown="handleMouseDown">
    <div
      class="mask"
      v-show="positionList.is_show_mask"
      :style="'width:' + mask_width + 'left:' + mask_left + 'height:' + mask_height + 'top:' + mask_top"
    ></div>
    <el-checkbox-group v-model="selectedState" class="checkboxGroup">
      <el-checkbox
        v-for="(item, index) in tableData"
        :key="index"
        :label="item.id"
        :class="selectedState.includes(item.id) ? 'checkbox aa-active' : 'checkbox'"
        @change="checkItem($event, item)"
      >
        <!-- <img style="width: 100%; height: 100%" :src="handleAssetsImages(item.img)" alt="" /> -->
        {{ index }}
        <span class="num" v-show="selectedState.includes(item.id)">{{ selectedState.indexOf(item.id) + 1 }}</span>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from "vue";

// 假设这个是上边小div的列表，后台数据请求回来的吗，假设已经有数据了，里面有唯一标识符id
const tableData = reactive([
  { id: "abcd1", data: "cccc", img: "1.png" },
  { id: "abcd2", data: "dddd", img: "1.png" },
  { id: "abcd3", data: "eeee", img: "1.png" },
  { id: "abcd4", data: "ffff", img: "1.png" },
  { id: "abcd5", data: "gggg", img: "1.png" },
  { id: "abcd6", data: "hhhh", img: "1.png" },
  { id: "abcd7", data: "iiii", img: "1.png" },
  { id: "abcd8", data: "jjjj", img: "1.png" },
  { id: "abcd9", data: "kkkk", img: "1.png" },
  { id: "abcd10", data: "llll", img: "1.png" },
]);

const selectedState = ref([]); // 上方div图片是否被多选中，如果多选了就把id放到这个列表里面，当然可以不用，直接在相应的列表对象加一个参数isSelected也行

const positionList = reactive({
  is_show_mask: false,
  box_screen_left: 0,
  box_screen_top: 0,
  start_x: 0,
  start_y: 0,
  end_x: 0,
  end_y: 0,
});
//分别计算遮罩层的位置，大小
const mask_width = computed(() => {
  return `${Math.abs(positionList.end_x - positionList.start_x)}px;`;
});
const mask_height = computed(() => {
  return `${Math.abs(positionList.end_y - positionList.start_y)}px;`;
});
const mask_left = computed(() => {
  return `${Math.min(positionList.start_x, positionList.end_x) - positionList.box_screen_left}px;`;
});
const mask_top = computed(() => {
  return `${Math.min(positionList.start_y, positionList.end_y) - positionList.box_screen_top}px;`;
});

//单击多选框选中
const checkItem = (val, item) => {
  console.log(val, item);

  let str = item.id;
  let i = selectedState.value.indexOf(str); // 判断选中列表中是否包含这个点击的div
  if (i < 0) {
    selectedState.value.push(str); // 如果不包含就加进去
  } else {
    selectedState.value.splice(i, 1); // 如果包含就删
  }
};

//鼠标按下事件
const handleMouseDown = (event) => {
  positionList.is_show_mask = true;
  positionList.start_x = event.clientX;
  positionList.start_y = event.clientY;
  positionList.end_x = event.clientX;
  positionList.end_y = event.clientY;
  document.body.addEventListener("mousemove", handleMouseMove); //监听鼠标移动事件
  document.body.addEventListener("mouseup", handleMouseUp); //监听鼠标抬起事件
};

function handleMouseMove(event) {
  positionList.end_x = event.clientX;
  positionList.end_y = event.clientY;
}

function handleMouseUp() {
  document.body.removeEventListener("mousemove", handleMouseMove);
  document.body.removeEventListener("mouseup", handleMouseUp);
  positionList.is_show_mask = false;
  handleDomSelect();
  resSetXY();
}

function handleDomSelect() {
  const dom_mask = window.document.querySelector(".mask");
  //getClientRects()每一个盒子的边界矩形的矩形集合
  const rect_select = dom_mask.getClientRects()[0];
  console.log(rect_select);
  const add_list = [];
  const del_list = [];
  document.querySelectorAll(".el-checkbox-group .el-checkbox").forEach((node, index) => {
    const rects = node.getClientRects()[0];
    if (collide(rects, rect_select) === true) {
      if (selectedState.value.includes(tableData[index].id)) {
        del_list.push(tableData[index].id);
      } else {
        add_list.push(tableData[index].id);
      }
    }
  });
  selectedState.value = selectedState.value.concat(add_list).filter((item) => !del_list.includes(item));
}
//比较checkbox盒子边界和遮罩层边界最大最小值
function collide(rect1, rect2) {
  const maxX = Math.max(rect1.x + rect1.width, rect2.x + rect2.width);
  const maxY = Math.max(rect1.y + rect1.height, rect2.y + rect2.height);
  const minX = Math.min(rect1.x, rect2.x);
  const minY = Math.min(rect1.y, rect2.y);
  return maxX - minX <= rect1.width + rect2.width && maxY - minY <= rect1.height + rect2.height;
}

//清除
function resSetXY() {
  positionList.start_x = 0;
  positionList.start_y = 0;
  positionList.end_x = 0;
  positionList.end_y = 0;
}
</script>
<style lang="scss" scoped>
.box-img {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
  height: 100%;
  width: 100%;

  .mask {
    position: absolute;
    background: #409eff;
    opacity: 0.4;
    z-index: 100;
  }
}
.checkboxGroup {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .el-checkbox {
    margin: 10px;
  }
  .el-checkbox__input {
    white-space: nowrap;
    cursor: pointer;
    outline: 0;
    display: inline-flex;
    position: absolute;
    right: 5px;
    top: 5px;
  }

  .el-checkbox__label {
    padding: 0;
    width: 100%;
    height: 100%;
  }
  .el-checkbox__input .el-checkbox__inner:after {
    border-color: #00ffff;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    border: 1px solid #00ffff;
  }
  .el-checkbox__inner {
    border: 1px solid #fff;
  }
}
.checkbox {
  border: 1px solid #999;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
}
.checkbox-active {
  border: 1px solid #00ffff;
}
.num {
  position: absolute;
  right: 25px;
  top: 5px;
  color: #00ffff;
}
</style>
