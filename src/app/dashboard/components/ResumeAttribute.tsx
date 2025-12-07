import ResumeBaseInfoStyle from "@/components/ResumeBaseInfoStyle";
import ResumeParagraphStyle from "@/components/ResumeParagraphStyle";
import { usePublicStore } from "@/lib/store/public";
import type { PAGE_ATTRIBUTE } from "@/types/resume";

export default function ResumeAttribute() {
  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.pageId) return null;
    return (
      state.resumeData.find((item) => item.page === state.pageId)
        ?.pageAttributes[state.attributeIndex] ?? null
    );
  });

  const isBaseInfo = currentNode?.type === "baseInfo";

  return (
    <div className="h-full w-full">
      {isBaseInfo ? <ResumeBaseInfoStyle /> : <ResumeParagraphStyle />}
    </div>
  );
}
