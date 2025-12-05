import { useMemo } from "react";
import ResumeBaseInfoStyle from "@/components/ResumeBaseInfoStyle";
import ResumeParagraphStyle from "@/components/ResumeParagraphStyle";
import { usePublicStore } from "@/lib/store/public";
import type { PAGE_ATTRIBUTE } from "@/types/resume";

export default function ResumeAttribute() {
  const { resumeData, pageId, attributeIndex } = usePublicStore();
  const currentNode: PAGE_ATTRIBUTE | null = useMemo(() => {
    if (!pageId) return null;
    return (
      resumeData.find((item) => item.page === pageId)?.pageAttributes[
        attributeIndex
      ] ?? null
    );
  }, [pageId, attributeIndex, resumeData]);
  const isBaseInfo = currentNode?.type === "baseInfo";

  return (
    <div className="h-full w-full">
      {isBaseInfo ? <ResumeBaseInfoStyle /> : <ResumeParagraphStyle />}
    </div>
  );
}
