import { useThrottleFn } from "ahooks";
import { message } from "antd";
import type { Color } from "antd/es/color-picker";
import { useMemo } from "react";
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

  const { setPrintData } = useTypesetting();

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

  const { run: createParagraphArr } = useThrottleFn(
    () => {
      if (!currentNode) return;
      if (currentNode.paragraphArr?.length >= 10)
        return message.error("不可添加更多~");
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

      setUndoList(usePublicStore.getState().resumeData);
      setPrintData();
      requestAnimationFrame(() => {
        setPrintResumeData([]);
      });
    },
    { trailing: false, wait: 1000 },
  );

  return {
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
    fontStylesList,
  };
};

export const useParagraphText = () => {
  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex];
  });

  const updateResumeData = usePublicStore((state) => state.updateResumeData);
  const setPrintResumeData = usePrintStore((state) => state.setPrintResumeData);
  const setUndoList = useUndoStore.getState().setUndoList;

  const { setPrintData } = useTypesetting();

  const arrBtnList = [
    {
      handleFunc: (id) => addText(id),
      key: "add",
      label: "下方添加",
    },
    {
      handleFunc: (id) => deleteText(id),
      key: "delete",
      label: "删除",
    },
    {
      handleFunc: (id) => {},
      key: "down",
      label: "与下一个交换",
    },
    {
      handleFunc: (id) => {},
      key: "up",
      label: "与上一个交换",
    },
  ];

  const addText = (id) => {
    if (currentNode.paragraphArr?.length >= 10)
      return message.error("不可添加更多~");

    const newArr = currentNode.paragraphArr.reduce((res, item) => {
      res.push(item);
      if (item.id === id)
        res.push({
          endTime: null,
          id: uuidv4(),
          label: "新增内容",
          name: "新增主体",
          position: "新增职位",
          startTime: null,
          style: {},
        });
      return res;
    }, []);

    updateResumeData({
      ...currentNode,
      paragraphArr: newArr,
    });
    setUndoList(usePublicStore.getState().resumeData);

    setPrintData();
    requestAnimationFrame(() => {
      setPrintResumeData([]);
    });
  };

  const deleteText = (id) => {
    updateResumeData({
      ...currentNode,
      paragraphArr: currentNode.paragraphArr.filter((item) => item.id !== id),
    });
    setPrintData();
    requestAnimationFrame(() => {
      setPrintResumeData([]);
    });
  };

  const { run: handleTextFun } = useThrottleFn(
    (btn, id) => {
      btn.handleFunc(id);
    },
    { trailing: false, wait: 1000 },
  );

  return {
    arrBtnList,
    handleTextFun,
  };
};
