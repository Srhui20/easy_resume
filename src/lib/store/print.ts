import { create } from "zustand";
import type { PAGE_ATTRIBUTE } from "@/types/resume";

interface PrintState {
  printResumeData: PAGE_ATTRIBUTE[];
  setPrintResumeData: (val: PAGE_ATTRIBUTE[]) => void;
}

export const usePrintStore = create<PrintState>((set) => ({
  printResumeData: [],
  setPrintResumeData: (val) =>
    set({
      printResumeData: val,
    }),
}));
