import dynamic from "next/dynamic";
import { memo, useCallback, useRef } from "react";
import { usePublicStore } from "@/lib/store/public";
import { useUndoStore } from "@/lib/store/undo";

const MyEditor = dynamic(() => import("../MyEditor"), { ssr: false });

export const EditorWrapper = memo(
  function EditorWrapper({
    attributeIndex,
    paragraphId,
  }: {
    attributeIndex: number;
    paragraphId: string;
  }) {
    const setResumeData = usePublicStore((state) => state.setResumeData);
    const setUndoList = useUndoStore((state) => state.setUndoList);
    const hasRecordedHistoryRef = useRef(false);
    const nodeId = usePublicStore((state) => {
      const node = state.resumeData[attributeIndex];
      return node?.id;
    });
    const paragraphValue = usePublicStore((state) => {
      const node = state.resumeData[attributeIndex];
      return node?.paragraphArr?.find((item) => item.id === paragraphId)?.label;
    });

    const editPageContent = useCallback(
      (val: string) => {
        const currentState = usePublicStore.getState();
        if (!nodeId) return;

        if (!hasRecordedHistoryRef.current) {
          setUndoList(currentState.resumeData);
          hasRecordedHistoryRef.current = true;
        }

        setResumeData(
          currentState.resumeData.map((node) => {
            if (node.id !== nodeId) return node;

            return {
              ...node,
              paragraphArr:
                node.paragraphArr?.map((item) => {
                  return {
                    ...item,
                    label: item.id === paragraphId ? val : item.label,
                  };
                }) ?? [],
            };
          }),
        );
      },
      [nodeId, paragraphId, setResumeData, setUndoList],
    );

    const resetHistoryRecord = useCallback(() => {
      hasRecordedHistoryRef.current = false;
    }, []);

    return (
      <MyEditor
        initialValue={paragraphValue ?? ""}
        key={paragraphId}
        onBlur={resetHistoryRecord}
        onChange={editPageContent}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.attributeIndex === nextProps.attributeIndex &&
      prevProps.paragraphId === nextProps.paragraphId
    );
  },
);
