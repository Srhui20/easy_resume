import { create } from "zustand";
import type { PAGE_ATTRIBUTE, UNDO_TYPE } from "@/types/resume";

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

  /**
   * 撤销操作
   * @param val
   * @returns
   */
  toSetUndo: () => void;

  /**
   * 撤销操作，undoList
   * @param val
   * @returns
   */
  toSetRedo: () => void;
}

export const useUndoStore = create<UndoState>((set) => ({
  redoList: [],
  setUndoList: (val) =>
    set((state) => {
      const arr = state.undoList;
      arr.push(val);
      return {
        undoList: arr,
      };
    }),
  toSetRedo: () =>
    set((state) => {
      const uList = state.undoList;
      const rList = state.redoList;
      uList.push(rList[rList.length - 1]);
      rList.pop();
      return {
        redoList: rList,
        undoList: uList,
      };
    }),
  toSetUndo: () =>
    set((state) => {
      const uList = state.undoList;
      const rList = state.redoList;
      rList.push(uList[uList.length - 1]);
      if (uList.length > 1) {
        uList.pop();
      }
      return {
        redoList: rList,
        undoList: uList,
      };
    }),
  undoList: [],
}));
