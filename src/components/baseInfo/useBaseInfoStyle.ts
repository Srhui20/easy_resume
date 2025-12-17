import type { Color } from "antd/es/color-picker";
import { useMemo } from "react";
import { usePublicStore } from "@/lib/store/public";
import { useUndoStore } from "@/lib/store/undo";
import type { BaseInfoFontStyleType, PAGE_ATTRIBUTE } from "@/types/resume";

export const useBaseInfoStyle = () => {
  const { updateResumeData, resumeData } = usePublicStore();
  const setUndoList = useUndoStore.getState().setUndoList;

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
    updateResumeData({
      ...currentNode,
      pageLabel: value,
    });
    setUndoList(resumeData);
  };

  const editFontSize = (val: number | null) => {
    if (!currentNode) return;
    updateResumeData({
      ...currentNode,
      style: {
        ...currentNode.style,
        fontSize: val ? `${val}px` : "18px",
      },
    });
    setUndoList(resumeData);
  };

  const editFontColor = (_: Color, css: string) => {
    if (!currentNode) return;
    updateResumeData({
      ...currentNode,
      style: {
        ...currentNode.style,
        color: css,
      },
    });
    setUndoList(resumeData);
  };

  const editLeft = (val: number | null) => {
    if (!currentNode) return;
    updateResumeData({
      ...currentNode,
      style: {
        ...currentNode.style,
        left: val ? `${val}px` : "40px",
      },
    });
    setUndoList(resumeData);
  };
  const editTop = (val: number | null) => {
    if (!currentNode) return;
    updateResumeData({
      ...currentNode,
      style: {
        ...currentNode.style,
        top: val ? `${val}px` : "40px",
      },
    });
    setUndoList(resumeData);
  };

  const editFontStyle = (editItem: BaseInfoFontStyleType) => {
    const { isChoose, defaultValue, key } = editItem;

    if (!currentNode) return;
    updateResumeData({
      ...currentNode,
      style: {
        ...currentNode.style,
        [editItem.styleKey]: isChoose ? defaultValue : key,
      },
    });
    setUndoList(resumeData);
  };
  return {
    editFontColor,
    editFontSize,
    editFontStyle,
    editLabel,
    editLeft,
    editTop,
    fontStylesList,
  };
};
