import {
  ExportOutlined,
  FileAddOutlined,
  FileExcelOutlined,
  ImportOutlined,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import type { OperationBtnType } from "@/types/resume";
export default function ResumeOperation() {
  const btnList: OperationBtnType[] = [
    {
      handleFunc: () => {},
      icon: <SaveOutlined />,
      isTip: true,
      key: "save",
      label: "保存",
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
      isTip: true,
      key: "redo",
      label: "重做",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <FileAddOutlined />,
      isTip: true,
      key: "add",
      label: "加一页",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <FileExcelOutlined />,
      isTip: true,
      key: "delete",
      label: "删除末页",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <ImportOutlined />,
      isTip: true,
      key: "import",
      label: "导入文件 ",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <ExportOutlined />,
      isTip: true,
      key: "export",
      label: "导出文件",
      type: "default",
    },
    {
      handleFunc: () => {},
      icon: <ExportOutlined />,
      isTip: true,
      key: "print",
      label: "打印",
      type: "default",
    },
  ];

  return (
    <div className="">
      <Row gutter={[16, 20]}>
        {btnList.map((btn) => (
          <Col className="gutter-row" key={btn.key} span={6}>
            <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg p-[5] hover:bg-gray-200">
              <div style={{ fontSize: "18px" }}>{btn.icon}</div>
              <div>{btn.label}</div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
