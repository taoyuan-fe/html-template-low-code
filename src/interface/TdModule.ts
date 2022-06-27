
export class TdOption {
  colSpan = 1;
  rowSpan = 1;
  show: Boolean = true;
  value: boolean | number | string = "";
  id: string | undefined = undefined;
  // 每一个单元格的样式
  style = {
    textAlign: "center" as "center", // 字体方向
    color: "rgba(0, 0, 0, 1)", // 字体颜色
    fontSize: "16px",
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: "150px",
    height: "40px",
    fontWeight: "normal" as "normal",
  };
  constructor(id?: string) {
    if (id) {
      this.id = id;
    }
  }
  // 重置Id
  resetId(id: string) {
    this.id = id;
  }
  setRawAttrs(rawAttrs: { colspan: number; rowspan: number; id: string }) {
    this.colSpan = rawAttrs.colspan;
    this.rowSpan = rawAttrs.rowspan;
    this.id = rawAttrs.id;
  }
}

export interface ColgroupModule {
  width: string;
}
