import {
  DeleteOutlined,
  ExportOutlined,
  FilePptOutlined,
  ImportOutlined,
  RedoOutlined,
  SignatureOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { useThrottleFn } from "ahooks";
import { Col, message, Row } from "antd";
import { v4 as uuidv4 } from "uuid";
import { usePublicStore } from "@/lib/store/public";
import type { OperationBtnType, PAGE_ATTRIBUTE } from "@/types/resume";
export default function ResumeOperation() {
  const [messageApi, contextHolder] = message.useMessage();

  const createData = usePublicStore((state) => state.createData);
  const setChooseResumeData = usePublicStore(
    (state) => state.setChooseResumeData,
  );
  const resumeData = usePublicStore((state) => state.resumeData);
  const delAttribute = usePublicStore((state) => state.delAttribute);
  const chooseId = usePublicStore((state) => state.chooseId);

  const btnList: OperationBtnType[] = [
    {
      handleFunc: () => createText(),
      icon: <SignatureOutlined />,
      key: "createText",
      label: "新增文本",
      type: "default",
    },
    {
      handleFunc: () => createParagraph(),
      icon: <FilePptOutlined />,
      isTip: true,
      key: "createParagraph",
      label: "新增段落",
      type: "default",
    },
    {
      handleFunc: () => delData(),
      icon: <DeleteOutlined />,
      key: "delAttribute",
      label: "删除元素",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <UndoOutlined />,
      isTip: true,
      key: "undo",
      label: "撤销",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <RedoOutlined />,
      key: "redo",
      label: "重做",
      type: "default",
    },

    {
      handleFunc: () => {},
      icon: <ImportOutlined />,
      key: "import",
      label: "导入文件 ",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <ExportOutlined />,
      key: "export",
      label: "导出文件",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <ExportOutlined />,
      key: "print",
      label: "打印",
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
    const maxItem = resumeData
      .filter((item) => item.type === "baseInfo")
      .reduce((max: PAGE_ATTRIBUTE, item: PAGE_ATTRIBUTE) => {
        const top = parseFloat((item?.style?.top as string) || "0");
        return top > parseFloat((max?.style?.top as string) || "0")
          ? item
          : max;
      });

    const maxNum = parseFloat((maxItem.style.top as string) || "0");
    const uuid = uuidv4();
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
        borderBottomColor: "pink",
        borderBottomStyle: "solid",
        borderBottomWidth: "1px",
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
          backgroundColor: "pink",
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
      type: "paragraph",
    });
  };

  const delData = () => {
    if (!chooseId) {
      return messageApi.open({
        content: "选择元素后进行删除~",
        type: "error",
      });
    }
    delAttribute();
  };

  const { run: handleClick } = useThrottleFn(
    (btn) => {
      btn.handleFunc();
    },
    { wait: 2000 },
  );

  return (
    <div className="">
      {contextHolder}
      <Row gutter={[16, 20]}>
        {btnList.map((btn) => (
          <Col className="gutter-row" key={btn.key} span={6}>
            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg p-[5] hover:bg-gray-200"
              onClick={() => handleClick(btn)}
            >
              <div style={{ fontSize: "18px" }}>{btn.icon}</div>
              <div>{btn.label}</div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
