import { type CSSProperties, useState } from "react";
import resumeStyle1 from "@/lib//resume_sytle/resume1";
import { useMousePosition, useZoom } from "@/lib/userMouseHook";
import styles from "./index.module.scss";

type PAGE_ATTRIBUTE = {
  className: string;
  id: string;
  pageLabel: string;
  style: CSSProperties;
};
type RESUME_TYPE = {
  page: number;
  pageAttributes: PAGE_ATTRIBUTE[];
};

export default function MainContainer() {
  const { scale } = useZoom();
  const { moveRef } = useMousePosition();

  const [dataList, setDataList] = useState<RESUME_TYPE[]>(resumeStyle1);

  const setPageAttributeBorder = (attr: PAGE_ATTRIBUTE) => {
    setDataList((prevArr) => {
      return prevArr.map((page) => {
        return {
          ...page,
          pageAttributes: page.pageAttributes.map((mapAttr) => {
            let className = mapAttr.className;
            if (className.includes(" choose_label")) {
              className = className.replace(" choose_label", "");
            }
            if (attr.id === mapAttr.id) {
              className += " choose_label";
            }
            return {
              ...mapAttr,
              className,
            };
          }),
        };
      });
    });
  };

  return (
    <div
      className="main-container flex h-full flex-col overflow-auto bg-gray-200"
      ref={moveRef}
    >
      <div className="h-full w-full">
        <div
          className="flex w-[1688px] items-center justify-center bg-red-200"
          style={{ height: `${1122 * (dataList.length + 1)}px` }}
        >
          <div
            className={`flex flex-col gap-[10] ${styles.print_container}`}
            id="print-container"
            style={{
              transform: `scale(${scale}) `,
            }}
          >
            {dataList.map((item) => (
              <div
                className={`relative flex h-[1122px] w-[794px] flex-col justify-between bg-white p-[40px] ${styles.page_container}`}
                key={item.page}
                style={{ fontSize: "20px" }}
              >
                {item.pageAttributes.map((attr) => (
                  <div
                    className={attr.className}
                    key={attr.id}
                    onClick={() => setPageAttributeBorder(attr)}
                    style={attr.style}
                  >
                    {attr.pageLabel}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
