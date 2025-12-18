import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { usePublicStore } from "@/lib/store/public";

export const EditorWrapper = memo(
  function EditorWrapper({
    chooseId,
    attributeIndex,
    paragraphId,
    paragraphIndex,
  }: {
    chooseId: string;
    attributeIndex: number;
    paragraphId: string;
    paragraphIndex: number;
  }) {
    const MyEditor = dynamic(() => import("../MyEditor"), { ssr: false });

    const updateResumeData = usePublicStore((state) => state.updateResumeData);

    const resumeDataRef = useRef(usePublicStore.getState().resumeData);
    const chooseIdRef = useRef(chooseId);
    const paragraphIndexRef = useRef(paragraphIndex);
    const attributeIndexRef = useRef(attributeIndex);

    const getInitialPageLabel = () => {
      const state = usePublicStore.getState();

      if (chooseId || state.attributeIndex !== attributeIndex) {
        return "";
      }
      return (
        resumeDataRef.current[attributeIndexRef.current].paragraphArr?.[
          paragraphIndexRef.current
        ].label ?? ""
      );
    };

    const [editValue, setEditValue] = useState(getInitialPageLabel());

    const editorKeyRef = useRef(`${chooseId}-${paragraphId}`);

    useEffect(() => {
      const state = usePublicStore.getState();
      resumeDataRef.current = state.resumeData;
      chooseIdRef.current = chooseId;
      attributeIndexRef.current = attributeIndex;

      // 重新读取初始值并更新 key，强制 MyEditor 重新创建
      if (state.chooseId === chooseId) {
        setEditValue(
          resumeDataRef.current[attributeIndexRef.current].paragraphArr?.[
            paragraphIndexRef.current
          ]?.label ?? "",
        );
        editorKeyRef.current = `${chooseId}`;
      }
    }, [chooseId, attributeIndex]);

    const editPageContent = useCallback(
      (val: string) => {
        const currentState = usePublicStore.getState();
        resumeDataRef.current = currentState.resumeData;

        const cNode = resumeDataRef.current[attributeIndexRef.current];
        if (!cNode) return;

        updateResumeData({
          ...cNode,
          paragraphArr:
            cNode?.paragraphArr?.map((item) => {
              if (item.id === paragraphId) {
                item.label = val;
              }
              return {
                ...item,
              };
            }) ?? [],
        });

        // 更新 ref
        resumeDataRef.current = usePublicStore.getState().resumeData;
      },
      [updateResumeData, paragraphId],
    );

    return (
      <MyEditor
        key={editorKeyRef.current}
        onChange={editPageContent}
        value={editValue}
      />
    );
  },
  (prevProps, nextProps) => {
    // 自定义比较函数：只有 chooseId 变化时才重新渲染
    return prevProps.chooseId === nextProps.chooseId;
  },
);
