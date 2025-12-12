import type { ButtonColorType } from "antd/es/button";
import type { CSSProperties } from "react";

export type PAGE_ATTRIBUTE = {
  className: string;
  id: string;
  pageLabel?: string;
  style: CSSProperties;
  ref?: HTMLDivElement | null;
  type: "baseInfo" | "paragraph";
  titleInfo?: {
    label: string;
    style: CSSProperties;
  };
  paragraphArr?: PARAGRAPH_TYPE[];
  borderStyle?: CSSProperties;
};

type PARAGRAPH_TYPE = {
  id: string;
  label: string;
  style: CSSProperties;
  name: string;
  startTime: string | null;
  endTime: string | null;
  position: string;
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
  isTip?: boolean;
  color?: ButtonColorType;
  style?: CSSProperties;
};

export type BaseInfoFontStyleType = {
  defaultValue: string;
  icon: React.ReactNode;
  isChoose: boolean;
  key: string;
  label: string;
  styleKey: string;
};

export type UNDO_TYPE = PAGE_ATTRIBUTE[][];
