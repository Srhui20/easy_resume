import { type NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";

export async function getBrowser() {
  const isVercel = !!process.env.VERCEL; // Vercel 内置环境变量
  const isLinuxServer = process.platform === "linux" && !isVercel;

  if (isVercel) {
    // 运行在 Vercel（Serverless）
    return puppeteerCore.launch({
      args: chromium.args,
      // defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      // headless: chromium.headless,
    });
  }

  if (isLinuxServer) {
    // 运行在 Linux 服务器（比如宝塔、ECS）
    return puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  // 本地开发
  return puppeteer.launch({
    headless: true,
    args: [],
  });
}

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json({ code: 400, message: "html 不能为空" });
    }

    const browser = await getBrowser();
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
