import { mobilePublicStore } from "@/lib/store/mobilePublic";

export const useMobilePage = () => {
  const attributeShow = mobilePublicStore((state) => state.attributeShow);
  const fileOperationShow = mobilePublicStore(
    (state) => state.fileOperationShow,
  );
  const setAttributeShow = mobilePublicStore((state) => state.setAttributeShow);
  const setFileOperationShow = mobilePublicStore(
    (state) => state.setFileOperationShow,
  );

  return {
    attributeShow,
    fileOperationShow,
    setAttributeShow,
    setFileOperationShow,
  };
};
