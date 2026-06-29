import type { Color } from "antd/es/color-picker";
import { useCallback, useMemo, useRef } from "react";
import { usePublicStore } from "@/lib/store/public";
import { useUndoStore } from "@/lib/store/undo";
import type { BaseInfoFontStyleType, PAGE_ATTRIBUTE } from "@/types/resume";

export const useBaseInfoStyle = () => {
  const { updateResumeData, resumeData } = usePublicStore();
  const setUndoList = useUndoStore.getState().setUndoList;
  const historySessionRef = useRef<string | null>(null);

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

  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex];
  });

  const fontStylesList: BaseInfoFontStyleType[] = useMemo(
    () => [
      {
        defaultValue: "normal",
        icon: "bold",
        isChoose: currentNode?.style?.fontWeight === "bold",
        key: "bold",
        label: "加粗",
        styleKey: "fontWeight",
      },
      {
        defaultValue: "normal",
        icon: "italic",
        isChoose: currentNode?.style?.fontStyle === "italic",
        key: "italic",
        label: "斜体",
        styleKey: "fontStyle",
      },
      {
        defaultValue: "none",
        icon: "underline",
        isChoose: currentNode?.style?.textDecoration === "underline",
        key: "underline",
        label: "下划线",
        styleKey: "textDecoration",
      },
    ],
    [currentNode],
  );

  const editLabel = (value: string) => {
    if (!currentNode) return;
    recordHistory("label");
    updateResumeData({
      ...currentNode,
      pageLabel: value,
    });
  };

  const editFontSize = (val: number | null) => {
    if (!currentNode) return;
    recordHistory("fontSize");
    updateResumeData({
      ...currentNode,
      style: {
        ...currentNode.style,
        fontSize: val ? `${val}px` : "18px",
      },
    });
  };

  const editFontColor = (_: Color, css: string) => {
    if (!currentNode) return;
    recordPointerHistory("fontColor");
    updateResumeData({
      ...currentNode,
      style: {
        ...currentNode.style,
        color: css,
      },
    });
  };

  const editLeft = (val: number | null) => {
    if (!currentNode) return;
    recordHistory("left");
    updateResumeData({
      ...currentNode,
      style: {
        ...currentNode.style,
        left: val ? `${val}px` : "40px",
      },
    });
  };
  const editTop = (val: number | null) => {
    if (!currentNode) return;
    recordHistory("top");
    updateResumeData({
      ...currentNode,
      style: {
        ...currentNode.style,
        top: val ? `${val}px` : "40px",
      },
    });
  };

  const editFontStyle = (editItem: BaseInfoFontStyleType) => {
    const { isChoose, defaultValue, key } = editItem;

    if (!currentNode) return;
    setUndoList(resumeData);
    updateResumeData({
      ...currentNode,
      style: {
        ...currentNode.style,
        [editItem.styleKey]: isChoose ? defaultValue : key,
      },
    });
  };
  return {
    beginHistorySession,
    editFontColor,
    editFontSize,
    editFontStyle,
    editLabel,
    editLeft,
    editTop,
    endHistorySession,
    fontStylesList,
  };
};
