import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json({ code: 400, message: "html 不能为空" });
    }

    // 启动 Puppeteer
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Linux 部署推荐
    });
    const page = await browser.newPage();

    // 设置页面内容
    await page.setContent(
      `<html>
        <head>
          <style>
          ul,
          ol {
            padding-left: 20px;
            margin: 0;
            font-size: 14px;
            line-height: 1.6;
            list-style-position: outside;
          }
          ul {
            list-style-type: disc;
          }

          ol {
            list-style-type: decimal;
          }
          </style>
        </head>
        <body>${html}</body>
      </html>`,
      { waitUntil: "networkidle0" },
    );

    await page.setViewport({
      deviceScaleFactor: 1,
      height: 1123,
      width: 794, // A4 width px
    });

    await page.addScriptTag({
      path: path.join(process.cwd(), "/public/tailwind-browser.js"),
    });

    // 生成 PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        bottom: "40px",
        left: "40px",
        right: "40px",
        top: "40px",
      },
      printBackground: true,
    });

    await browser.close();

    // 返回 PDF（浏览器直接下载）
    const uint8 = new Uint8Array(pdfBuffer);
    return new Response(uint8, {
      headers: {
        "Content-Disposition": 'attachment; filename="document.pdf"',
        "Content-Type": "application/pdf",
      },
      status: 200,
    });
  } catch {
    // 错误信息可在上层进程记录，Handler 只返回 500
    return NextResponse.json({ code: 500, message: "服务端错误" });
  }
}
