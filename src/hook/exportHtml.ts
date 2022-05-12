import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";

export default function () {
  // 格式化代码
  const prettierCode = (code: string) => {
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

  const getHtml = (code: string) => {
    let template = code;
    template = template.replaceAll(/\<!--(.*?)-->/g, ""); // 去除注释
    template = template.replaceAll(/data-(.*?)=""/g, ""); // 去除 data-数据
    template = template.replaceAll(/row-active/g, ""); // 去除 data-数据
    template = template.replaceAll(/table-focus/g, ""); // 去除 data-数据
    let html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible"
          content="IE=edge" />
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0" />
    <title>对账信息单</title>
    <style>
      @page {
        size: A4;
      }
  
      body {
        padding: 5px;
      }
    </style>
  </head>
    <body style="font-family: SimSun;">
      <div style="margin-top: 30px">${template}</div>
    </body>
  </html>`;
    const formatText = prettierCode(html);
    return formatText;
  }
  return {
    prettierCode,
    getHtml
  };
}
