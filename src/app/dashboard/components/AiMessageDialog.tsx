import { useMount } from "ahooks";
import { Button, Modal } from "antd";
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

  const [aiMessages, setAiMessages] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useMount(() => {
    const local = localStorage.getItem("ai");
    if (local) {
      setAiMessages(local);
    }
  });

  const getAiEvaluate = async () => {
    try {
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
      });
      const reader = res.body?.getReader();
      if (!reader) return;

      setAiMessages("");
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line) continue;
          const data = JSON.parse(line || "{}");
          data?.choices?.forEach((item: { delta: { content: string } }) => {
            setAiMessages(
              (prevMessages) => prevMessages + (item?.delta?.content ?? ""),
            );
          });
        }
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (e) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error("ai error", e);
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
        onClick={() => getAiEvaluate()}
        styles={{ root: { backgroundColor: "#171717" } }}
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
      <div className="mb-[10px] text-gray-400">
        已自动过滤基础文本信息，仅点评段落信息
      </div>
      <div className="markdown-box h-[400px] overflow-auto bg-white">
        <Markdown rehypePlugins={[rehypeRaw]}>{aiMessages}</Markdown>
        <div ref={bottomRef} />
      </div>
    </Modal>
  );
}
