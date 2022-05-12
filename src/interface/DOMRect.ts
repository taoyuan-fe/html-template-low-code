export interface DOMRect {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
}
//  选中节点的 Dom 元素Id + DOMRect
export class DomItem {
  DomRect: DOMRect
  row: number
  column: number
  constructor(DomRect: DOMRect, id: string) {
    let indexList = id.split('-')
    this.row = Number(indexList[0])
    this.column = Number(indexList[1])
    this.DomRect = DomRect
  }
}