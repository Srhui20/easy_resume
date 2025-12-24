import { LoadingOutlined } from "@ant-design/icons";
import { useMount } from "ahooks";
import { Button, Modal, message, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { usePublicStore } from "@/lib/store/public";

interface AiMessageProps {
  dialogOpen: boolean;
  onCancel: () => void;
}

export default function AiMessageDialog({
  dialogOpen,
  onCancel,
}: AiMessageProps) {
  const resumeData = usePublicStore.getState().resumeData;

  const [isAiMessaging, setIsMessaging] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [aiMessages, setAiMessages] = useState("");
  const mdContainerRef = useRef<HTMLDivElement>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  useMount(() => {
    const local = localStorage.getItem("ai");
    if (local) {
      setAiMessages(local);
    }
  });

  const getAiEvaluate = async () => {
    if (isAiMessaging) return message.warning("内容生成中，请稍后~");
    abortRef.current?.abort();
    setLoading(true);
    try {
      const controller = new AbortController();
      abortRef.current = controller;
      setIsMessaging(true);
      const res = await fetch("/api/ai", {
        body: JSON.stringify({
          dataString: JSON.stringify(
            resumeData
              .filter((item) => item.type !== "baseInfo")
              .map((item) => {
                return {
                  ...item,
                  ref: null,
                };
              }),
          ),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: controller.signal,
      });
      setLoading(false);

      const contentType = res.headers.get("content-type") || "";

      // 👇 1️⃣ 先处理错误
      if (!res.ok) {
        const errorData = await res.json();
        return message.error(errorData.message);
      }

      if (!contentType.includes("text/event-stream")) return;
      const reader = res.body?.getReader();
      if (!reader) return;

      setAiMessages("");
      const decoder = new TextDecoder();
      let buffer = ""; // 添加缓冲区

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk; // 追加到缓冲区

        const lines = buffer.split("\n");
        // 保留最后一条可能不完整的行
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line) continue;
          try {
            const data = JSON.parse(line);
            data?.choices?.forEach((item: { delta: { content: string } }) => {
              setAiMessages(
                (prevMessages) => prevMessages + (item?.delta?.content ?? ""),
              );
            });
          } catch (e) {
            // biome-ignore lint/suspicious/noConsole: <explanation>
            console.error("ai error", e);
          }
        }

        requestAnimationFrame(() => {
          const el = mdContainerRef.current;
          if (el) {
            el.scrollTop = el.scrollHeight;
          } else {
            bottomRef.current?.scrollIntoView({ behavior: "auto" });
          }
        });
      }

      // 处理最后剩余的缓冲数据
      if (buffer) {
        try {
          const data = JSON.parse(buffer);
          data?.choices?.forEach((item: { delta: { content: string } }) => {
            setAiMessages(
              (prevMessages) => prevMessages + (item?.delta?.content ?? ""),
            );
          });
        } catch {}
      }
      // 请求完全结束后，做一次平滑滚动并结束流式状态与光标显示
      requestAnimationFrame(() => {
        const el = mdContainerRef.current;
        if (el) {
          // 平滑滚动到尾部作为结束动画
          el.scrollTo({ behavior: "smooth", top: el.scrollHeight });
        } else {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      });
    } catch (e) {
      setLoading(false);
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error("ai error", e);
    } finally {
      setIsMessaging(false);
    }
  };

  useEffect(() => {
    if (!aiMessages) return;
    localStorage.setItem("ai", aiMessages);
  }, [aiMessages]);

  const footer: React.ReactNode = (
    <>
      <Button
        onClick={onCancel}
        styles={{
          root: {
            backgroundColor: "#fff",
            borderColor: "#ccc",
            color: "#171717",
          },
        }}
      >
        关闭
      </Button>
      <Button
        disabled={isAiMessaging}
        onClick={() => getAiEvaluate()}
        styles={{ root: { backgroundColor: "#171717", color: "#fff" } }}
        type="primary"
      >
        开始点评
      </Button>
    </>
  );
  return (
    <Modal
      centered={true}
      footer={footer}
      onCancel={onCancel}
      open={dialogOpen}
      title="ai点评"
      width={700}
    >
      <Spin
        fullscreen
        indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />}
        spinning={isLoading}
        tip="请稍等~"
      />
      <div className="mb-[10px] text-gray-400">
        已自动过滤基础文本信息，一台设备一天可测评五次!
      </div>
      <div className="markdown-box h-[400px] overflow-auto bg-white">
        <Markdown rehypePlugins={[rehypeRaw]}>{aiMessages}</Markdown>
        <div ref={bottomRef} />
      </div>
    </Modal>
  );
}
