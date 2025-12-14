import ResumeBaseInfoStyle from "@/components/baseInfo/ResumeBaseInfoStyle";
import ResumeParagraphStyle from "@/components/paragraph/ResumeParagraphStyle";
import { usePublicStore } from "@/lib/store/public";
import type { PAGE_ATTRIBUTE } from "@/types/resume";

export default function ResumeAttribute() {
  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex];
  });

  const isBaseInfo = currentNode?.type === "baseInfo";

  return (
    <div className="h-full w-full">
      {isBaseInfo ? <ResumeBaseInfoStyle /> : <ResumeParagraphStyle />}
    </div>
  );
}
