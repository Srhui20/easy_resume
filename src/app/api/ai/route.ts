import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// const DEEPSEEK_API_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const systemPrompt = `
      输入数据是一个对象数组，主要包含两种类型元素：
      普通文本 (type: 'label')**: 包含 pageLabel (文本内容) 和className(样式信息，需忽略)。
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
      不需要点评页面上的style及className,点评实际显示效果即可。
      输出文本要多加入小图标，
      请使用中文，并以 Markdown 格式清晰地输出结果，
      输出的markdown不能超过550px(最重要)
    `;

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function POST(req: NextRequest) {
  if (!DEEPSEEK_API_KEY) {
    return NextResponse.json({ code: 500, message: "No Key!" });
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
