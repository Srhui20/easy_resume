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
