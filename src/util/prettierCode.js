
import prettier from "prettier/standalone";
import parserHtml  from "prettier/parser-html";
// 格式化代码
function prettierCode(code) {
  try {
    // 参数1：代码字符串，参数2：格式化配置
    return prettier.format(code, {
      // 使用html格式
      parser: "html",
      // 使用引入的插件parserHtml格式化
      plugins: [parserHtml],
      // 允许vue脚本
      vueIndentScriptAndStyle: true,
    });
  } catch (error) {
    // 如果格式化失败,返回源码
    return code;
  }
}

export default prettierCode