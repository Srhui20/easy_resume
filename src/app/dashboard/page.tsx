"use client";

import { DownloadOutlined } from "@ant-design/icons";
import { Button, message, Splitter } from "antd";
import { useEffect } from "react";
import { usePublicStore } from "@/lib/store/public";
import type { OperationBtnType } from "@/types/resume";
import MainContainer from "./components/MainContainer";
import RightInfo from "./components/RightInfo";

export default function Dashboard() {
  const [messageApi] = message.useMessage();

  const resumeData = usePublicStore((state) => state.resumeData);

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

  const handleDownload = async () => {
    const html = document.getElementById("print-container");
    const cloneHtml = html?.cloneNode(true) as HTMLElement;
    const bgInClone = cloneHtml.querySelector("#print-page-bg");
    if (bgInClone) bgInClone.remove();

    const res = await fetch("/api/pdf", {
      body: JSON.stringify({
        html: `${cloneHtml.innerHTML}`,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!res.ok)
      return messageApi.open({
        content: "This is an error message",
        type: "error",
      });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "document.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-15 items-center justify-between border-gray-300 border-b pr-4 pl-4">
        <div className="font-bold">EASY_RESUME</div>
        <div className="flex gap-3">
          {btnList.map((btn) => (
            <Button
              icon={btn.icon}
              key={btn.key}
              onClick={() => btn.handleFunc()}
              type={btn.type}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <Splitter
          style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", height: "100%" }}
        >
          <Splitter.Panel defaultSize="70%" max="70%" min="50%">
            <MainContainer />
          </Splitter.Panel>
          <Splitter.Panel>
            <RightInfo />
          </Splitter.Panel>
        </Splitter>
      </div>
    </div>
  );
}
