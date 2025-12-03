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
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body>${html}</body>
      </html>`,
      { waitUntil: "networkidle0" }
    );

    // 生成 PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
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
