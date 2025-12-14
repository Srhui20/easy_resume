import type { Color } from "antd/es/color-picker";
import { useMemo } from "react";
import { usePublicStore } from "@/lib/store/public";
import { useUndoStore } from "@/lib/store/undo";
import type { BaseInfoFontStyleType, PAGE_ATTRIBUTE } from "@/types/resume";

export const useParagraph = () => {
  const updateResumeData = usePublicStore((state) => state.updateResumeData);
  const resumeData = usePublicStore((state) => state.resumeData);

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

  const editLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentNode) return;
    updateResumeData({
      ...currentNode,
      titleInfo: {
        label: e.target.value,
        style: currentNode.titleInfo?.style ?? {},
      },
    });
    setUndoList(resumeData);
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
    setUndoList(resumeData);
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
    setUndoList(resumeData);
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
    setUndoList(resumeData);
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
    setUndoList(resumeData);
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
    setUndoList(resumeData);
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
    setUndoList(resumeData);
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
    setUndoList(resumeData);
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
    setUndoList(resumeData);
  };
  return {
    editBgColor,
    editBorderBgColor,
    editDate,
    editFontColor,
    editFontSize,
    editFontStyle,
    editLabel,
    editMainName,
    editPosition,
    fontStylesList,
  };
};
