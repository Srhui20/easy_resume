import { useThrottleFn } from "ahooks";
import { message } from "antd";
import type { Color } from "antd/es/color-picker";
import { useCallback, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useTypesetting } from "@/lib/hooks/useTypesetting";
import { usePrintStore } from "@/lib/store/print";
import { usePublicStore } from "@/lib/store/public";
import { useUndoStore } from "@/lib/store/undo";
import type { BaseInfoFontStyleType, PAGE_ATTRIBUTE } from "@/types/resume";

export const useParagraph = () => {
  const updateResumeData = usePublicStore((state) => state.updateResumeData);
  const resumeData = usePublicStore((state) => state.resumeData);
  const setPrintResumeData = usePrintStore((state) => state.setPrintResumeData);
  const setUndoList = useUndoStore.getState().setUndoList;
  const historySessionRef = useRef<string | null>(null);

  const [activeKey, setActiveKey] = useState("text");

  const { setPrintData } = useTypesetting();

  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex];
  });

  const beginHistorySession = useCallback(
    (key: string) => {
      if (historySessionRef.current === key) return;
      historySessionRef.current = key;
      setUndoList(usePublicStore.getState().resumeData);
    },
    [setUndoList],
  );

  const endHistorySession = useCallback((key?: string) => {
    if (!key || historySessionRef.current === key) {
      historySessionRef.current = null;
    }
  }, []);

  const recordHistory = useCallback(
    (key: string) => {
      beginHistorySession(key);
    },
    [beginHistorySession],
  );

  const recordPointerHistory = useCallback(
    (key: string) => {
      if (historySessionRef.current === key) return;
      historySessionRef.current = key;
      setUndoList(usePublicStore.getState().resumeData);

      window.addEventListener(
        "pointerup",
        () => {
          historySessionRef.current = null;
        },
        { once: true },
      );
    },
    [setUndoList],
  );

  const fontStylesList: BaseInfoFontStyleType[] = useMemo(
    () => [
      {
        defaultValue: "normal",
        icon: "bold",
        isChoose: currentNode?.titleInfo?.style?.fontWeight === "bold",
        key: "bold",
        label: "加粗",
        styleKey: "fontWeight",
      },
      {
        defaultValue: "normal",
        icon: "italic",
        isChoose: currentNode?.titleInfo?.style?.fontStyle === "italic",
        key: "italic",
        label: "斜体",
        styleKey: "fontStyle",
      },
      {
        defaultValue: "none",
        icon: "underline",
        isChoose: currentNode?.titleInfo?.style?.textDecoration === "underline",
        key: "underline",
        label: "下划线",
        styleKey: "textDecoration",
      },
    ],
    [currentNode],
  );

  const editLabel = (value: string) => {
    if (!currentNode) return;
    recordHistory("titleLabel");
    updateResumeData({
      ...currentNode,
      titleInfo: {
        label: value,
        style: currentNode.titleInfo?.style ?? {},
      },
    });
  };

  const editFontSize = (val: number | null) => {
    if (!currentNode) return;
    recordHistory("titleFontSize");
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
    recordPointerHistory("titleFontColor");
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
    recordPointerHistory("titleBgColor");
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
    recordPointerHistory("borderBgColor");
    updateResumeData({
      ...currentNode,
      borderStyle: {
        ...currentNode.borderStyle,
        backgroundColor: css,
      },
    });
  };

  const editFontStyle = (editItem: BaseInfoFontStyleType) => {
    const { isChoose, defaultValue, key } = editItem;
    if (!currentNode) return;
    setUndoList(resumeData);
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

  const editMainName = (id: string, value: string) => {
    if (!currentNode) return;
    recordHistory(`mainName:${id}`);
    updateResumeData({
      ...currentNode,
      paragraphArr:
        currentNode?.paragraphArr?.map((item) => {
          return {
            ...item,
            name: item.id === id ? value : item.name,
          };
        }) ?? [],
    });
  };

  const editDate = (id: string, val: null | string[]) => {
    if (!currentNode) return;
    setUndoList(usePublicStore.getState().resumeData);
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

  const editPosition = (id: string, value: string) => {
    if (!currentNode) return;
    recordHistory(`position:${id}`);
    updateResumeData({
      ...currentNode,
      paragraphArr:
        currentNode?.paragraphArr?.map((item) => {
          return {
            ...item,
            position: item.id === id ? value : item.position,
          };
        }) ?? [],
    });
  };

  const { run: createParagraphArr } = useThrottleFn(
    () => {
      if (!currentNode?.paragraphArr) return;
      if (currentNode.paragraphArr?.length >= 10)
        return message.error("不可添加更多~");
      setUndoList(resumeData);
      updateResumeData({
        ...currentNode,
        paragraphArr: [
          ...(currentNode.paragraphArr || []),
          {
            endTime: null,
            id: uuidv4(),
            label: "新增内容",
            name: "新增主体",
            position: "新增职位",
            startTime: null,
            style: {},
          },
        ],
      });

      setPrintData();
      requestAnimationFrame(() => {
        setPrintResumeData([]);
      });
    },
    { trailing: false, wait: 1000 },
  );

  const colorPickerStyle = {
    alignItems: "center",
    fontSize: "16px",
    height: "50px",
    justifyContent: "start",
    paddingLeft: "20px",
    width: "100%",
  };

  return {
    activeKey,
    beginHistorySession,
    colorPickerStyle,
    createParagraphArr,
    editBgColor,
    editBorderBgColor,
    editDate,
    editFontColor,
    editFontSize,
    editFontStyle,
    editLabel,
    editMainName,
    editPosition,
    endHistorySession,
    fontStylesList,
    setActiveKey,
  };
};

export const useParagraphText = () => {
  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex];
  });

  const updateResumeData = usePublicStore((state) => state.updateResumeData);
  const resumeData = usePublicStore((state) => state.resumeData);
  const setPrintResumeData = usePrintStore((state) => state.setPrintResumeData);
  const setUndoList = useUndoStore.getState().setUndoList;

  const { setPrintData } = useTypesetting();

  const arrBtnList = [
    {
      disabled: () => false,
      handleFunc: (index: number) => addText(index),
      key: "add",
      label: "下方添加",
    },
    {
      disabled: () => false,
      handleFunc: (index: number) => deleteText(index),
      key: "delete",
      label: "删除",
    },
    {
      disabled: (index: number) =>
        index === (currentNode?.paragraphArr?.length || 1) - 1,
      handleFunc: (index: number) => exchangeNext(index),
      key: "down",
      label: "与下一个交换",
    },
    {
      disabled: (index: number) => index === 0,
      handleFunc: (index: number) => exchangePrev(index),
      key: "up",
      label: "与上一个交换",
    },
  ];

  const addText = (index: number) => {
    if (currentNode?.paragraphArr && currentNode.paragraphArr?.length >= 10)
      return message.error("不可添加更多~");

    const newArr = [
      ...(currentNode?.paragraphArr?.slice(0, index + 1) || []),
      {
        endTime: null,
        id: uuidv4(),
        label: "新增内容",
        name: "新增主体",
        position: "新增职位",
        startTime: null,
        style: {},
      },
      ...(currentNode?.paragraphArr?.slice(index + 1) || []),
    ];

    setUndoList(resumeData);
    updateResumeData({
      ...(currentNode as PAGE_ATTRIBUTE),
      paragraphArr: newArr,
    });
    setPrintData();
    requestAnimationFrame(() => {
      setPrintResumeData([]);
    });
  };

  const deleteText = (index: number) => {
    setUndoList(resumeData);
    updateResumeData({
      ...(currentNode as PAGE_ATTRIBUTE),
      paragraphArr: currentNode?.paragraphArr?.filter((_, i) => index !== i),
    });
    setPrintData();
    requestAnimationFrame(() => {
      setPrintResumeData([]);
    });
  };

  const exchangeNext = (index: number) => {
    if (index === (currentNode?.paragraphArr?.length || 1) - 1) return;
    const arr = [...(currentNode?.paragraphArr ?? [])];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    setUndoList(resumeData);
    updateResumeData({
      ...(currentNode as PAGE_ATTRIBUTE),
      paragraphArr: [],
    });
    setTimeout(() => {
      updateResumeData({
        ...(currentNode as PAGE_ATTRIBUTE),
        paragraphArr: arr,
      });

      setPrintData();
      requestAnimationFrame(() => {
        setPrintResumeData([]);
      });
    });
  };

  const exchangePrev = (index: number) => {
    if (index === 0) return;
    const arr = [...(currentNode?.paragraphArr ?? [])];
    [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
    setUndoList(resumeData);
    updateResumeData({
      ...(currentNode as PAGE_ATTRIBUTE),
      paragraphArr: [],
    });
    setTimeout(() => {
      updateResumeData({
        ...(currentNode as PAGE_ATTRIBUTE),
        paragraphArr: arr,
      });
      setPrintData();
      requestAnimationFrame(() => {
        setPrintResumeData([]);
      });
    });
  };

  const { run: handleTextFun } = useThrottleFn(
    (btn, index) => {
      btn.handleFunc(index);
    },
    { trailing: false, wait: 1000 },
  );

  return {
    arrBtnList,
    handleTextFun,
  };
};
