import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import { ColorPicker, Input, InputNumber, Tabs, Tooltip } from "antd";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { usePublicStore } from "@/lib/store/public";
import type { PAGE_ATTRIBUTE } from "@/types/resume";

export default function ResumeParagraphStyle() {
  const MyEditor = dynamic(() => import("./MyEditor"), { ssr: false });

  const { resumeData, pageId, attributeIndex } = usePublicStore();
  const currentNode: PAGE_ATTRIBUTE | null = useMemo(() => {
    if (!pageId) return null;
    return (
      resumeData.find((item) => item.page === pageId)?.pageAttributes[
        attributeIndex
      ] ?? null
    );
  }, [pageId, attributeIndex, resumeData]);

  const [activeKey, setActiveKey] = useState("text");

  const fontStylesList = [
    {
      handlerFun: () => {},
      icon: <BoldOutlined />,
      isChoose: true,
      key: "blod",
      label: "加粗",
    },
    {
      handlerFun: () => {},
      icon: <ItalicOutlined />,
      isChoose: false,
      key: "italics",
      label: "斜体",
    },
    {
      handlerFun: () => {},
      icon: <UnderlineOutlined />,
      isChoose: false,
      key: "underline",
      label: "下划线",
    },
  ];

  return (
    <div className="flex flex-col">
      <Tabs
        centered
        defaultActiveKey={activeKey}
        items={[
          { children: "", key: "text", label: "文本" },
          { children: "", key: "title", label: "标题" },
        ]}
        onTabClick={(v) => setActiveKey(v)}
        styles={{
          item: { justifyContent: "center", width: "80px" },
        }}
      />
      {activeKey === "title" ? (
        <div>
          {/* 文本 */}
          <div className="mb-[20px] flex flex-col">
            <div className="mb-[10px] text-gray-600">文本</div>
            <Input
              size="large"
              style={{ fontSize: "16px", height: "50px" }}
              value={currentNode?.title}
            />
          </div>
          {/* 字体大小和颜色 */}
          <div className="mb-[20px] flex w-full justify-between gap-[80px]">
            <div className="flex flex-1 flex-col">
              <div className="mb-[10px] text-gray-600">大小</div>
              <div className="flex w-full justify-center">
                <InputNumber
                  className="flex-1"
                  size="large"
                  style={{ fontSize: "16px", height: "50px", width: "100%" }}
                  suffix="PX"
                  value={12}
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="mb-[10px] text-gray-600">颜色</div>
              <ColorPicker
                defaultValue="#1677ff"
                showText
                style={{
                  alignItems: "center",
                  fontSize: "16px",
                  height: "50px",
                  justifyContent: "start",
                  paddingLeft: "20px",
                  width: "100%",
                }}
              />
            </div>
          </div>
          {/* 背景色和下边框颜色 */}
          <div className="mb-[20px] flex w-full justify-between gap-[80px]">
            <div className="flex flex-1 flex-col">
              <div className="mb-[10px] text-gray-600">背景色</div>
              <div className="flex w-full justify-center">
                <ColorPicker
                  defaultValue="#1677ff"
                  showText
                  style={{
                    alignItems: "center",
                    fontSize: "16px",
                    height: "50px",
                    justifyContent: "start",
                    paddingLeft: "20px",
                    width: "100%",
                  }}
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="mb-[10px] text-gray-600">下边框颜色</div>
              <ColorPicker
                defaultValue="#1677ff"
                showText
                style={{
                  alignItems: "center",
                  fontSize: "16px",
                  height: "50px",
                  justifyContent: "start",
                  paddingLeft: "20px",
                  width: "100%",
                }}
              />
            </div>
          </div>
          {/* 样式 */}
          <div className="flex h-[50px] items-center justify-between">
            <div className="flex-1 text-gray-600">样式</div>
            <div className="flex h-full justify-center gap-[4px] rounded-lg bg-gray-100 p-[3px] pr-[8px] pl-[8px]">
              {fontStylesList.map((item) => (
                <Tooltip key={item.key} title={item.label}>
                  <div
                    className={`flex w-[36px] cursor-pointer items-center justify-center rounded-lg ${item.isChoose ? "bg-blue-200 text-blue-500" : "hover:bg-gray-300"}`}
                  >
                    {item.icon}
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <MyEditor onChange={(val) => {}} value={currentNode?.pageLabel ?? ""} />
      )}
    </div>
  );
}
