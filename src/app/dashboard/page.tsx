"use client";

import {
  DownloadOutlined,
  GithubOutlined,
  LoadingOutlined,
  OpenAIOutlined,
} from "@ant-design/icons";
import { useMount } from "ahooks";
import {
  Button,
  FloatButton,
  Modal,
  message,
  Spin,
  Splitter,
  Tooltip,
} from "antd";
import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import { usePublicStore } from "@/lib/store/public";
import type { OperationBtnType } from "@/types/resume";
import MainContainer from "./components/MainContainer";
import RightInfo from "./components/RightInfo";

export default function Dashboard() {
  const [messageApi, contextHolder] = message.useMessage();
  const [aiMessages, setAiMessages] = useState("");
  const resumeData = usePublicStore((state) => state.resumeData);

  const bottomRef = useRef<HTMLDivElement>(null);

  useMount(() => {
    const local = localStorage.getItem("ai");
    if (local) {
      setAiMessages(local);
    }
  });
  useEffect(() => {
    localStorage.setItem(
      "resumeData",
      JSON.stringify(
        resumeData.map((item) => {
          return {
            ...item,
            ref: null,
          };
        }),
      ),
    );
  }, [resumeData]);

  const btnList: OperationBtnType[] = [
    {
      handleFunc: () => handleDownload(),
      icon: <DownloadOutlined />,
      isTip: false,
      key: "download",
      label: "下载为pdf",
      type: "primary",
    },
  ];

  // const [html] = useState("<h1 style='color:red;'>Hello PDF</h1>");
  const [spinning, setSpinning] = useState(false);
  const handleDownload = async () => {
    const html = document.getElementById("print-container");
    const cloneHtml = html?.cloneNode(true) as HTMLElement;
    const bgInClone = cloneHtml.querySelector("#print-page-bg");
    if (bgInClone) bgInClone.remove();
    try {
      setSpinning(true);
      const res = await fetch("/api/pdf", {
        body: JSON.stringify({
          html: `${cloneHtml.innerHTML}`,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!res.ok)
        return messageApi.open({
          content: "下载出错，请稍后重试~",
          type: "error",
        });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      messageApi.error("下载出错，请稍后再试~");
    } finally {
      setSpinning(false);
    }
  };

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

      localStorage.setItem("ai", aiMessages);
    } catch (e) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error("ai error", e);
    }
  };

  useEffect(() => {
    if (!aiMessages) return;
    localStorage.setItem("ai", aiMessages);
  }, [aiMessages]);

  const [modalOpen, setOpen] = useState(false);
  const openAiDialog = () => {
    setOpen(true);
  };

  const footer: React.ReactNode = (
    <>
      <Button
        onClick={() => setOpen(false)}
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
    <>
      <Spin
        fullscreen
        indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />}
        spinning={spinning}
        tip="下载中~"
      />
      <Modal
        centered={true}
        footer={footer}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        open={modalOpen}
        title="ai点评"
        width={700}
      >
        <div className="mb-[10px] text-gray-400">
          已自动过滤基础文本信息，仅显示关键点评
        </div>
        <div className="h-[400px] overflow-auto bg-white">
          <div
            dangerouslySetInnerHTML={{
              __html: marked(aiMessages),
            }}
          />
          <div ref={bottomRef} />
        </div>
      </Modal>
      <div className="flex h-screen flex-col">
        {contextHolder}
        <div className="flex h-15 items-center justify-between border-gray-300 border-b pr-8 pl-8">
          <div className="font-bold">EASY_RESUME</div>
          <div className="flex gap-3">
            {btnList.map((btn) => (
              <Button
                icon={btn.icon}
                key={btn.key}
                onClick={() => btn.handleFunc()}
                style={{ background: "#171717" }}
                type={btn.type}
              >
                {btn.label}
              </Button>
            ))}
            <Tooltip title="Github">
              <Button
                href="https://github.com/Srhui20/easy_resume"
                icon={<GithubOutlined />}
                style={{ fontSize: "24px" }}
                type="text"
              />
            </Tooltip>
          </div>
        </div>
        <div className="flex min-h-0 flex-1">
          <Splitter
            style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", height: "100%" }}
          >
            <Splitter.Panel defaultSize="70%" max="70%" min="50%">
              <MainContainer />
            </Splitter.Panel>
            <Splitter.Panel defaultSize="30%">
              <RightInfo />
            </Splitter.Panel>
          </Splitter>
        </div>
        <FloatButton
          icon={<OpenAIOutlined />}
          onClick={() => openAiDialog()}
          style={{ background: "#171717" }}
          tooltip="ai点评"
          type="primary"
        />
      </div>
    </>
  );
}
