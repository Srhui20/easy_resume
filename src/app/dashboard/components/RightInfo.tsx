import { Empty } from "antd";
import { usePublicStore } from "@/lib/store/public";
import ResumeOperation from "../../../components/operation/ResumeOperation";
import ResumeAttribute from "./ResumeAttribute";

export default function RightInfo() {
  const chooseId = usePublicStore((state) => state.chooseId);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* <Splitter
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", height: "100%" }}
        vertical
      >
        <Splitter.Panel defaultSize="30%" max="50%" min="30%"> */}

      <div className="flex w-full shrink-0 flex-col border-[#e5e7eb] border-b border-solid bg-white px-5 pt-5 pb-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-semibold text-[#111827] text-[15px]">
              文件操作
            </div>
            <div className="mt-0.5 text-[#6b7280] text-[12px]">
              管理简历内容和页面模块
            </div>
          </div>
        </div>
        <ResumeOperation />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col bg-[#fbfcfe]">
        <div className="shrink-0 border-[#e5e7eb] border-b bg-white px-5 py-4">
          <div className="font-semibold text-[#111827] text-[15px]">
            基本属性
          </div>
          <div className="mt-0.5 text-[#6b7280] text-[12px]">
            {chooseId ? "调整当前选中模块的内容和样式" : "选择画布节点后编辑"}
          </div>
        </div>
        <div className="min-h-0 w-full flex-1 overflow-auto px-5 py-4">
          {!chooseId ? (
            <div className="flex h-full w-full items-center justify-center">
              <Empty
                className="mt-[20px] text-[#6b7280]"
                description="请选择节点后进行操作~"
              />{" "}
            </div>
          ) : (
            <ResumeAttribute />
          )}
        </div>
      </div>

      {/* </Splitter.Panel>
        <Splitter.Panel>132</Splitter.Panel>
      </Splitter> */}
    </div>
  );
}
