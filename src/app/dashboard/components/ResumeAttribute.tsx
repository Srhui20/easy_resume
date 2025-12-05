import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import { ColorPicker, Input, InputNumber, Tooltip } from "antd";
import { useMemo } from "react";
import { usePublicStore } from "@/lib/store/public";
import type { PAGE_ATTRIBUTE } from "@/types/resume";

export default function ResumeAttribute() {
  const { resumeData, pageId, attributeIndex } = usePublicStore();
  const currentNode: PAGE_ATTRIBUTE | null = useMemo(() => {
    if (!pageId) return null;
    return (
      resumeData.find((item) => item.page === pageId)?.pageAttributes[
        attributeIndex
      ] ?? null
    );
  }, [pageId, attributeIndex, resumeData]);
  const isBaseInfo = currentNode?.type === "baseInfo";

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
    <div className="h-full w-full">
      {isBaseInfo ? (
        <div className="flex h-full w-full flex-col pt-[10px] pb-[10px] text-[16px]">
          {/* 文本 */}
          <div className="mb-[20px] flex flex-col">
            <div className="mb-[10px] text-gray-600">文本</div>
            <Input
              size="large"
              style={{ fontSize: "16px", height: "50px" }}
              value={currentNode?.pageLabel}
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
          {/* 位置 */}
          <div className="mb-[20px] flex w-full justify-between gap-[80px]">
            <div className="flex flex-1 flex-col">
              <div className="mb-[10px] text-gray-600">X轴</div>
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
              <div className="mb-[10px] text-gray-600">Y轴</div>
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
        <div>123</div>
      )}
    </div>
  );
}
