"use client";

import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import type {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
} from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { useEffect, useState } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}
function MyEditor({ value, onChange }: Props) {
  // editor 实例

  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法

  // // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法

  // // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
      <Toolbar
        defaultConfig={toolbarConfig}
        editor={editor}
        mode="default"
        style={{ borderBottom: "1px solid #ccc" }}
      />
      <Editor
        defaultConfig={editorConfig}
        mode="default"
        onChange={(editor) => {
          onChange(editor.getHtml());
        }}
        onCreated={setEditor}
        style={{ height: "500px", overflowY: "hidden" }}
        value={value}
      />
    </div>
  );
}

export default MyEditor;
