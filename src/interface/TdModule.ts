
export class TdOption {
  colSpan = 1;
  rowSpan = 1;
  show: Boolean = true;
  value: boolean | number | string = "";
  id: string | undefined = undefined;
  row:  number | undefined = undefined;
  column:  number | undefined = undefined; // 每一个单元格的样式
  style = {
    textAlign: "center" as "center", // 字体方向
    color: "rgba(0, 0, 0, 1)", // 字体颜色
    fontSize: "16px",
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: "150px",
    height: "40px",
    fontWeight: "normal" as "normal",
  };
  constructor(row?:number, column?: number) {
    if(!isNull(row)){
      this.row = row
    }
    if(!isNull(column)){
      this.column = column
    }
    if (!isNull(row) && !isNull(column)) {
      this.id = `${row}-${column}`;
    }
  }
  // 重置Id
  resetId(row:number, column: number) {
    this.row = row
    this.column = column
    this.id = `${row}-${column}`;
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
// true 空
// false 非空
function isNull(value: any): Boolean {
  if(typeof value === 'string'){
    return !value
  }else if(typeof value === 'number'){
    return false
  }else if(typeof value === 'undefined') {
    return true
  }else if(typeof value === 'boolean') {
    return false
  }else if(value instanceof Object) {
    return !Object.keys(value).length
  }else if(value instanceof Array) {
    return !value.length
  }else {
    return false
  }
}