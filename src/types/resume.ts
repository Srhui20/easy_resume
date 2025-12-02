import type { CSSProperties } from "react";

export type PAGE_ATTRIBUTE = {
  className: string;
  id: string;
  pageLabel: string;
  style: CSSProperties;
};
export type RESUME_TYPE = {
  page: number;
  pageAttributes: PAGE_ATTRIBUTE[];
};
