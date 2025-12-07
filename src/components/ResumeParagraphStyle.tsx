import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import { ColorPicker, Input, InputNumber, Tabs, Tooltip } from "antd";
import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePublicStore } from "@/lib/store/public";
import type { BaseInfoFontStyleType, PAGE_ATTRIBUTE } from "@/types/resume";

const EditorWrapper = memo(
  function EditorWrapper({
    chooseId,
    attributeIndex,
  }: {
    chooseId: string;
    attributeIndex: number;
  }) {
    const MyEditor = dynamic(() => import("./MyEditor"), { ssr: false });

    const updateResumeData = usePublicStore((state) => state.updateResumeData);

    const resumeDataRef = useRef(usePublicStore.getState().resumeData);
    const chooseIdRef = useRef(chooseId);
    const attributeIndexRef = useRef(attributeIndex);

    const getInitialPageLabel = () => {
      const state = usePublicStore.getState();
      if (chooseId || state.attributeIndex !== attributeIndex) {
        return "";
      }
      return resumeDataRef.current[attributeIndexRef.current]?.pageLabel ?? "";
    };

    const [editValue, setEditValue] = useState(getInitialPageLabel());

    const editorKeyRef = useRef(`${chooseId}`);

    useEffect(() => {
      const state = usePublicStore.getState();
      resumeDataRef.current = state.resumeData;
      chooseIdRef.current = chooseId;
      attributeIndexRef.current = attributeIndex;

      // 重新读取初始值并更新 key，强制 MyEditor 重新创建
      if (state.chooseId === chooseId) {
        setEditValue(state.resumeData[state.attributeIndex]?.pageLabel ?? "");
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
          pageLabel: val,
        });

        // 更新 ref
        resumeDataRef.current = usePublicStore.getState().resumeData;
      },
      [updateResumeData],
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
    // 自定义比较函数：只有 pageId 或 attributeIndex 变化时才重新渲染
    return (
      prevProps.pageId === nextProps.pageId &&
      prevProps.attributeIndex === nextProps.attributeIndex
    );
  },
);

export default function ResumeParagraphStyle() {
  // 使用 selector 只订阅需要的值
  const chooseId = usePublicStore((state) => state.chooseId);
  const attributeIndex = usePublicStore((state) => state.attributeIndex);

  // 订阅 currentNode 的其他属性（用于样式等）
  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex];
  });

  const [activeKey, setActiveKey] = useState("text");

  // 使用 useMemo 稳定 fontStylesList，只在 style 相关属性变化时更新
  const fontWeight = currentNode?.style?.fontWeight;
  const fontStyle = currentNode?.style?.fontStyle;
  const textDecoration = currentNode?.style?.textDecoration;

  const fontStylesList: BaseInfoFontStyleType[] = useMemo(
    () => [
      {
        defaultValue: "normal",
        icon: <BoldOutlined />,
        isChoose: fontWeight === "bold",
        key: "bold",
        label: "加粗",
        styleKey: "fontWeight",
      },
      {
        defaultValue: "normal",
        icon: <ItalicOutlined />,
        isChoose: fontStyle === "italic",
        key: "italic",
        label: "斜体",
        styleKey: "fontStyle",
      },
      {
        defaultValue: "none",
        icon: <UnderlineOutlined />,
        isChoose: textDecoration === "underline",
        key: "underline",
        label: "下划线",
        styleKey: "textDecoration",
      },
    ],
    [fontWeight, fontStyle, textDecoration],
  );

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
        <EditorWrapper attributeIndex={attributeIndex} chooseId={chooseId} />
      )}
    </div>
  );
}
