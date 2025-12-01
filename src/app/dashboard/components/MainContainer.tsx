import { useState } from "react";
import { useMousePosition, useZoom } from "@/lib/userMouseHook";

export default function MainContainer() {
  const { scale } = useZoom();
  const { moveRef } = useMousePosition();

  const [dataList] = useState([{ page: 1 }, { page: 2 }]);

  return (
    <div
      className="main-container flex h-full flex-col overflow-auto bg-gray-200"
      ref={moveRef}
    >
      <div className="h-full w-full">
        <div
          className="flex w-[1688px] items-center justify-center bg-red-200"
          style={{ height: `${1688 + (dataList.length - 1) * 1122}px` }}
        >
          <div
            className="flex flex-col gap-[10]"
            id="print-container"
            style={{
              transform: `scale(${scale}) `,
            }}
          >
            {dataList.map((item) => (
              <div
                className={
                  "flex h-[1122px] w-[794px] flex-col justify-between bg-white"
                }
                key={item.page}
              >
                <div className="flex w-full flex-1 justify-between">
                  <div className="text-[30px]" style={{ color: "red" }}>
                    罗晋徽
                  </div>
                  <div className="text-red-200">13333333333</div>
                </div>
                <div>123</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
