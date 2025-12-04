import { Empty } from "antd";
import { usePublicStore } from "@/lib/store/public";
import ResumeAttribute from "./ResumeAttribute";
import ResumeOperation from "./ResumeOperation";

export default function RightInfo() {
  const { pageId } = usePublicStore();

  return (
    <div className="flex h-full w-full flex-col bg-gray-200 p-[0px]">
      {/* <Splitter
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", height: "100%" }}
        vertical
      >
        <Splitter.Panel defaultSize="30%" max="50%" min="30%"> */}

      <div className="flex w-full flex-col border-gray-200 border-b border-solid bg-white p-[20px]">
        <div className="mb-[10px] font-bold text-[20px]">文件操作</div>
        <ResumeOperation />
      </div>
      <div className="flex w-full flex-1 flex-col bg-white p-[20px]">
        <div className="mb-[10px] font-bold text-[20px]">基本属性</div>
        <div className="w-full flex-1 overflow-auto">
          {!pageId ? (
            <div className="flex h-full w-full items-center justify-center">
              <Empty
                className="mt-[20px]"
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
