import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import { ColorPicker } from "antd";
import { Input } from "tdesign-mobile-react";
import { usePublicStore } from "@/lib/store/public";
import type { PAGE_ATTRIBUTE } from "@/types/resume";
import { useBaseInfoStyle } from "./useBaseInfoStyle";

export default function MobileBaseInfoStyle() {
  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex];
  });

  const {
    editFontColor,
    editFontSize,
    editFontStyle,
    editLabel,
    editLeft,
    editTop,
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
        onChange={(val) => editLabel(val as string)}
        placeholder="请输入"
        value={currentNode?.pageLabel}
      />
      <Input
        align="right"
        label="大小"
        onChange={(val) => editFontSize(val as number)}
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
          defaultValue={currentNode?.style?.color ?? "#000"}
          onChange={editFontColor}
          showText
          style={{
            alignItems: "center",
            fontSize: "16px",
            justifyContent: "start",
            paddingLeft: "20px",
            width: "100%",
          }}
        />
      </div>
      <Input
        align="right"
        label="X轴"
        onChange={(val) => editLeft(val as number)}
        placeholder="请输入"
        suffix="PX"
        type="number"
        value={
          currentNode?.style?.left
            ? parseInt(currentNode.style.left as string, 10)
            : 40
        }
      />
      <Input
        align="right"
        label="Y轴"
        onChange={(val) => editTop(val as number)}
        placeholder="请输入"
        suffix="PX"
        type="number"
        value={
          currentNode?.style?.top
            ? parseInt(currentNode.style.top as string, 10)
            : 40
        }
      />

      <div className="t-input--border flex items-center p-[16px]">
        <div className="w-[80px]">样式</div>
        <div className="flex h-full w-[110px] justify-center gap-[4px] rounded-lg bg-gray-100 p-[3px] pr-[8px] pl-[8px]">
          {fontStylesList.map((item) => (
            <div
              className={`flex w-[30px] cursor-pointer items-center justify-center rounded-lg ${item.isChoose ? "bg-blue-200 text-blue-500" : "hover:bg-gray-300"}`}
              key={item.key}
              onClick={() => editFontStyle(item)}
            >
              {iconMap[item.icon]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
