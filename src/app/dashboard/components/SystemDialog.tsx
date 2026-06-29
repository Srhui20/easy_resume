import { useMount } from "ahooks";
import { Modal, message } from "antd";
import { useState, type CSSProperties } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface SystemProps {
  dialogOpen: boolean;
  onCancel: () => void;
}

interface MenuType {
  fileName: string;
  key: string;
  title: string;
}

const activeMenuStyle = {
  background: "color-mix(in srgb, var(--app-accent) 18%, var(--app-panel) 82%)",
  boxShadow:
    "inset 0 0 0 1px color-mix(in srgb, var(--app-accent) 24%, transparent)",
  color: "var(--app-text)",
} satisfies CSSProperties;

const inactiveMenuStyle = {
  color: "var(--app-textMuted)",
} satisfies CSSProperties;

export default function SystemDilaog({ dialogOpen, onCancel }: SystemProps) {
  const [messageApi] = message.useMessage();

  const menuList: MenuType[] = [
    { fileName: "NOTICE.md", key: "notice", title: "系统公告" },
    { fileName: "OPERATION.md", key: "important", title: "使用说明" },
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
      const result = await res.json();

      if (result.code === 200) {
        setPageValue(result.data);
      } else {
        throw new Error(result.message || "读取文件内容失败");
      }
    } catch {
      messageApi.error("读取失败，请稍后重试。");
    }
  };

  const menuClick = (item: MenuType) => {
    setSystemKey(item.key);
    getReadNotice(item.fileName);
  };

  useMount(() => {
    getReadNotice("NOTICE.md");
  });

  return (
    <Modal
      centered
      destroyOnHidden
      footer={null}
      onCancel={onCancel}
      open={dialogOpen}
      style={{ background: "var(--app-panel)" }}
      styles={{
        body: {
          background: "var(--app-panel)",
          color: "var(--app-text)",
        },
        header: {
          background: "var(--app-panel)",
          borderBottom: "1px solid var(--app-border)",
        },
      }}
      title="系统"
      width={700}
    >
      <div className="flex h-[400px] w-full">
        <div
          className="flex w-[160px] flex-col gap-[10px] border-r border-solid pr-[10px]"
          style={{ borderColor: "var(--app-border)" }}
        >
          {menuList.map((item) => (
            <div
              className="flex h-[36px] w-full cursor-pointer items-center rounded-lg px-[10px] transition-colors"
              key={item.key}
              onClick={() => menuClick(item)}
              style={
                systemKey === item.key ? activeMenuStyle : inactiveMenuStyle
              }
            >
              {item.title}
            </div>
          ))}
        </div>
        <div
          className="h-full flex-1 overflow-y-auto"
          style={{ color: "var(--app-text)" }}
        >
          <div className="markdown-box max-w-none px-[20px]">
            <Markdown rehypePlugins={[rehypeRaw]}>{pageValue}</Markdown>
          </div>
        </div>
      </div>
    </Modal>
  );
}
