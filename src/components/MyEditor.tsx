"use client";

import "@wangeditor-next/editor/dist/css/style.css"; // 引入 css
import type { IDomEditor } from "@wangeditor-next/editor";
import { Editor, Toolbar } from "@wangeditor-next/editor-for-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

interface Props {
  initialValue: string;
  onChange: (val: string) => void;
}

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
    "fullScreen",
  ],
};

const editorConfig = {
  placeholder: "请输入内容...",
};

function MyEditor({ initialValue, onChange }: Props) {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const skipInitialChangeRef = useRef(false);

  const handleCreated = useCallback(
    (createdEditor: IDomEditor) => {
      skipInitialChangeRef.current = true;
      createdEditor.setHtml(initialValue);
      setEditor(createdEditor);
      setTimeout(() => {
        createdEditor.focus(true);
      });
    },
    [initialValue],
  );

  const handleChange = useCallback(
    (currentEditor: IDomEditor) => {
      const nextValue = currentEditor.getText() ? currentEditor.getHtml() : "";
      if (skipInitialChangeRef.current) {
        skipInitialChangeRef.current = false;
        if (nextValue === "" || nextValue === initialValue) return;
      }

      onChange(nextValue);
    },
    [initialValue, onChange],
  );

  useEffect(() => {
    return () => {
      skipInitialChangeRef.current = false;
      if (editor == null) return;
      editor.destroy();
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
        onChange={handleChange}
        onCreated={handleCreated}
        style={{ height: "250px" }}
      />
    </div>
  );
}

export default memo(MyEditor, (prevProps, nextProps) => {
  return prevProps.initialValue === nextProps.initialValue;
});
