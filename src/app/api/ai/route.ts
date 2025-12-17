import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { checkIpLimit } from "@/lib/redis/rateLimit";

// const DEEPSEEK_API_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const systemPrompt = `
      输入数据是一个对象数组，主要包含两种类型元素：
      段落/模块 (type: 'paragraph')**: 包含 titleInfo.label(段落标题，如"工作经验") 和 paragraphArr (具体项目数组)。
      paragraphArr数组中的每个项目代表一项经验或成就，其关键字段包括：
      name: 主体名称（如公司名、项目名）。
      position: 担任的职位或角色。
      startTime和endTime: 时间范围。
      label: 段落的具体描述内容。
      从以下几个方面进行详细点评：
      1. 格式和排版（清晰度，专业性）。
      2. 个人亮点和成就。
      3. 经验描述。
      4. 改进建议（提供具体、可操作的修改建议）。
      5. 给出具体的改正后的文本。
      不需要点评页面上的style及className,点评实际显示效果即可，
      输出文本要多加入小图标，
      请使用中文，并以 Markdown 格式清晰地输出结果，markdown格式一定要正确，
      输出的markdown不能超过550px(最重要)
    `;

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const limitObj = await checkIpLimit(ip, 5);
  if (!limitObj.isUseable) {
    return NextResponse.json(
      {
        code: 500,
        message: "一天只可用5次，明日再使用该功能吧~",
      },
      { status: 500 },
    );
  }

  if (!DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { code: 500, message: "No Key!" },
      { status: 500 },
    );
  }

  const { dataString } = await req.json();

  // 3. 调用 DeepSeek API

  const completion = await openai.chat.completions.create({
    messages: [
      {
        content: systemPrompt,
        role: "system",
      },
      {
        content: dataString,
        role: "user",
      },
    ],
    model: "deepseek-chat", // 使用 DeepSeek 的聊天模型
    stream: true, // 暂不使用流式传输，简化处理
  });

  return new Response(completion.toReadableStream(), {
    headers: {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
    },
  });
}

function getClientIP(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
