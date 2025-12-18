import { useThrottleFn } from "ahooks";
import { useTypesetting } from "@/lib/hooks/useTypesetting";
import { usePrintStore } from "@/lib/store/print";
import { usePublicStore } from "@/lib/store/public";
import { useUndoStore } from "@/lib/store/undo";
import type { PAGE_ATTRIBUTE } from "@/types/resume";

export const useParagraphBtnFun = () => {
  const { setPrintData } = useTypesetting();
  const setPrintResumeData = usePrintStore((state) => state.setPrintResumeData);
  const resumeData = usePublicStore((state) => state.resumeData);
  const setResumeData = usePublicStore((state) => state.setResumeData);
  const clearChoose = usePublicStore((state) => state.clearChoose);
  const setChooseValue = usePublicStore((state) => state.setChooseValue);
  const setUndoList = useUndoStore.getState().setUndoList;

  const paragraphBtnList = [
    {
      disabled: () => false,
      handleFun: (index: number) => paragraphUniversal(index),
      key: "copy",
      label: "样式一键通用",
    },
    {
      disabled: (index: number) => index >= resumeData.length - 1,
      handleFun: (index: number) => changeNext(index),
      key: "down",
      label: "与下一个段落交换",
    },
    {
      disabled: (index: number) => {
        const baseInfoLength = resumeData.filter(
          (item) => item.type === "baseInfo",
        ).length;
        return index - baseInfoLength === 0;
      },
      handleFun: (index: number) => changePrev(index),
      key: "up",
      label: "与上一个段落交换",
    },
    {
      disabled: () => false,
      handleFun: (index: number) => delParagraph(index),
      key: "delete",
      label: "删除",
    },
  ];

  const paragraphUniversal = (index: number) => {
    const curNode = resumeData[index];
    const arr: PAGE_ATTRIBUTE[] = [...resumeData].map((item) => {
      if (item.type === "baseInfo") return item;
      return {
        ...item,
        borderStyle: curNode?.borderStyle ?? {},
        titleInfo: {
          label: item.titleInfo?.label ?? "",
          style: curNode?.titleInfo?.style ?? {},
        },
      };
    });
    setResumeData(arr);
    setUndoList(usePublicStore.getState().resumeData);
    setPrintData();
    requestAnimationFrame(() => {
      setPrintResumeData([]);
    });
  };

  const changeNext = (index: number) => {
    if (index >= resumeData.length - 1) return;
    const arr = [...resumeData];
    const arrIndexItem = arr[index];
    const arrNextItem = arr[index + 1];

    arr[index] = {
      ...arr[index],
      style: {
        ...arr[index].style,
        top: arrNextItem.style.top,
      },
    };

    arr[index + 1] = {
      ...arr[index + 1],
      style: {
        ...arr[index + 1].style,
        top: arrIndexItem.style.top,
      },
    };
    clearChoose();
    setResumeData(arr);
    setUndoList(usePublicStore.getState().resumeData);
    setPrintData();
    requestAnimationFrame(() => {
      setPrintResumeData([]);
      setChooseValue(arrIndexItem.id, index + 1);
    });
  };

  const changePrev = (index: number) => {
    const arr = [...resumeData];
    const baseInfoLength = resumeData.filter(
      (item) => item.type === "baseInfo",
    ).length;

    if (index - baseInfoLength === 0) return;
    const arrIndexItem = arr[index];
    const arrPrevItem = arr[index - 1];

    arr[index] = {
      ...arr[index],
      style: {
        ...arr[index].style,
        top: arrPrevItem.style.top,
      },
    };

    arr[index - 1] = {
      ...arr[index - 1],
      style: {
        ...arr[index - 1].style,
        top: arrIndexItem.style.top,
      },
    };
    clearChoose();
    setResumeData(arr);
    setUndoList(usePublicStore.getState().resumeData);
    setPrintData();
    requestAnimationFrame(() => {
      setPrintResumeData([]);
      setChooseValue(arrIndexItem.id, index - 1);
    });
  };

  const delParagraph = (index: number) => {
    clearChoose();
    setResumeData(resumeData.filter((_, i) => i !== index));
    setUndoList(usePublicStore.getState().resumeData);
    setPrintData();
  };

  const { run: btnHandleFun } = useThrottleFn(
    (btn, index) => {
      btn.handleFun(index);
    },
    { trailing: false, wait: 1000 },
  );

  return {
    btnHandleFun,
    paragraphBtnList,
  };
};
