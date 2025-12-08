import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";
import {
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Tabs,
  Tooltip,
} from "antd";
import type { Color } from "antd/es/color-picker";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePublicStore } from "@/lib/store/public";
import type { BaseInfoFontStyleType, PAGE_ATTRIBUTE } from "@/types/resume";

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
    const MyEditor = dynamic(() => import("./MyEditor"), { ssr: false });

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
          ].label ?? "",
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
  const updateResumeData = usePublicStore((state) => state.updateResumeData);

  // 订阅 currentNode 的其他属性（用于样式等）
  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex];
  });

  const [activeKey, setActiveKey] = useState("text");

  // 使用 useMemo 稳定 fontStylesList，只在 style 相关属性变化时更新
  // const fontWeight = currentNode?.style?.fontWeight;
  // const fontStyle = currentNode?.style?.fontStyle;
  // const textDecoration = currentNode?.style?.textDecoration;

  const fontStylesList: BaseInfoFontStyleType[] = useMemo(
    () => [
      {
        defaultValue: "normal",
        icon: <BoldOutlined />,
        isChoose: currentNode?.titleInfo?.style?.fontWeight === "bold",
        key: "bold",
        label: "加粗",
        styleKey: "fontWeight",
      },
      {
        defaultValue: "normal",
        icon: <ItalicOutlined />,
        isChoose: currentNode?.titleInfo?.style?.fontStyle === "italic",
        key: "italic",
        label: "斜体",
        styleKey: "fontStyle",
      },
      {
        defaultValue: "none",
        icon: <UnderlineOutlined />,
        isChoose: currentNode?.titleInfo?.style?.textDecoration === "underline",
        key: "underline",
        label: "下划线",
        styleKey: "textDecoration",
      },
    ],
    [currentNode],
  );

  const editLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentNode) return;
    updateResumeData({
      ...currentNode,
      titleInfo: {
        label: e.target.value,
        style: currentNode.titleInfo?.style ?? {},
      },
    });
  };

  const editFontSize = (val: number | null) => {
    if (!currentNode) return;
    updateResumeData({
      ...currentNode,
      titleInfo: {
        label: currentNode.titleInfo?.label ?? "",
        style: {
          ...currentNode.titleInfo?.style,
          fontSize: val ? `${val}px` : "18px",
        },
      },
    });
  };

  const editFontColor = (_: Color, css: string) => {
    if (!currentNode) return;
    updateResumeData({
      ...currentNode,
      titleInfo: {
        label: currentNode.titleInfo?.label ?? "",
        style: {
          ...currentNode.titleInfo?.style,
          color: css,
        },
      },
    });
  };

  const editBgColor = (_: Color, css: string) => {
    if (!currentNode) return;
    updateResumeData({
      ...currentNode,
      titleInfo: {
        label: currentNode.titleInfo?.label ?? "",
        style: {
          ...currentNode.titleInfo?.style,
          backgroundColor: css,
        },
      },
    });
  };

  const editBorderBgColor = (_: Color, css: string) => {
    if (!currentNode) return;
    updateResumeData({
      ...currentNode,
      borderStyle: {
        ...currentNode.borderStyle,
        borderBottomColor: css,
      },
    });
  };

  const editFontStyle = (editItem: BaseInfoFontStyleType) => {
    const { isChoose, defaultValue, key } = editItem;
    if (!currentNode) return;
    updateResumeData({
      ...currentNode,
      titleInfo: {
        label: currentNode.titleInfo?.label ?? "",
        style: {
          ...currentNode.titleInfo?.style,
          [editItem.styleKey]: isChoose ? defaultValue : key,
        },
      },
    });
  };

  const editMainName = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentNode) return;

    updateResumeData({
      ...currentNode,
      paragraphArr:
        currentNode?.paragraphArr?.map((item) => {
          return {
            ...item,
            name: item.id === id ? e.target.value : item.name,
          };
        }) ?? [],
    });
  };

  const editDate = (id: string, val: null | string[]) => {
    if (!currentNode) return;

    updateResumeData({
      ...currentNode,
      paragraphArr:
        currentNode?.paragraphArr?.map((item) => {
          return {
            ...item,
            endTime: item.id === id ? (val?.[1] ?? null) : item.endTime,
            startTime: item.id === id ? (val?.[0] ?? null) : item.startTime,
          };
        }) ?? [],
    });
  };

  const editPosition = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentNode) return;

    updateResumeData({
      ...currentNode,
      paragraphArr:
        currentNode?.paragraphArr?.map((item) => {
          return {
            ...item,
            position: item.id === id ? e.target.value : item.position,
          };
        }) ?? [],
    });
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
              onChange={editLabel}
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
                  defaultValue={
                    currentNode?.titleInfo?.style.backgroundColor ?? "#000"
                  }
                  onChange={editBgColor}
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
                defaultValue={
                  currentNode?.borderStyle?.borderBottomColor ?? "#000"
                }
                onChange={editBorderBgColor}
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
                    onClick={() => editFontStyle(item)}
                  >
                    {item.icon}
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[20px]">
          {currentNode?.paragraphArr?.map((item, index) => (
            <div key={item.id}>
              <div className="flex flex-col">
                <Form.Item label="主体" style={{ marginBottom: "10px" }}>
                  <Input
                    onChange={(val) => editMainName(item.id, val)}
                    value={item.name}
                  />
                </Form.Item>
                <Form.Item label="时间" style={{ marginBottom: "10px" }}>
                  <DatePicker.RangePicker
                    allowEmpty={[true, true]}
                    defaultValue={[
                      item.startTime
                        ? dayjs(item.startTime, "YYYY-MM-DD")
                        : null,
                      item.endTime ? dayjs(item.endTime, "YYYY-MM-DD") : null,
                    ]}
                    format="YYYY-MM-DD"
                    onChange={(_, val) => editDate(item.id, val)}
                    placeholder={["开始日期", "至今"]}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item label="职位" style={{ marginBottom: "10px" }}>
                  <Input
                    onChange={(val) => editPosition(item.id, val)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
