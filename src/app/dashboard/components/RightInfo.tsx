import { Empty } from "antd";
import { usePublicStore } from "@/lib/store/public";
import ResumeOperation from "../../../components/operation/ResumeOperation";
import ResumeAttribute from "./ResumeAttribute";

export default function RightInfo() {
  const chooseId = usePublicStore((state) => state.chooseId);

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden"
      style={{ background: "transparent" }}
    >
      <div
        className="mx-4 mt-4 flex w-auto shrink-0 flex-col rounded-[28px] border px-5 pt-5 pb-4 backdrop-blur-xl"
        style={{
          background: "var(--app-panel)",
          borderColor: "var(--app-border)",
          boxShadow: "var(--app-shadow-sm)",
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div
              className="font-[var(--app-heading)] text-[22px]"
              style={{ color: "var(--app-text)" }}
            >
              文件操作
            </div>
            <div
              className="mt-1 text-[12px]"
              style={{ color: "var(--app-textMuted)" }}
            >
              在这里统一管理模块、内容与画布操作。
            </div>
          </div>
        </div>
        <ResumeOperation />
      </div>

      <div className="min-h-0 w-full flex-1 px-4 pt-4 pb-4">
        <div
          className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border backdrop-blur-xl"
          style={{
            background: "var(--app-panel)",
            borderColor: "var(--app-border)",
            boxShadow: "var(--app-shadow-sm)",
          }}
        >
          <div
            className="shrink-0 border-b px-5 py-4"
            style={{
              background: "var(--app-panel)",
              borderColor: "var(--app-border)",
            }}
          >
            <div
              className="font-[var(--app-heading)] text-[22px]"
              style={{ color: "var(--app-text)" }}
            >
              属性面板
            </div>
            <div
              className="mt-1 text-[12px]"
              style={{ color: "var(--app-textMuted)" }}
            >
              {chooseId
                ? "调整当前选中模块的内容与样式细节。"
                : "请先选择画布中的模块，再进行编辑。"}
            </div>
          </div>
          <div className="min-h-0 w-full flex-1 overflow-auto px-5 py-4">
            {!chooseId ? (
              <div className="flex h-full w-full items-center justify-center">
                <Empty
                  className="mt-[20px]"
                  description="请选择一个简历模块开始编辑"
                  style={{ color: "var(--app-textMuted)" }}
                />
              </div>
            ) : (
              <ResumeAttribute />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
