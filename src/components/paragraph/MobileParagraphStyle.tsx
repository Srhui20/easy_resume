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
import { useUndoStore } from "@/lib/store/undo";
import type { PAGE_ATTRIBUTE } from "@/types/resume";
import { EditorWrapper } from "./EditorWrapper";
import { useParagraph, useParagraphText } from "./useParagraphStyle";

export default function MobileParagraphStyle() {
  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex];
  });
  const updateResumeData = usePublicStore((state) => state.updateResumeData);
  const setUndoList = useUndoStore.getState().setUndoList;

  const chooseId = usePublicStore((state) => state.chooseId);
  const attributeIndex = usePublicStore((state) => state.attributeIndex);
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

  const [dateVisible, setDateVisible] = useState(false);
  const [dateTimeObj, setDateTimeObj] = useState({
    dateTime: "",
    id: "",
    isStartTime: true,
  });
  const openDate = (id: string, dateTime: string, isStartTime: boolean) => {
    setDateTimeObj({ dateTime, id, isStartTime });
    setDateVisible(true);
  };

  const setDateTime = (val: string) => {
    if (!currentNode) return;

    updateResumeData({
      ...currentNode,
      paragraphArr:
        currentNode?.paragraphArr?.map((item) => {
          if (dateTimeObj.isStartTime)
            return {
              ...item,
              startTime: item.id === dateTimeObj.id ? val : item.startTime,
            };
          else
            return {
              ...item,
              endTime: item.id === dateTimeObj.id ? val : item.endTime,
            };
        }) ?? [],
    });
    setUndoList(usePublicStore.getState().resumeData);
    setDateVisible(false);
  };

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
                      openDate(item.id, item.startTime as string, true);
                    }}
                    title="开始时间"
                  />
                </div>
                <div>
                  <Cell
                    note={item.endTime || "至今"}
                    onClick={() => {
                      openDate(item.id, item.endTime as string, false);
                    }}
                    title="结束时间"
                  />
                </div>
                <EditorWrapper
                  attributeIndex={attributeIndex}
                  chooseId={chooseId}
                  paragraphId={item.id}
                  paragraphIndex={index}
                />
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
      <Popup
        onClose={() =>
          setDateTimeObj({ dateTime: "", id: "", isStartTime: true })
        }
        placement="bottom"
        visible={dateVisible}
      >
        <DateTimePicker
          format="YYYY-MM"
          mode="month"
          onCancel={() => setDateVisible(false)}
          onConfirm={(val) => setDateTime(val as string)}
          title="选择时间"
          value={dateTimeObj.dateTime}
        />
      </Popup>
    </div>
  );
}
