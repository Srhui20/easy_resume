import type { ButtonColorType } from "antd/es/button";
import type { CSSProperties } from "react";

export type PAGE_ATTRIBUTE = {
  className: string;
  id: string;
  pageLabel: string;
  style: CSSProperties;
  ref?: HTMLDivElement | null;
};
export type RESUME_TYPE = {
  page: number;
  ref?: HTMLDivElement | null;
  pageAttributes: PAGE_ATTRIBUTE[];
};

export type OperationBtnType = {
  key: string;
  type?: "default" | "primary" | "dashed" | "text" | "link";
  icon: React.ReactNode;
  label: string;
  handleFunc: () => void;
  isTip: boolean;
  color?: ButtonColorType;
};
