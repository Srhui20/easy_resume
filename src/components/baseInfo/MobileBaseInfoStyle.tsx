import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import { ColorPicker } from "antd";
import type { CSSProperties } from "react";
import { Input } from "tdesign-mobile-react";
import { usePublicStore } from "@/lib/store/public";
import type { PAGE_ATTRIBUTE } from "@/types/resume";
import { useBaseInfoStyle } from "./useBaseInfoStyle";

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

export default function MobileBaseInfoStyle() {
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
    <div className="flex flex-col">
      <Input
        label="文本"
        onBlur={() => endHistorySession("label")}
        onChange={(val) => editLabel(val as string)}
        onFocus={() => beginHistorySession("label")}
        placeholder="请输入"
        value={currentNode?.pageLabel}
      />
      <Input
        align="right"
        label="大小"
        onBlur={() => endHistorySession("fontSize")}
        onChange={(val) => editFontSize(val as number)}
        onFocus={() => beginHistorySession("fontSize")}
        placeholder="请输入"
        suffix="PX"
        type="number"
        value={
          currentNode?.style?.fontSize
            ? parseInt(currentNode.style.fontSize as string, 10)
            : 18
        }
      />
      <div className="t-input--border flex items-center p-[16px]">
        <div className="w-[80px]">颜色</div>
        <ColorPicker
          onChange={editFontColor}
          showText
          style={{
            alignItems: "center",
            fontSize: "16px",
            justifyContent: "start",
            paddingLeft: "20px",
            width: "100%",
          }}
          value={currentNode?.style?.color ?? "#000"}
        />
      </div>
      <Input
        align="right"
        label="X轴"
        onBlur={() => endHistorySession("left")}
        onChange={(val) => editLeft(val as number)}
        onFocus={() => beginHistorySession("left")}
        placeholder="请输入"
        suffix="PX"
        type="number"
        value={
          currentNode?.style?.left
            ? parseInt(currentNode.style.left as string, 10)
            : 0
        }
      />
      <Input
        align="right"
        label="Y轴"
        onBlur={() => endHistorySession("top")}
        onChange={(val) => editTop(val as number)}
        onFocus={() => beginHistorySession("top")}
        placeholder="请输入"
        suffix="PX"
        type="number"
        value={
          currentNode?.style?.top
            ? parseInt(currentNode.style.top as string, 10)
            : 0
        }
      />

      <div className="t-input--border flex items-center p-[16px]">
        <div className="w-[80px]">样式</div>
        <div
          className="flex h-[40px] w-[110px] justify-center gap-[4px] rounded-lg p-[3px] pr-[8px] pl-[8px]"
          style={toolbarStyle}
        >
          {fontStylesList.map((item) => (
            <div
              className="flex w-[30px] cursor-pointer items-center justify-center rounded-lg transition-colors"
              key={item.key}
              onClick={() => editFontStyle(item)}
              style={getStyleItemStyle(item.isChoose)}
            >
              {iconMap[item.icon]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
