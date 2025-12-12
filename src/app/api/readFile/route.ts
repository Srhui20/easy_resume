import fs from "node:fs";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json({ code: 500, message: "fileName 不能为空" });
    }

    const filePath = path.join(process.cwd(), fileName);
    const fileText = fs.readFileSync(filePath, "utf8");

    return NextResponse.json({ code: 200, data: fileText });
  } catch {}
}
