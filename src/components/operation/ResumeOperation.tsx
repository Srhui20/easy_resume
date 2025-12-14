import {
  DeleteOutlined,
  ExportOutlined,
  FilePptOutlined,
  ImportOutlined,
  RedoOutlined,
  SignatureOutlined,
  SwapOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Col, Row, Tooltip } from "antd";
import { motion } from "motion/react";
import { useOperation } from "./useOperation";
export default function ResumeOperation() {
  const btnIcon: { [key: string]: React.ReactNode } = {
    createParagraph: <FilePptOutlined />,
    createText: <SignatureOutlined />,
    delAttribute: <DeleteOutlined />,
    export: <ExportOutlined />,
    import: <ImportOutlined />,
    print: <SwapOutlined />,
    redo: <RedoOutlined />,
    undo: <UndoOutlined />,
  };

  const { btnList, contextHolder, handleClick, importFile, PageModel } =
    useOperation();

  return (
    <div className="">
      {contextHolder}
      {PageModel}
      <Row gutter={[16, 20]}>
        {btnList.map((btn) => (
          <Col className="gutter-row" key={btn.key} span={6}>
            <Tooltip
              title={btn.key === "import" ? "仅支持导入 本站导出的文件" : ""}
            >
              <motion.div
                className="relative flex cursor-pointer flex-col items-center justify-center rounded-lg p-[5] hover:bg-gray-200"
                onClick={() => handleClick(btn)}
                whileHover={{
                  scale: 1.08,
                  transition: { duration: 0.1 },
                }}
                whileTap={{ scale: 0.9 }}
              >
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    fontSize: "18px",
                    height: "30px",
                    justifyContent: "center",
                  }}
                >
                  {btnIcon[btn.key]}
                </div>
                <div>{btn.label}</div>

                {btn.key === "import" && (
                  <input
                    className="absolute z-[10] h-full w-full cursor-pointer opacity-[0] outline-none"
                    onChange={importFile}
                    type="file"
                  />
                )}
              </motion.div>
            </Tooltip>
          </Col>
        ))}
      </Row>
    </div>
  );
}
