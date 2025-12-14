import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import { ColorPicker, Input, InputNumber, Tooltip } from "antd";
import { usePublicStore } from "@/lib/store/public";
import type { PAGE_ATTRIBUTE } from "@/types/resume";
import { useBaseInfoStyle } from "./useBaseInfoStyle";
export default function ResumeBaseInfoStyle() {
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
    <div className="flex h-full w-full flex-col pt-[10px] pb-[10px] text-[16px]">
      {/* 文本 */}
      <div className="mb-[20px] flex flex-col">
        <div className="mb-[10px] text-gray-600">文本</div>
        <Input
          onChange={editLabel}
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
              onChange={editFontSize}
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
          <div className="mb-[10px] text-gray-600">颜色</div>
          <ColorPicker
            defaultValue={currentNode?.style?.color ?? "#000"}
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
              onChange={editLeft}
              size="large"
              style={{ fontSize: "16px", height: "50px", width: "100%" }}
              suffix="PX"
              value={
                currentNode?.style?.left
                  ? parseInt(currentNode.style.left as string, 10)
                  : 40
              }
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="mb-[10px] text-gray-600">Y轴</div>
          <div className="flex w-full justify-center">
            <InputNumber
              className="flex-1"
              onChange={editTop}
              size="large"
              style={{ fontSize: "16px", height: "50px", width: "100%" }}
              suffix="PX"
              value={
                currentNode?.style?.top
                  ? parseInt(currentNode.style.top as string, 10)
                  : 40
              }
            />
          </div>
        </div>
      </div>
      {/* 样式 */}
      <div className="flex h-[50px] items-center">
        <div className="mr-[10px] text-gray-600">样式</div>
        <div className="flex h-full w-[110px] justify-center gap-[4px] rounded-lg bg-gray-100 p-[3px] pr-[8px] pl-[8px]">
          {fontStylesList.map((item) => (
            <Tooltip key={item.key} title={item.label}>
              <div
                className={`flex w-[30px] cursor-pointer items-center justify-center rounded-lg ${item.isChoose ? "bg-blue-200 text-blue-500" : "hover:bg-gray-300"}`}
                onClick={() => editFontStyle(item)}
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
