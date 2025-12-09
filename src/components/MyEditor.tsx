"use client";

import "@wangeditor-next/editor/dist/css/style.css"; // 引入 css
import type { IDomEditor } from "@wangeditor-next/editor";
import { Editor, Toolbar } from "@wangeditor-next/editor-for-react";
import { memo, useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}
function MyEditor({ value, onChange }: Props) {
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const initialValueRef = useRef(value); // 只在初始化时使用
  const onChangeRef = useRef(onChange);
  const isInitializedRef = useRef(false);

  // 保持 onChange 引用最新
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleChange = (val: string) => {
    // 直接调用最新的 onChange
    if (!editor?.getText()) {
      return onChangeRef.current("");
    }
    onChangeRef.current(val);
  };

  const toolbarConfig = {
    toolbarKeys: [
      "headerSelect",
      "bold",
      "italic",
      "through",
      "color",
      "bgColor",
      "fontSize",
      "fontFamily",
      "indent",
      "delIndent",
      "bulletedList",
      "numberedList",
    ],
  };
  const editorConfig = {
    placeholder: "请输入内容...",
  };

  // 只在编辑器创建时设置初始值，之后完全不受控
  useEffect(() => {
    if (editor && !isInitializedRef.current) {
      editor?.setHtml(initialValueRef.current);
      isInitializedRef.current = true;
      setTimeout(() => {
        editor.focus(true);
      });
    }
  }, [editor]);

  // 及时销毁 editor
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
      isInitializedRef.current = false;
    };
  }, [editor]);

  return (
    <div style={{ border: "1px solid #ccc", marginTop: "15px", zIndex: 100 }}>
      <Toolbar
        defaultConfig={toolbarConfig}
        editor={editor}
        mode="default"
        style={{ borderBottom: "1px solid #ccc" }}
      />
      <Editor
        defaultConfig={editorConfig}
        mode="default"
        onChange={(editor) => handleChange(editor.getHtml())}
        onCreated={setEditor}
        style={{ height: "250px" }}
        value={initialValueRef?.current}
      />
    </div>
  );
}

// 使用自定义比较函数
// 编辑器完全不受控，只在初始化时设置值，所以 props 变化不应该导致重新渲染
// 当需要更新内容时，通过 key 变化来重新创建组件
export default memo(MyEditor, (prevProps, nextProps) => {
  // 如果 value 变化，可能是切换节点，应该重新创建（通过 key 处理）
  // 如果 value 相同，不重新渲染
  // 但实际上，由于 EditorWrapper 使用了 key，value 变化时 key 也会变化，组件会重新创建
  // 所以这里可以总是返回 true，表示不因为 props 变化而重新渲染
  return prevProps.value === nextProps.value;
});
