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
    <div>
      {contextHolder}
      {PageModel}
      <Row gutter={[10, 10]}>
        {btnList.map((btn) => (
          <Col className="gutter-row" key={btn.key} span={6}>
            <Tooltip
              title={btn.key === "import" ? "仅支持导入 本站导出的文件" : ""}
            >
              <motion.div
                className="relative flex h-[68px] cursor-pointer flex-col items-center justify-center rounded-md border p-1 transition-colors hover:border-[var(--app-accent)] hover:bg-[var(--app-accentSoft)] hover:text-[var(--app-accent)]"
                onClick={() => handleClick(btn)}
                style={{
                  background: "var(--app-panel)",
                  borderColor: "var(--app-border)",
                  color: "var(--app-text)",
                }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.1 },
                }}
                whileTap={{ scale: 0.9 }}
              >
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    fontSize: "18px",
                    height: "28px",
                    justifyContent: "center",
                  }}
                >
                  {btnIcon[btn.key]}
                </div>
                <div className="max-w-full truncate px-1 text-center text-[12px] leading-5">
                  {btn.label}
                </div>

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
