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
   * 找到所有对齐的点位
   * @param x left点位
   * @param y top点位
   * @returns
   */
  findAlignAttr: (
    x: number,
    y: number,
  ) => { alignLeft: number; alignTop: number };
}

export const usePublicStore = create<PublicState>((set) => ({
  attributeIndex: 0,
  clearAlignLabel: () =>
    set((state) => {
      const arr = [...state.resumeData];
      const attrs = arr.find(
        (item) => item.page === state.pageId,
      ) as RESUME_TYPE;
      attrs.pageAttributes.forEach((item) => {
        if (item.className.includes(" align_label")) {
          item.className = item.className.replace(/ align_label/g, "");
        }
      });

      return {
        resumeData: arr,
      };
    }),
  clearChoose: () =>
    set({
      attributeIndex: 0,
      pageId: 0,
    }),
  findAlignAttr: (x, y) => {
    let alignLeft = 0;
    let alignTop = 0;
    set((state) => {
      const arr = [...state.resumeData];
      const attrs = arr.find(
        (item) => item.page === state.pageId,
      ) as RESUME_TYPE;
      attrs.pageAttributes.map((item, index) => {
        const { left = "", top = "" } = item.style;
        const leftInt = parseInt(left as string, 10);
        const topInt = parseInt(top as string, 10);

        if (index !== state.attributeIndex) {
          if (item.className.includes(" align_label")) {
            item.className = item.className.replace(/ align_label/g, "");
          }

          if (Math.abs(leftInt - x) < 2) {
            alignLeft = leftInt;
            item.className += " align_label";
          }
          if (Math.abs(topInt - y) < 2) {
            alignTop = topInt;
            item.className += " align_label";
          }
        }
        return {
          ...item,
        };
      });

      return { resumeData: state.resumeData };
    });

    return {
      alignLeft,
      alignTop,
    };
  },
  isMoving: false,
  movePageAttribute: (clientX, clientY, attrX, attrY, scale) =>
    set((state) => {
      const { pageId: pid, attributeIndex: ai } = state;
      const arr = [...state.resumeData];
      const attrs = arr.find((item) => item.page === pid) as RESUME_TYPE;

      const {
        left: pageLeft = 0,
        top: pageTop = 0,
        width: pageWidth,
        height: pageHeight,
      } = attrs.ref?.getBoundingClientRect() as DOMRect;
      const {
        left: attrLeft = 0,
        top: attrTop = 0,
        width: attrWidth,
        height: attrHeight,
      } = attrs.pageAttributes[ai].ref?.getBoundingClientRect() as DOMRect;

      /**
       * clientX - pageLeft 鼠标在纸里的位置
       * attrX - attrLeft 鼠标在元素里的位置
       */
      let left = (clientX - pageLeft - attrX + attrLeft) / scale;
      let top = (clientY - pageTop - attrY + attrTop) / scale;
      const maxLeft = (pageWidth - attrWidth) / scale - 40;
      const maxTop = (pageHeight - attrHeight) / scale - 40;
      if (left <= 40) left = 40;
      if (top <= 40) top = 40;

      if (left >= maxLeft) left = maxLeft;
      if (top >= maxTop) top = maxTop;

      const { alignLeft, alignTop } = state.findAlignAttr(left, top);

      left = alignLeft === 0 ? left : alignLeft;
      top = alignTop === 0 ? top : alignTop;

      attrs.pageAttributes[ai].style = {
        ...attrs.pageAttributes[ai].style,
        left: `${left}px`,
        top: `${top}px`,
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
                className = className.replace(/ choose_label/g, "");
              }
              if (id === mapAttr.id) {
                state.pageId = page.page;
                state.attributeIndex = index;
                className += " choose_label";
                style.zIndex = 99;
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
  setIsMoving: (val) => set({ isMoving: val }),
  setResumeData: (value) => set({ resumeData: value }),
}));
