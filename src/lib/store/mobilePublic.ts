import { create } from "zustand";

interface mobilePublicState {
  fileOperationShow: boolean;
  setFileOperationShow: (val: boolean) => void;
  attributeShow: boolean;
  setAttributeShow: (val: boolean) => void;
}

export const mobilePublicStore = create<mobilePublicState>((set) => ({
  attributeShow: false,
  fileOperationShow: false,
  setAttributeShow: (val) =>
    set({
      attributeShow: val,
    }),
  setFileOperationShow: (val) =>
    set({
      fileOperationShow: val,
    }),
}));
