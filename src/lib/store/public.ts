import { create } from "zustand";
import type { RESUME_TYPE } from "@/types/resume";

interface PublicState {
  resumeData: RESUME_TYPE[];
  setResumeData: (value: RESUME_TYPE[]) => void;
}

export const usePublicStore = create<PublicState>((set) => ({
  resumeData: [],
  setResumeData: (value) => set({ resumeData: value }),
}));
