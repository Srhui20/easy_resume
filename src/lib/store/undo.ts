import { create } from "zustand";
import type { PAGE_ATTRIBUTE, UNDO_TYPE } from "@/types/resume";

const cloneResumeSnapshot = (value: PAGE_ATTRIBUTE[]): PAGE_ATTRIBUTE[] =>
  value.map((item) => ({
    ...item,
    borderStyle: item.borderStyle ? { ...item.borderStyle } : undefined,
    paragraphArr: item.paragraphArr?.map((paragraph) => ({
      ...paragraph,
      style: { ...paragraph.style },
    })),
    ref: null,
    style: { ...item.style },
    titleInfo: item.titleInfo
      ? {
          label: item.titleInfo.label,
          style: { ...item.titleInfo.style },
        }
      : undefined,
  }));

const serializeResumeSnapshot = (value: PAGE_ATTRIBUTE[]): string =>
  JSON.stringify(cloneResumeSnapshot(value));

interface UndoState {
  /**
   * 撤销数组
   */
  undoList: UNDO_TYPE;
  /**
   * 重做数组
   */
  redoList: UNDO_TYPE;

  /**
   * 添加撤销数组
   * @param val
   * @returns
   */
  setUndoList: (val: PAGE_ATTRIBUTE[]) => void;
  resetHistory: () => void;

  /**
   * 撤销操作
   * @param val
   * @returns
   */
  toSetUndo: (currentValue: PAGE_ATTRIBUTE[]) => PAGE_ATTRIBUTE[] | null;

  /**
   * 撤销操作，undoList
   * @param val
   * @returns
   */
  toSetRedo: (currentValue: PAGE_ATTRIBUTE[]) => PAGE_ATTRIBUTE[] | null;
}

export const useUndoStore = create<UndoState>((set, get) => ({
  redoList: [],
  resetHistory: () =>
    set({
      redoList: [],
      undoList: [],
    }),
  setUndoList: (val) =>
    set((state) => {
      const snapshot = cloneResumeSnapshot(val);
      const lastSnapshot = state.undoList[state.undoList.length - 1];
      if (
        lastSnapshot &&
        serializeResumeSnapshot(lastSnapshot) ===
          serializeResumeSnapshot(snapshot)
      ) {
        return state;
      }
      return {
        redoList: [],
        undoList: [...state.undoList, snapshot],
      };
    }),
  toSetRedo: (currentValue) => {
    const { redoList } = get();
    if (!redoList.length) return null;

    const target = redoList[redoList.length - 1];
    set((state) => {
      return {
        redoList: state.redoList.slice(0, -1),
        undoList: [...state.undoList, cloneResumeSnapshot(currentValue)],
      };
    });
    return cloneResumeSnapshot(target);
  },
  toSetUndo: (currentValue) => {
    const { undoList } = get();
    if (!undoList.length) return null;

    const target = undoList[undoList.length - 1];
    set((state) => {
      return {
        redoList: [...state.redoList, cloneResumeSnapshot(currentValue)],
        undoList: state.undoList.slice(0, -1),
      };
    });
    return cloneResumeSnapshot(target);
  },
  undoList: [],
}));
