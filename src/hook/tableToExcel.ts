import { saveAs } from 'file-saver';
import { write, utils } from "xlsx";

export default function () {
  // 导出excel
  function exportExcel(Dom: any) {
    let et = utils.table_to_book(
      Dom
  ); //此处传入table的DOM节点
  let etout = write(et, {
      bookType: "xlsx",
      bookSST: true,
      type: "array"
  });
  try {
      saveAs(
          new Blob([etout], {
              type: "application/octet-stream"
          }),
          "自定义表格.xlsx"
      ); //trade-publish.xlsx 为导出的文件名
  } catch (e) {
      console.log(e, etout);
  }
  return etout;
  }
  return {
    exportExcel,
  };
}
