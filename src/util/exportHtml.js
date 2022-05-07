import prettierCode from './prettierCode'


function getHtml(code) {
  let template = code;
  template = template.replaceAll(/\<!--(.*?)-->/g, ""); // 去除注释
  template = template.replaceAll(/data-(.*?)=""/g, ""); // 去除 data-数据
  let html = 
  `<!DOCTYPE html>
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
  const formatText = prettierCode(html)
  return formatText;
}
export default getHtml

