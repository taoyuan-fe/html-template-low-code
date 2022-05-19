import { reactive, computed, ref, toRefs, nextTick } from "vue";
import { DomItem, DOMRect } from "@/interface/DOMRect";
export default function () {
  // 遮罩层宽度+位置
  const positionList = reactive({
    is_show_mask: false,
    start_x: 0,
    start_y: 0,
    end_x: 0,
    end_y: 0,
  });
  // 被选中的表格数据
  let selectDomList = ref<Array<DomItem>>(new Array<DomItem>());
  // 被选中的表格map数据
  const selectDomMap = ref(new Map());
  //分别计算遮罩层的位置，大小
  const mask_width = computed(() => {
    return `${Math.abs(positionList.end_x - positionList.start_x)}px;`;
  });
  const mask_height = computed(() => {
    return `${Math.abs(positionList.end_y - positionList.start_y)}px;`;
  });
  const mask_left = computed(() => {
    return `${Math.min(positionList.start_x, positionList.end_x)}px;`;
  });
  const mask_top = computed(() => {
    return `${Math.min(positionList.start_y, positionList.end_y)}px;`;
  });
  //鼠标按下事件
  const handleMouseDown = (event: MouseEvent) => {
    positionList.is_show_mask = true;
    positionList.start_x = event.clientX;
    positionList.start_y = event.clientY;
    positionList.end_x = event.clientX;
    positionList.end_y = event.clientY;
    document.body.addEventListener("mousemove", handleMouseMove); //监听鼠标移动事件
    document.body.addEventListener("mouseup", handleMouseUp); //监听鼠标抬起事件
  };

  function handleMouseMove(event: MouseEvent) {
    positionList.end_x = event.clientX;
    positionList.end_y = event.clientY;
  }

  function handleMouseUp() {
    document.body.removeEventListener("mousemove", handleMouseMove);
    document.body.removeEventListener("mouseup", handleMouseUp);
    handleDomSelect();
    // resSetXY();
  }
  // 选中dom中的值
  // resize 是否需要在进行重绘
  function handleDomSelect(resize = true) {
    const dom_list = new Array<DomItem>(); // 选中的节点
    selectDomMap.value.clear(); // 清空一次码表值
    nextTick(() => {
      // 拖拽款的dom属性位置
      const dom_mask = window.document.querySelector(".mask");
      if (!dom_mask) {
        return;
      }
      //getClientRects()每一个盒子的边界矩形的矩形集合
      const rect_select: DOMRect = dom_mask.getClientRects()[0];
      // 判断一下拖拽框是不是有覆盖了table
      const tableDom = document.querySelectorAll("table")[0].getClientRects()[0]
      if(collide(tableDom, rect_select) === false){
        resSetXY();
        return
      }
      document.querySelectorAll(".table-box td").forEach((node, index) => {
        const rects: DOMRect = node.getClientRects()[0];
        if (collide(rects, rect_select) === true) {
          dom_list.push(new DomItem(rects, node.id));
          // 设置dom的map节点
          selectDomMap.value.set(node.id, true);
        }
      });
      selectDomList.value = dom_list;
      // 如果
      if (resize) {
        // 如果当前选中的 td 节点长度没有两个就不需要遮罩层显示了
        // 也是为了点击之后修改单元格长度、高度的时候，遮罩层出现覆盖不完整的情况
        if (selectDomList.value.length > 1) {
          resetMask();
        } else {
          resSetXY();
        }
      }
    })
  }
  //比较checkbox盒子边界和遮罩层边界最大最小值
  // rect1当前选中的节点
  // rect2拖拽框节点
  function collide(rect1: DOMRect, rect2: DOMRect): Boolean {
    const maxX = Math.max(rect1.x + rect1.width, rect2.x + rect2.width);
    const maxY = Math.max(rect1.y + rect1.height, rect2.y + rect2.height);
    const minX = Math.min(rect1.x, rect2.x);
    const minY = Math.min(rect1.y, rect2.y);
    return maxX - minX < rect1.width + rect2.width && maxY - minY < rect1.height + rect2.height;
  }
  // 重置遮罩层 - 是为了遮罩层可以正好遮住table上
  function resetMask() {
    const start: DomItem = selectDomList.value[0]; // 开始节点
    const end: DomItem = selectDomList.value[selectDomList.value.length - 1]; // 结束节点
    if (start?.DomRect) {
      positionList.start_x = Math.min(start.DomRect.left, end.DomRect.left);
      positionList.start_y = start.DomRect.top;
    }
    if (end?.DomRect) {
      positionList.end_x = Math.max(start.DomRect.right, end.DomRect.right);
      positionList.end_y = end.DomRect.bottom;
    }
    nextTick(() => {
      // 出现这种情况的话就需要进行重新绘制了
      if (end.DomRect.left != start.DomRect.left || start.DomRect.right != end.DomRect.right) {
        handleDomSelect(false);
      }
    });
  }
  //清除
  function resSetXY() {
    positionList.start_x = 0;
    positionList.start_y = 0;
    positionList.end_x = 0;
    positionList.end_y = 0;
    positionList.is_show_mask = false;
    // 清空选中的dom节点
    selectDomList.value = new Array<DomItem>();
    // 清空map数据
    selectDomMap.value.clear();
  }
  // return toRefs(positionList)
  return {
    // ...toRefs(positionList), // 遮罩层 样式
    ...toRefs({
      positionList,
      mask_width, //分别计算遮罩层的位置，大小
      mask_height, //分别计算遮罩层的位置，大小
      mask_left, //分别计算遮罩层的位置，大小
      mask_top, //分别计算遮罩层的位置，大小
    }),
    selectDomList, //被选中的节点属性
    selectDomMap, //被选中的节点map
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resSetXY,
    // handleDomSelect
  };
}
