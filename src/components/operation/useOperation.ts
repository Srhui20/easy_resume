import { useThrottleFn } from "ahooks";
import { Modal, message } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useTypesetting } from "@/lib/hooks/useTypesetting";
import { usePrintStore } from "@/lib/store/print";
import { usePublicStore } from "@/lib/store/public";
import { useUndoStore } from "@/lib/store/undo";
import type { OperationBtnType, PAGE_ATTRIBUTE } from "@/types/resume";

export const useOperation = () => {
  const createData = usePublicStore((state) => state.createData);
  const setChooseResumeData = usePublicStore(
    (state) => state.setChooseResumeData,
  );
  const resumeData = usePublicStore((state) => state.resumeData);
  const delAttribute = usePublicStore((state) => state.delAttribute);
  const chooseId = usePublicStore((state) => state.chooseId);
  const setResumeData = usePublicStore((state) => state.setResumeData);
  const clearChoose = usePublicStore((state) => state.clearChoose);

  const { undoList, redoList, toSetUndo, toSetRedo, setUndoList } =
    useUndoStore();

  const [messageApi, contextHolder] = message.useMessage();

  const setPrintResumeData = usePrintStore((state) => state.setPrintResumeData);

  const { setPrintData } = useTypesetting();
  const [modal, PageModel] = Modal.useModal();

  const btnList: OperationBtnType[] = [
    {
      handleFunc: () => createText(),
      key: "createText",
      label: "新增文本",
      type: "default",
    },
    {
      handleFunc: () => createParagraph(),
      isTip: true,
      key: "createParagraph",
      label: "新增段落",
      type: "default",
    },
    {
      handleFunc: () => delData(),
      key: "delAttribute",
      label: "删除元素",
      type: "default",
    },
    {
      handleFunc: () => toUndo(),
      isTip: true,
      key: "undo",
      label: "撤销",
      type: "default",
    },
    {
      handleFunc: () => toRedo(),
      key: "redo",
      label: "重做",
      type: "default",
    },

    {
      handleFunc: () => {},
      key: "import",
      label: "导入文件 ",
      type: "default",
    },
    {
      handleFunc: () => exportFile(),
      key: "export",
      label: "导出文件",
      type: "default",
    },
    {
      handleFunc: () => toTypesetting(),
      key: "print",
      label: "段落排版",
      type: "default",
    },
  ];

  const createText = () => {
    if (resumeData.filter((item) => item.type === "baseInfo").length >= 20) {
      return messageApi.open({
        content: "页面中最多保留20个文本~",
        type: "error",
      });
    }
    const uuid = uuidv4();

    let maxNum = -30;
    if (resumeData.filter((item) => item.type === "baseInfo").length !== 0) {
      const maxItem = resumeData
        .filter((item) => item.type === "baseInfo")
        .reduce((max: PAGE_ATTRIBUTE, item: PAGE_ATTRIBUTE) => {
          const top = parseFloat((item?.style?.top as string) || "0");
          return top > parseFloat((max?.style?.top as string) || "0")
            ? item
            : max;
        });
      maxNum = parseFloat((maxItem.style.top as string) || "0");
    }
    createData({
      className: "absolute",
      id: uuid,
      pageLabel: "新增文本",
      style: {
        fontSize: "16px",
        left: "0px",
        top: `${maxNum + 30}px`,
      },
      type: "baseInfo",
    });
    setUndoList(resumeData);
    setChooseResumeData(uuid);
  };

  const createParagraph = () => {
    if (resumeData.filter((item) => item.type === "paragraph").length >= 20) {
      return messageApi.open({
        content: "页面中最多保留20个段落~",
        type: "error",
      });
    }

    const maxItem = resumeData
      .filter((item) => item.type === "paragraph")
      .reduce((max: PAGE_ATTRIBUTE, item: PAGE_ATTRIBUTE) => {
        const h = item.ref?.offsetHeight ?? 0;
        const top = parseFloat((item?.style?.top as string) || "0");
        const ht = h + top;

        const maxH = max.ref?.offsetHeight ?? 0;
        const maxTop = parseFloat((max?.style?.top as string) || "0");
        const maxHt = maxH + maxTop;

        return maxHt > ht ? max : item;
      });
    const maxNum =
      parseFloat((maxItem?.style?.top as string) || "0") +
      (maxItem.ref?.offsetHeight ?? 0);
    const dataId = uuidv4();
    const paraId = uuidv4();

    createData({
      borderStyle: {
        ...maxItem.borderStyle,
      },
      className: "absolute",
      id: dataId,
      paragraphArr: [
        {
          endTime: null,
          id: paraId,
          label: "",
          name: "新增段落文本",
          position: "",
          startTime: "",
          style: { fontSize: "16px" },
        },
      ],
      style: {
        fontSize: "16px",
        left: "0px",
        top: `${maxNum + 10}px`,
      },
      titleInfo: {
        label: "新增段落标题",
        style: {
          ...maxItem.titleInfo?.style,
        },
      },
      type: "paragraph",
    });
    setUndoList(resumeData);
  };

  const delData = () => {
    if (!chooseId) {
      return messageApi.open({
        content: "选择元素后进行删除~",
        type: "error",
      });
    }
    delAttribute();
    setUndoList(resumeData);
  };

  const exportFile = () => {
    const fileContent = `${JSON.stringify(
      resumeData.map((item) => {
        return {
          ...item,
          ref: null,
        };
      }),
      null,
      2,
    )};`;
    const blob = new Blob([fileContent], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "easy_resume.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toUndo = () => {
    if (undoList.length <= 1) return;
    toSetUndo();
    setResumeData(undoList[undoList.length - 1]);
    if (undoList.length === 0) {
      setUndoList(resumeData);
    }
  };

  const toRedo = () => {
    if (!redoList.length) return;
    toSetRedo();
    setResumeData(undoList[undoList.length - 1]);
  };

  const { run: handleClick } = useThrottleFn(
    (btn) => {
      btn.handleFunc();
    },
    { trailing: false, wait: 500 },
  );

  const toTypesetting = () => {
    clearChoose();
    setPrintData();
    requestAnimationFrame(() => {
      setPrintResumeData([]);
    });
  };

  const importFile = ($e: React.ChangeEvent<HTMLInputElement>) => {
    const file = $e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        let text = reader.result as string;
        text = text.replace(/;\s*$/, "");
        const arr = JSON.parse(text);
        if (Array.isArray(arr)) {
          modal.warning({
            cancelText: "取消",
            centered: true,
            closable: true,
            content: "导入文件后将覆盖原本的简历，是否确定？",
            okText: "确定",
            onCancel() {
              messageApi.info("已取消导入");
            },
            onOk() {
              setResumeData(arr);
              setUndoList(resumeData);
              clearChoose();
            },
            title: "导入文件",
          });
        } else {
          messageApi.error("格式错误");
        }
      } catch {
        messageApi.error("解析失败~");
      } finally {
        $e.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  return {
    btnList,
    contextHolder,
    handleClick,
    importFile,
    messageApi,
    PageModel,
  };
};
