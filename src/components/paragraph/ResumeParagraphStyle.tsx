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
import {
  Button,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Tabs,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { usePublicStore } from "@/lib/store/public";
import type { PAGE_ATTRIBUTE } from "@/types/resume";
import { useParagraph, useParagraphText } from "./useParagraphStyle";

const EditorWrapper = memo(
  function EditorWrapper({
    chooseId,
    attributeIndex,
    paragraphId,
    paragraphIndex,
  }: {
    chooseId: string;
    attributeIndex: number;
    paragraphId: string;
    paragraphIndex: number;
  }) {
    const MyEditor = dynamic(() => import("../MyEditor"), { ssr: false });

    const updateResumeData = usePublicStore((state) => state.updateResumeData);

    const resumeDataRef = useRef(usePublicStore.getState().resumeData);
    const chooseIdRef = useRef(chooseId);
    const paragraphIndexRef = useRef(paragraphIndex);
    const attributeIndexRef = useRef(attributeIndex);

    const getInitialPageLabel = () => {
      const state = usePublicStore.getState();

      if (chooseId || state.attributeIndex !== attributeIndex) {
        return "";
      }
      return (
        resumeDataRef.current[attributeIndexRef.current].paragraphArr?.[
          paragraphIndexRef.current
        ].label ?? ""
      );
    };

    const [editValue, setEditValue] = useState(getInitialPageLabel());

    const editorKeyRef = useRef(`${chooseId}-${paragraphId}`);

    useEffect(() => {
      const state = usePublicStore.getState();
      resumeDataRef.current = state.resumeData;
      chooseIdRef.current = chooseId;
      attributeIndexRef.current = attributeIndex;

      // 重新读取初始值并更新 key，强制 MyEditor 重新创建
      if (state.chooseId === chooseId) {
        setEditValue(
          resumeDataRef.current[attributeIndexRef.current].paragraphArr?.[
            paragraphIndexRef.current
          ]?.label ?? "",
        );
        editorKeyRef.current = `${chooseId}`;
      }
    }, [chooseId, attributeIndex]);

    const editPageContent = useCallback(
      (val: string) => {
        const currentState = usePublicStore.getState();
        resumeDataRef.current = currentState.resumeData;

        const cNode = resumeDataRef.current[attributeIndexRef.current];
        if (!cNode) return;

        updateResumeData({
          ...cNode,
          paragraphArr:
            cNode?.paragraphArr?.map((item) => {
              if (item.id === paragraphId) {
                item.label = val;
              }
              return {
                ...item,
              };
            }) ?? [],
        });

        // 更新 ref
        resumeDataRef.current = usePublicStore.getState().resumeData;
      },
      [updateResumeData, paragraphId],
    );

    return (
      <MyEditor
        key={editorKeyRef.current}
        onChange={editPageContent}
        value={editValue}
      />
    );
  },
  (prevProps, nextProps) => {
    // 自定义比较函数：只有 chooseId 变化时才重新渲染
    return prevProps.chooseId === nextProps.chooseId;
  },
);

export default function ResumeParagraphStyle() {
  // 使用 selector 只订阅需要的值
  const chooseId = usePublicStore((state) => state.chooseId);
  const attributeIndex = usePublicStore((state) => state.attributeIndex);

  const {
    fontStylesList,
    editBgColor,
    editBorderBgColor,
    editDate,
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

  // 订阅 currentNode 的其他属性（用于样式等）
  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex];
  });

  const iconMap = {
    bold: <BoldOutlined />,
    italic: <ItalicOutlined />,
    underline: <UnderlineOutlined />,
  };

  const { arrBtnList, handleTextFun } = useParagraphText();

  const paragraphArrIconMap: { [key: string]: React.ReactNode } = {
    add: <PlusOutlined />,
    delete: <DeleteOutlined />,
    down: <ArrowDownOutlined />,
    up: <ArrowUpOutlined />,
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
        <div>
          {/* 文本 */}
          <div className="mb-[20px] flex flex-col">
            <div className="mb-[10px] text-gray-600">文本</div>
            <Input
              onChange={(e) => editLabel(e.target.value)}
              size="large"
              style={{ fontSize: "16px", height: "50px" }}
              value={currentNode?.titleInfo?.label}
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
                    currentNode?.titleInfo?.style.fontSize
                      ? parseInt(
                          currentNode?.titleInfo?.style.fontSize as string,
                          10,
                        )
                      : 18
                  }
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="mb-[10px] text-gray-600">颜色</div>
              <ColorPicker
                defaultValue={currentNode?.titleInfo?.style.color ?? "#000"}
                onChange={editFontColor}
                showText
                style={colorPickerStyle}
              />
            </div>
          </div>
          {/* 背景色和下边框颜色 */}
          <div className="mb-[20px] flex w-full justify-between gap-[80px]">
            <div className="flex flex-1 flex-col">
              <div className="mb-[10px] text-gray-600">背景色</div>
              <div className="flex w-full justify-center">
                <ColorPicker
                  defaultValue={
                    currentNode?.titleInfo?.style.backgroundColor ?? "#000"
                  }
                  onChange={editBgColor}
                  showText
                  style={colorPickerStyle}
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="mb-[10px] text-gray-600">下边框颜色</div>
              <ColorPicker
                defaultValue={
                  currentNode?.borderStyle?.backgroundColor ?? "#000"
                }
                onChange={editBorderBgColor}
                showText
                style={colorPickerStyle}
              />
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
      ) : (
        <div className="flex flex-col gap-[20px]">
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
              className="flex items-center bg-[#f7f7f7] p-[5px]"
              key={item.id}
            >
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 p-[5px]"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col">
                  <Form.Item label="主体" style={{ marginBottom: "10px" }}>
                    <Input
                      onChange={(e) => editMainName(item.id, e.target.value)}
                      value={item.name}
                    />
                  </Form.Item>
                  <Form.Item label="时间" style={{ marginBottom: "10px" }}>
                    <DatePicker.RangePicker
                      allowEmpty={[true, true]}
                      defaultValue={[
                        item.startTime
                          ? dayjs(item.startTime, "YYYY-MM")
                          : null,
                        item.endTime ? dayjs(item.endTime, "YYYY-MM") : null,
                      ]}
                      format="YYYY-MM"
                      onChange={(_, val) => editDate(item.id, val)}
                      picker="month"
                      placeholder={["开始日期", "至今"]}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item label="职位" style={{ marginBottom: "10px" }}>
                    <Input
                      onChange={(e) => editPosition(item.id, e.target.value)}
                      value={item.position}
                    />
                  </Form.Item>
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
                  <Tooltip key={btn.key} placement="left" title={btn.label}>
                    <motion.span
                      className={`${btn.disabled(index) ? "cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={() => handleTextFun(btn, index)}
                      whileHover={
                        !btn.disabled(index)
                          ? {
                              scale: 1.2,
                              transition: { duration: 0.2 },
                            }
                          : undefined
                      }
                      whileTap={
                        !btn.disabled(index) ? { scale: 0.8 } : undefined
                      }
                    >
                      {paragraphArrIconMap[btn.key]}
                    </motion.span>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
