import { parse, HTMLElement } from "node-html-parser";
import exportHtmlHook from "@/hook/exportHtml";
import {  reactive, ref } from "vue";

import { TdOption } from "@/interface/TdModule"; // 样式表

export default function () {
  let transformTable = ref<TdOption[][]>([]) // 转换完毕的table
  /**
   * FileReader共有4种读取方法：
   * 1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
   * 2.readAsBinaryString(file)：将文件读取为二进制字符串
   * 3.readAsDataURL(file)：将文件读取为Data URL
   * 4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'
   */
  function importf(obj: File) {
    //导入
    // if (!(obj.target as HTMLInputElement).files) {
    //   return;
    // }
    // let fileSelect = (obj.target as any).files[0]; //找到文件上传的元素
    let fileSelect = obj; //找到文件上传的元素

    let reader = new FileReader();
    reader.readAsText(fileSelect, "UTF-8");
    reader.onload = () => {
      if (!reader.result) {
        return;
      }
      if (typeof reader.result !== "string") {
        return;
      }
      const root = parse(reader.result);
      const template = root.querySelector("tbody");
      if (template) {
        transformHtml(template);
      }
    };
  }

  // 表格和表格主体 转换
  // nodeType节点：
  // 1	Element
  // 2	Attribute
  // 3	Text
  function transformHtml(template: HTMLElement) {
    let result: any[][] = []; // 最终结果
    template.childNodes.forEach((item) => {
      if (item.nodeType === 1) {
        result.push(transformTr(item as HTMLElement));
      }
    });
    transformTable.value = result
    console.log(transformTable.value)
  }
  function transformTr(template: HTMLElement) {
    let result: any[] = []; // 最终结果
    template.childNodes.forEach((item) => {
      if (item.nodeType === 1) {
        result.push(transformTd(item as HTMLElement));
      }
    });
    return result;
  }
  function transformTd(template: HTMLElement) {
    let Dom = new TdOption();
    const { colspan, rowspan, id, style } = template.attributes;
    Dom.setRawAttrs({ colspan: Number(colspan), rowspan: Number(rowspan), id });
    Dom.value = template.innerHTML;
    Dom.style = parseCSSText(style)
    return Dom;
  }
  // css 转 json 对象
  function parseCSSText(cssText: string) {
    const cssTxtFomate = cssText.replace(/\/\*(.|\s)*?\*\//g, " ").replace(/\s+/g, " ");
    const style = reactive<any>({})
    const cssToJs = (s: string) => s.replace(/\W+\w/g, (match) => match.slice(-1).toUpperCase());
    const properties = cssTxtFomate.split(";").map((css) => css.split(":").map((x) => x && x.trim()));
    for (let [property, value] of properties) {
      if(property){
        style[cssToJs(property)] = value
      }
    };
    return style;
  }
  return {
    importf,
    transformTable
  };
}
