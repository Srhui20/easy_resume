import { useMount } from "ahooks";
import { Modal, message } from "antd";
import { useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface SystemProps {
  dialogOpen: boolean;
  onCancel: () => void;
}

interface menuType {
  key: string;
  title: string;
  fileName: string;
}

export default function SystemDilaog({ dialogOpen, onCancel }: SystemProps) {
  const [messageApi] = message.useMessage();

  const menuList: menuType[] = [
    { fileName: "NOTICE.md", key: "notice", title: "📢 系统公告" },
    { fileName: "OPERATION.md", key: "important", title: "📃 系统须知" },
  ];

  const [systemKey, setSystemKey] = useState("notice");

  const [pageValue, setPageValue] = useState("");

  const getReadNotice = async (fileName: string) => {
    try {
      const res = await fetch(`/api/readFile?fileName=${fileName}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      // 4. 解析 JSON 响应体
      const result = await res.json();

      // 5. 根据你的业务 code 字段判断是否成功
      if (result.code === 200) {
        // 返回文件内容字符串
        setPageValue(result.data);
      } else {
        // 路由中定义的业务错误信息
        throw new Error(result.message || "获取文件内容失败");
      }
    } catch {
      messageApi.error("获取失败，请稍后重试~");
    }
  };

  const menuClick = (item: menuType) => {
    setSystemKey(item.key);
    getReadNotice(item.fileName);
  };

  useMount(() => {
    getReadNotice("NOTICE.md");
  });
  return (
    <Modal
      centered={true}
      footer
      onCancel={onCancel}
      open={dialogOpen}
      title="系统"
      width={700}
    >
      <div className="flex h-[400px] w-full">
        <div className="f-ull flex w-[160px] flex-col gap-[10px] border-gray-300 border-r border-solid pr-[10px]">
          {menuList.map((item) => (
            <div
              className={`flex h-[36px] w-full cursor-pointer items-center rounded-lg px-[10px] ${systemKey === item.key ? "bg-gray-800 text-white" : ""} `}
              key={item.key}
              onClick={() => menuClick(item)}
            >
              {item.title}
            </div>
          ))}
        </div>
        <div className="h-full flex-1 overflow-y-auto">
          <div className="markdown-box max-w-none px-[20px]">
            <Markdown rehypePlugins={[rehypeRaw]}>{pageValue}</Markdown>
          </div>
        </div>
      </div>
    </Modal>
  );
}
