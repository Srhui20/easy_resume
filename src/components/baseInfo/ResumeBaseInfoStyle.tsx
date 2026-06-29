import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import { ColorPicker, Input, InputNumber, Tooltip } from "antd";
import type { CSSProperties } from "react";
import { usePublicStore } from "@/lib/store/public";
import type { PAGE_ATTRIBUTE } from "@/types/resume";
import { useBaseInfoStyle } from "./useBaseInfoStyle";

const fieldLabelStyle = {
  color: "var(--app-textMuted)",
} satisfies CSSProperties;

const toolbarStyle = {
  background: "color-mix(in srgb, var(--app-panelAlt) 92%, var(--app-bg) 8%)",
  border: "1px solid var(--app-border)",
} satisfies CSSProperties;

const getStyleItemStyle = (isChoose: boolean) =>
  ({
    background: isChoose
      ? "color-mix(in srgb, var(--app-accent) 18%, var(--app-panel) 82%)"
      : "transparent",
    boxShadow: isChoose
      ? "inset 0 0 0 1px color-mix(in srgb, var(--app-accent) 24%, transparent)"
      : "none",
    color: isChoose ? "var(--app-accent)" : "var(--app-textMuted)",
  }) satisfies CSSProperties;

export default function ResumeBaseInfoStyle() {
  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex] ?? null;
  });

  const {
    beginHistorySession,
    editFontColor,
    editFontSize,
    editFontStyle,
    editLabel,
    editLeft,
    editTop,
    endHistorySession,
    fontStylesList,
  } = useBaseInfoStyle();

  const iconMap = {
    bold: <BoldOutlined />,
    italic: <ItalicOutlined />,
    underline: <UnderlineOutlined />,
  };

  return (
    <div className="flex h-full w-full flex-col pt-[10px] pb-[10px] text-[16px]">
      <div className="mb-[20px] flex flex-col">
        <div className="mb-[10px]" style={fieldLabelStyle}>
          文本
        </div>
        <Input
          onBlur={() => endHistorySession("label")}
          onChange={(e) => editLabel(e.target.value)}
          onFocus={() => beginHistorySession("label")}
          size="large"
          style={{ fontSize: "16px", height: "50px" }}
          value={currentNode?.pageLabel}
        />
      </div>

      <div className="mb-[20px] flex w-full justify-between gap-[80px]">
        <div className="flex flex-1 flex-col">
          <div className="mb-[10px]" style={fieldLabelStyle}>
            大小
          </div>
          <div className="flex w-full justify-center">
            <InputNumber
              className="flex-1"
              onBlur={() => endHistorySession("fontSize")}
              onChange={editFontSize}
              onFocus={() => beginHistorySession("fontSize")}
              size="large"
              style={{ fontSize: "16px", height: "50px", width: "100%" }}
              suffix="PX"
              value={
                currentNode?.style?.fontSize
                  ? parseInt(currentNode.style.fontSize as string, 10)
                  : 18
              }
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="mb-[10px]" style={fieldLabelStyle}>
            颜色
          </div>
          <ColorPicker
            onChange={editFontColor}
            showText
            style={{
              alignItems: "center",
              fontSize: "16px",
              height: "50px",
              justifyContent: "start",
              paddingLeft: "20px",
              width: "100%",
            }}
            value={currentNode?.style?.color ?? "#000"}
          />
        </div>
      </div>

      <div className="mb-[20px] flex w-full justify-between gap-[80px]">
        <div className="flex flex-1 flex-col">
          <div className="mb-[10px]" style={fieldLabelStyle}>
            X轴
          </div>
          <div className="flex w-full justify-center">
            <InputNumber
              className="flex-1"
              onBlur={() => endHistorySession("left")}
              onChange={editLeft}
              onFocus={() => beginHistorySession("left")}
              size="large"
              style={{ fontSize: "16px", height: "50px", width: "100%" }}
              suffix="PX"
              value={
                currentNode?.style?.left
                  ? parseInt(currentNode.style.left as string, 10)
                  : 0
              }
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="mb-[10px]" style={fieldLabelStyle}>
            Y轴
          </div>
          <div className="flex w-full justify-center">
            <InputNumber
              className="flex-1"
              onBlur={() => endHistorySession("top")}
              onChange={editTop}
              onFocus={() => beginHistorySession("top")}
              size="large"
              style={{ fontSize: "16px", height: "50px", width: "100%" }}
              suffix="PX"
              value={
                currentNode?.style?.top
                  ? parseInt(currentNode.style.top as string, 10)
                  : 0
              }
            />
          </div>
        </div>
      </div>

      <div className="flex h-[50px] items-center">
        <div className="mr-[10px]" style={fieldLabelStyle}>
          样式
        </div>
        <div
          className="flex h-full w-[110px] justify-center gap-[4px] rounded-lg p-[3px] pr-[8px] pl-[8px]"
          style={toolbarStyle}
        >
          {fontStylesList.map((item) => (
            <Tooltip key={item.key} title={item.label}>
              <div
                className="flex w-[30px] cursor-pointer items-center justify-center rounded-lg transition-colors"
                onClick={() => editFontStyle(item)}
                style={getStyleItemStyle(item.isChoose)}
              >
                {iconMap[item.icon]}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
