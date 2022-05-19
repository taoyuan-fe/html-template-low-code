// 每一个单元格的样式
export class TdStyleModule  {
  'text-align' = "center" as "center"; // 字体方向
  color: string = "rgba(0, 0, 0, 1)"; // 字体颜色
  'font-size': string = "16px";
  'background-color': string = "rgba(255, 255, 255, 1)";
  width: string = "150px";
  height: string = "40px";
  'font-weight'  = 'normal' as "normal";
}

export class TdOption {
  colSpan = 1;
  rowSpan = 1;
  show: Boolean = true;
  value: boolean | number | string = "";
  id: string | undefined = undefined;
  style: TdStyleModule = new TdStyleModule();
  constructor(id?:string) {
    if (id) {
      this.id = id;
    }
  }
  // 重置Id
  resetId(id: string) {
    this.id = id;
  }
  setRawAttrs(rawAttrs: { colspan: number, rowspan: number, id: string}) {
    this.colSpan = rawAttrs.colspan
    this.rowSpan = rawAttrs.rowspan
    this.id = rawAttrs.id
  }
}

export interface ColgroupModule {
  width: string;
}
