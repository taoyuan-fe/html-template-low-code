// 每一个单元格的样式
export class TdStyleModule  {
  textAlign = "center" as "center"; // 字体方向
  color: string = "rgba(0, 0, 0, 1)"; // 字体颜色
  fontSize: string = "16px";
  backgroundColor: string = "rgba(255, 255, 255, 1)";
  width: string = "150px";
  height: string = "40px";
  fontWeight  = 'normal' as "normal";
}

export class TdOption extends TdStyleModule {
  colSpan = 1;
  rowSpan = 1;
  show: Boolean = true;
  value: boolean | number | string = "";
  id: string | undefined = undefined;
  style: TdStyleModule = new TdStyleModule();
  constructor(index?: number, columnIndex?: number) {
    super();
    if (index !== undefined && columnIndex !== undefined) {
      this.id = `${index}-${columnIndex}`;
    }
  }
  // 重置Id
  resetId(index: number, columnIndex: number) {
    this.id = `${index}-${columnIndex}`;
  }
}

export interface ColgroupModule {
  width: string;
}
