import {
  AppstoreAddOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  BoldOutlined,
  DeleteOutlined,
  ItalicOutlined,
  PlusOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import { Button, ColorPicker, Tabs } from "antd";
import { motion } from "motion/react";
import { useState } from "react";
import { Cell, DateTimePicker, Input, Popup } from "tdesign-mobile-react";
import { usePublicStore } from "@/lib/store/public";
import type { PAGE_ATTRIBUTE } from "@/types/resume";
import { useParagraph, useParagraphText } from "./useParagraphStyle";

export default function MobileParagraphStyle() {
  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex];
  });
  const {
    fontStylesList,
    editBgColor,
    editBorderBgColor,
    // editDate,
    editFontColor,
    editFontSize,
    editFontStyle,
    editLabel,
    editMainName,
    editPosition,
    createParagraphArr,
    activeKey,
    setActiveKey,
    colorPickerStyle,
  } = useParagraph();

  const { arrBtnList, handleTextFun } = useParagraphText();

  const iconMap = {
    bold: <BoldOutlined />,
    italic: <ItalicOutlined />,
    underline: <UnderlineOutlined />,
  };
  const paragraphArrIconMap: { [key: string]: React.ReactNode } = {
    add: <PlusOutlined />,
    delete: <DeleteOutlined />,
    down: <ArrowDownOutlined />,
    up: <ArrowUpOutlined />,
  };

  // const dateVisible = useRef(false);

  const [dateVisible, setDateVisible] = useState(false);

  return (
    <div className="flex flex-col">
      <Tabs
        activeKey={activeKey}
        centered
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
        <div className="flex flex-col">
          <Input
            label="文本"
            onChange={(val) => editLabel(val as string)}
            placeholder="请输入"
            value={currentNode?.titleInfo?.label}
          />
          <Input
            align="right"
            label="大小"
            onChange={(val) => editFontSize(val as number)}
            placeholder="请输入"
            suffix="PX"
            type="number"
            value={
              currentNode?.titleInfo?.style.fontSize
                ? parseInt(currentNode?.titleInfo?.style.fontSize as string, 10)
                : 18
            }
          />
          <div className="t-input--border flex items-center p-[16px]">
            <div className="w-[100px]">颜色</div>
            <ColorPicker
              defaultValue={currentNode?.titleInfo?.style.color ?? "#000"}
              onChange={editFontColor}
              showText
              style={colorPickerStyle}
            />
          </div>
          <div className="t-input--border flex items-center p-[16px]">
            <div className="w-[100px]">背景色</div>
            <ColorPicker
              defaultValue={
                currentNode?.titleInfo?.style.backgroundColor ?? "#000"
              }
              onChange={editBgColor}
              showText
              style={colorPickerStyle}
            />
          </div>
          <div className="t-input--border flex items-center p-[16px]">
            <div className="w-[100px]">下边框颜色</div>
            <ColorPicker
              defaultValue={currentNode?.borderStyle?.backgroundColor ?? "#000"}
              onChange={editBorderBgColor}
              showText
              style={colorPickerStyle}
            />
          </div>
          <div className="t-input--border flex items-center p-[16px]">
            <div className="w-[80px]">样式</div>
            <div className="flex h-[40px] w-[110px] justify-center gap-[4px] rounded-lg bg-gray-100 p-[3px] pr-[8px] pl-[8px]">
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
      ) : (
        <div className="flex flex-col">
          <div className="flex w-full justify-between">
            <div className="font-bold text-[16px]">
              {currentNode?.titleInfo?.label}
            </div>
            <Button
              icon={<AppstoreAddOutlined />}
              onClick={createParagraphArr}
              style={{ color: "#171717" }}
              type="link"
            >
              新增
            </Button>
          </div>

          {currentNode?.paragraphArr?.map((item, index) => (
            <div
              className="mb-[10px] flex items-center bg-[#f7f7f7] p-[5px]"
              key={item.id}
            >
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-1 flex-col p-[5px]"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  label="主体"
                  onChange={(val) => editMainName(item.id, val as string)}
                  placeholder="请输入"
                  value={item.name}
                />
                <Input
                  label="职位"
                  onChange={(val) => editPosition(item.id, val as string)}
                  placeholder="请输入"
                  value={item.position}
                />

                <div>
                  <Cell
                    note={item.startTime}
                    onClick={() => {
                      setDateVisible(true);
                    }}
                    title="开始时间"
                  />
                </div>
              </motion.div>
              <div className="flex h-full flex-col gap-[5px]">
                {arrBtnList.map((btn) => (
                  <motion.span
                    className={`${btn.disabled(index) ? "cursor-not-allowed" : "cursor-pointer"} ml-[10px] text-[20px]`}
                    key={btn.key}
                    onClick={() => handleTextFun(btn, index)}
                    whileHover={
                      !btn.disabled(index)
                        ? {
                            scale: 1.2,
                            transition: { duration: 0.2 },
                          }
                        : undefined
                    }
                    whileTap={!btn.disabled(index) ? { scale: 0.8 } : undefined}
                  >
                    {paragraphArrIconMap[btn.key]}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <Popup placement="bottom" visible={dateVisible}>
        <DateTimePicker format="YYYY-MM" mode="month" title="选择时间" />
      </Popup>
    </div>
  );
}
