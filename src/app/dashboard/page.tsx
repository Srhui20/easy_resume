"use client";

import {
  DownloadOutlined,
  ExportOutlined,
  FileAddOutlined,
  FileExcelOutlined,
  ImportOutlined,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Button, message, Tooltip } from "antd";
import LeftInfo from "./components/LeftInfo";
import MainContainer from "./components/MainContainer";
import RightInfo from "./components/RightInfo";

interface BtnType {
  key: string;
  type: "default" | "primary" | "dashed" | "text" | "link";
  icon: React.ReactNode;
  label: string;
  handleFunc: () => void;
  isTip: boolean;
}
export default function Dashboard() {
  const [messageApi] = message.useMessage();
  const btnList: BtnType[] = [
    {
      handleFunc: () => {},
      icon: <SaveOutlined />,
      isTip: true,
      key: "save",
      label: "保存",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <UndoOutlined />,
      isTip: true,
      key: "undo",
      label: "撤销",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <RedoOutlined />,
      isTip: true,
      key: "redo",
      label: "重做",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <FileAddOutlined />,
      isTip: true,
      key: "add",
      label: "加一页",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <FileExcelOutlined />,
      isTip: true,
      key: "delete",
      label: "删掉最后一页",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <ImportOutlined />,
      isTip: true,
      key: "import",
      label: "导入文件 ",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <ExportOutlined />,
      isTip: true,
      key: "export",
      label: "导出文件",
      type: "default",
    },

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
    const html = document.getElementById("print-container")?.innerHTML;

    const res = await fetch("/api/pdf", {
      body: JSON.stringify({
        html: `${html}`,
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
        <div className="font-bold" onClick={() => handleDownload()}>
          EASY_RESUME
        </div>
        <div className="flex gap-3">
          {btnList.map((btn) => (
            <div key={btn.key}>
              {!btn.isTip ? (
                <Button
                  icon={btn.icon}
                  onClick={() => btn.handleFunc()}
                  type={btn.type}
                >
                  {btn.label}
                </Button>
              ) : (
                <Tooltip placement="top" title={btn.label}>
                  <Button
                    icon={btn.icon}
                    onClick={() => btn.handleFunc()}
                    type={btn.type}
                  />
                </Tooltip>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="w-100 border-gray-300 border-r">
          <LeftInfo />
        </div>
        <div className="min-w-0 flex-1">
          <MainContainer />
        </div>
        <div className="w-100 border-gray-300 border-l">
          <RightInfo />
        </div>
      </div>
    </div>
  );
}
