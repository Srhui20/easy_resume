import { useMount } from "ahooks";
import { message } from "antd";
import { useState } from "react";
import Markdown from "react-markdown";
export default function Notice() {
  const [messageApi] = message.useMessage();
  const getReadNotice = async () => {
    try {
      const res = await fetch("/api/readFile?fileName=README.md", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      // 4. 解析 JSON 响应体
      const result = await res.json();

      // 5. 根据你的业务 code 字段判断是否成功
      if (result.code === 200) {
        // 返回文件内容字符串
        setPageValue(result.data);
      } else {
        // 路由中定义的业务错误信息
        throw new Error(result.message || "获取文件内容失败");
      }
    } catch {
      messageApi.error("获取失败，请稍后重试~");
    }
  };

  useMount(() => {
    getReadNotice();
  });

  const [pageValue, setPageValue] = useState("");

  return <Markdown>{pageValue}</Markdown>;
}
