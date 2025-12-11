import type { PAGE_ATTRIBUTE } from "@/types/resume";
import { usePrintStore } from "../store/print";
import { usePublicStore } from "../store/public";

export const useTypesetting = () => {
  const resumeData = usePublicStore((state) => state.resumeData);
  const setResumeData = usePublicStore((state) => state.setResumeData);
  const setPrintResumeData = usePrintStore((state) => state.setPrintResumeData);

  const setPrintData = () => {
    const arr = [...resumeData];
    const baseinfoArr = arr.filter((item) => item.type === "baseInfo");

    const maxTop = baseinfoArr.reduce((max, currentItem) => {
      const currentTop = parseFloat(currentItem.style.top as string) || 0;
      // 比较累加器 max 和当前元素的 top 值
      return Math.max(max, currentTop);
    }, 0);

    const sortArr: PAGE_ATTRIBUTE[] = arr
      .filter((item) => item.type !== "baseInfo")
      .sort((a, b) => {
        return (
          parseFloat(a.style.top as string) - parseFloat(b.style.top as string)
        );
      })
      .map((item, index) => {
        return {
          ...item,
          className: item.className.replace(/\babsolute\b/g, ""),
          style: {
            ...item.style,
            marginTop: index === 0 ? `${maxTop + 50}px` : "20px",
          },
        };
      });

    setPrintResumeData([...baseinfoArr, ...sortArr]);

    let paragraphArr = [...sortArr];

    paragraphArr = paragraphArr.map((item) => {
      const el = item.ref;
      return {
        ...item,
        className: `${item.className} absolute`,
        style: {
          ...item.style,
          marginTop: 0,
          top: `${el?.offsetTop}px`,
        },
      };
    });

    setResumeData([...baseinfoArr, ...paragraphArr]);
  };

  return {
    setPrintData,
  };
};
