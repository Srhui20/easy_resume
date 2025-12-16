"use client";

import {
  DesktopOutlined,
  DownloadOutlined,
  GithubOutlined,
  LoadingOutlined,
  OpenAIOutlined,
  SketchOutlined,
} from "@ant-design/icons";
import { Button, message, Spin, Splitter, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useTypesetting } from "@/lib/hooks/useTypesetting";
import { usePrintStore } from "@/lib/store/print";
import { usePublicStore } from "@/lib/store/public";
import type { OperationBtnType } from "@/types/resume";
import AiMessageDialog from "./components/AiMessageDialog";
import { ChooseTheme } from "./components/ChooseTheme";
import MainContainer from "./components/MainContainer";
import RightInfo from "./components/RightInfo";
import SystemDilaog from "./components/SystemDialog";

export default function Dashboard() {
  const [messageApi, contextHolder] = message.useMessage();
  const resumeData = usePublicStore((state) => state.resumeData);
  const clearChoose = usePublicStore((state) => state.clearChoose);

  const { setPrintData, setRsData } = useTypesetting();
  const printResumeData = usePrintStore((state) => state.printResumeData);
  const setPrintResumeData = usePrintStore((state) => state.setPrintResumeData);

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

  useEffect(() => {
    if (!printResumeData.length) return;
    setRsData();
  }, [printResumeData, setRsData]);

  const btnList: OperationBtnType[] = [
    {
      handleFunc: () => handleDownload(),
      isTip: false,
      key: "download",
      label: "下载为pdf",
      style: {
        backgroundColor: "#171717",
      },
      type: "primary",
    },
    {
      handleFunc: () => setThemeOpen(true),
      isTip: false,
      key: "theme",
      label: "主题",
      style: {
        color: "#171717",
      },
      type: "link",
    },
    {
      handleFunc: () => setAiMessageOpen(true),
      isTip: false,
      key: "ai",
      label: "ai点评",
      style: {
        color: "#171717",
      },
      type: "link",
    },
    {
      handleFunc: () => setSystemDialogOpen(true),
      isTip: false,
      key: "system",
      label: "系统",
      style: {
        color: "#171717",
      },
      type: "link",
    },
  ];

  const iconMap: { [key: string]: React.ReactNode } = {
    ai: <OpenAIOutlined />,
    download: <DownloadOutlined />,
    system: <DesktopOutlined />,
    theme: <SketchOutlined />,
  };

  // const [html] = useState("<h1 style='color:red;'>Hello PDF</h1>");
  const [spinning, setSpinning] = useState(false);
  const handleDownload = async () => {
    // 先将文件转成static
    clearChoose();
    setPrintData();

    requestAnimationFrame(async () => {
      // 第二次 rAF: 等待浏览器完成重绘

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
        setPrintResumeData([]);
      }
    });
  };

  const [systemDialogOpen, setSystemDialogOpen] = useState(false);
  const [aiMessageOpen, setAiMessageOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  return (
    <>
      <Spin
        fullscreen
        indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />}
        spinning={spinning}
        tip="下载中~"
      />
      {/* 系统弹框 */}
      {systemDialogOpen && (
        <SystemDilaog
          dialogOpen={systemDialogOpen}
          onCancel={() => setSystemDialogOpen(false)}
        />
      )}
      {/* ai弹框 */}
      {aiMessageOpen && (
        <AiMessageDialog
          dialogOpen={aiMessageOpen}
          onCancel={() => setAiMessageOpen(false)}
        />
      )}
      {themeOpen && (
        <ChooseTheme
          dialogOpen={themeOpen}
          onCancel={() => setThemeOpen(false)}
        />
      )}
      <div className="flex h-screen flex-col">
        {contextHolder}
        <div className="flex h-15 items-center justify-between border-gray-300 border-b pr-8 pl-8">
          <div className="font-bold">EASY_RESUME</div>
          <div className="flex gap-3">
            {btnList.map((btn) => (
              <Button
                icon={iconMap[btn.key]}
                key={btn.key}
                onClick={() => btn.handleFunc()}
                style={btn.style}
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
      </div>
    </>
  );
}
