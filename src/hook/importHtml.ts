import { read, WorkBook, utils } from "xlsx";
import exportHtmlHook from "@/hook/exportHtml";

export default function () {
  const { prettierCode } = exportHtmlHook()
  /**
   * FileReader共有4种读取方法：
   * 1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
   * 2.readAsBinaryString(file)：将文件读取为二进制字符串
   * 3.readAsDataURL(file)：将文件读取为Data URL
   * 4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'
   */
  function importf(obj: Event) {
    console.log(obj);
    //导入
    if (!(obj.target as HTMLInputElement).files) {
      return;
    }
    let fileSelect = (obj.target as any).files[0]; //找到文件上传的元素
    let reader = new FileReader();
    console.log(fileSelect);
    reader.readAsText(fileSelect, 'UTF-8');
    console.log(reader)
    reader.onload = function () {
      console.log("success");
      console.log(reader.result)
    };
  }

  return {
    importf,
  };
}
