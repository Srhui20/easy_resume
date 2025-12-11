import { create } from "zustand";
import type { PAGE_ATTRIBUTE } from "@/types/resume";

interface PublicState {
  /**
   * 页面所有元素
   */
  resumeData: PAGE_ATTRIBUTE[];
  /**
   * 选中的元素下标
   */
  attributeIndex: number;
  /**
   * 是否正在移动
   */
  isMoving: boolean;
  /**
   * 选中的id
   */
  chooseId: string;

  pageRef: HTMLDivElement | null;

  setPageRef: (val: HTMLDivElement) => void;

  /**
   * 设置resumeData值
   * @param value
   * @returns
   */
  setResumeData: (value: PAGE_ATTRIBUTE[]) => void;
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
   * @param chooseId chooseId
   * @param ai attributeIndex
   * @returns
   */
  setChooseValue: (chooseId: string, ai: number) => void;

  clearAlignLabel: () => void;

  /**
   * 移动页面元素
   * clientX - pageLeft 鼠标在纸里的位置
   * attrX - attrLeft 鼠标在元素里的位置
   * @param clientX 鼠标当前距离最左边距离
   * @param clientY 移动点距离最下边的距离
   * @param attrX 上一次鼠标在最左边距离
   * @param attrY 上一次鼠标在最下边距离
   * @returns
   */
  movePageAttribute: (
    clientX: number,
    clientY: number,
    attrX: number,
    attrY: number,
    scale: number,
  ) => void;
  /**
   * 修改里面pageAttributes的值
   * @param data
   * @returns
   */
  updateResumeData: (data: PAGE_ATTRIBUTE) => void;

  /**
   * 新增数据
   * @param data
   * @returns
   */
  createData: (data: PAGE_ATTRIBUTE) => void;

  delAttribute: () => void;
}

export const usePublicStore = create<PublicState>((set) => ({
  attributeIndex: 0,
  chooseId: "",
  clearAlignLabel: () =>
    set((state) => {
      const arr = [...state.resumeData];
      arr.forEach((item) => {
        if (item.className) {
          item.className = item.className
            .replace(/\balign_label\b/g, "")
            .replace(/\s+/g, " ")
            .trim();
        }
      });
      return {
        resumeData: arr,
      };
    }),

  clearChoose: () =>
    set((state) => {
      return {
        chooseId: "",
        resumeData: state.resumeData.map((item) => {
          return {
            ...item,
            style: {
              ...item.style,
              zIndex: item.type === "baseInfo" ? 1 : 0,
            },
          };
        }),
      };
    }),
  createData: (val) =>
    set((state) => {
      const arr = [...state.resumeData];
      arr.push(val);
      return {
        resumeData: arr,
      };
    }),
  delAttribute: () =>
    set((state) => {
      const id = state.chooseId;
      state.clearChoose();
      return {
        resumeData: state.resumeData.filter((item) => item.id !== id),
      };
    }),
  isMoving: false,
  movePageAttribute: (clientX, clientY, attrX, attrY, scale) =>
    set((state) => {
      const attrs = [...state.resumeData];
      const { attributeIndex: ai } = state;

      const {
        left: pageLeft = 0,
        top: pageTop = 0,
        width: pageWidth,
        height: pageHeight,
      } = state.pageRef?.getBoundingClientRect() as DOMRect;
      const {
        left: attrLeft = 0,
        top: attrTop = 0,
        width: attrWidth,
        height: attrHeight,
      } = attrs[ai].ref?.getBoundingClientRect() as DOMRect;

      /**
       * clientX - pageLeft 鼠标在纸里的位置
       * attrX - attrLeft 鼠标在元素里的位置
       */
      let left = (clientX - pageLeft - attrX + attrLeft) / scale;
      let top = (clientY - pageTop - attrY + attrTop) / scale;
      const maxLeft = (pageWidth - attrWidth) / scale - 0;
      const maxTop = (pageHeight - attrHeight) / scale - 0;
      if (left <= 0) left = 0;
      if (top <= 0) top = 0;

      if (left >= maxLeft) left = maxLeft;
      if (top >= maxTop) top = maxTop;

      // 计算对齐点位，并在同一次 set 中更新对齐辅助线，避免嵌套调用 set
      let alignLeft = 0;
      let alignTop = 0;

      attrs.forEach((item, index) => {
        if (index === ai) return;

        const { left: itLeft = "", top: itTop = "" } = item.style;
        const leftInt = parseInt(itLeft as string, 10);
        const topInt = parseInt(itTop as string, 10);

        if (item.className) {
          item.className = item.className
            .replace(/\balign_label\b/g, "")
            .replace(/\s+/g, " ")
            .trim();
        }

        // 计算新的对齐点
        if (Math.abs(leftInt - left) < 2) {
          alignLeft = leftInt;
          if (!item.className.includes("align_label")) {
            item.className += item.className ? " align_label" : "align_label";
          }
        }
        if (Math.abs(topInt - top) < 2) {
          alignTop = topInt;
          if (!item.className.includes("align_label")) {
            item.className += item.className ? " align_label" : "align_label";
          }
        }
      });

      left = alignLeft === 0 ? left : alignLeft;
      top = alignTop === 0 ? top : alignTop;

      attrs[ai].style = {
        ...attrs[ai].style,
        left: `${left}px`,
        top: `${top}px`,
        zIndex: 99,
      };

      return { resumeData: attrs };
    }),
  pageId: 0,
  pageRef: null,
  resumeData: [],
  setChooseResumeData: (id: string) =>
    set((state) => {
      return {
        isChooseAttributes: true,
        resumeData: state.resumeData.map((mapAttr, index) => {
          const style = { ...mapAttr.style };

          if (style?.zIndex) {
            style.zIndex = mapAttr.type === "baseInfo" ? 1 : 0;
          }
          if (id === mapAttr.id) {
            state.attributeIndex = index;
            state.chooseId = id;
            style.zIndex = 99;
          }

          return {
            ...mapAttr,
            style,
          };
        }),
      };
    }),
  setChooseValue: (chooseId, ai) =>
    set({
      attributeIndex: ai,
      chooseId,
    }),
  setIsMoving: (val) => set({ isMoving: val }),
  setPageRef: (val) => set({ pageRef: val }),
  setResumeData: (value) => set({ resumeData: value }),
  updateResumeData: (data) =>
    set((state) => ({
      resumeData: state.resumeData.map((item) => {
        return item.id === state.chooseId ? data : item;
      }),
    })),
}));
