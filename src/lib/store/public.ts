import { create } from "zustand";
import type { RESUME_TYPE } from "@/types/resume";

interface PublicState {
  /**
   * 页面所有元素
   */
  resumeData: RESUME_TYPE[];
  /**
   * 选中的元素下标
   */
  attributeIndex: number;
  /**
   * 是否正在移动
   */
  isMoving: boolean;
  /**
   * 选中的页码,页码为0说明未选中
   */
  pageId: number;
  /**
   * 设置resumeData值
   * @param value
   * @returns
   */
  setResumeData: (value: RESUME_TYPE[]) => void;
  /**
   * 选择页面元素
   * @param id
   * @returns
   */
  setChooseResumeData: (id: string) => void;

  /**
   * 设置是否正在移动
   * @param val
   * @returns
   */
  setIsMoving: (val: boolean) => void;

  /**
   * 清空选择
   * @returns
   */
  clearChoose: () => void;
  /**
   * 移动页面元素
   * @param pid pageId
   * @param ai attributeIndex
   * @returns
   */
  setChooseValue: (pid: number, ai: number) => void;

  /**
   * 移动页面元素
   * @param pid pageId
   * @param ai attributeIndex
   * @param stepX 横向移动距离
   * @param stepY 纵向移动距离
   * @returns
   */
  movePageAttribute: (stepX: number, stepY: number) => void;
}

export const usePublicStore = create<PublicState>((set) => ({
  attributeIndex: 0,
  clearChoose: () =>
    set({
      attributeIndex: 0,
      pageId: 0,
    }),
  isMoving: false,
  movePageAttribute: (stepX, stepY) =>
    set((state) => {
      const { pageId: pid, attributeIndex: ai } = state;
      const arr = [...state.resumeData];
      const attrs = arr.find((item) => item.page === pid) as RESUME_TYPE;
      const { left = "0px", top = "0px" } = attrs.pageAttributes[ai].style;
      let leftNum = parseInt(left?.toString(), 10);
      let topNum = parseInt(top?.toString(), 10);

      if (topNum <= 40) topNum = 40;
      if (leftNum <= 40) leftNum = 40;

      attrs.pageAttributes[ai].style = {
        ...attrs.pageAttributes[ai].style,
        left: `${leftNum + stepX}px`,
        top: `${topNum + stepY}px`,
        zIndex: 99,
      };

      return { resumeData: arr };
    }),
  pageId: 0,
  resumeData: [],
  setChooseResumeData: (id: string) =>
    set((state) => {
      return {
        isChooseAttributes: true,
        resumeData: state.resumeData.map((page) => {
          return {
            ...page,
            pageAttributes: page.pageAttributes.map((mapAttr, index) => {
              let className = mapAttr.className;
              const style = { ...mapAttr.style };

              if (style?.zIndex) {
                style.zIndex = 0;
              }

              if (className.includes(" choose_label")) {
                className = className.replace(" choose_label", "");
              }
              if (id === mapAttr.id) {
                state.pageId = page.page;
                state.attributeIndex = index;
                className += " choose_label";
              }
              return {
                ...mapAttr,
                className,
                style,
              };
            }),
          };
        }),
      };
    }),
  setChooseValue: (pid, ai) =>
    set({
      attributeIndex: ai,
      pageId: pid,
    }),
  setIsMoving: (val: boolean) => set({ isMoving: val }),
  setResumeData: (value: RESUME_TYPE[]) => set({ resumeData: value }),
}));
