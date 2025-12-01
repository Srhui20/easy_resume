import { useState } from "react";
import { useMousePosition, useZoom } from "@/lib/userMouseHook";
import styles from "./index.module.scss";

export default function MainContainer() {
  const { scale } = useZoom();
  const { moveRef } = useMousePosition();

  const [dataList] = useState([
    { page: 1 },
    { page: 2 },
    { page: 3 },
    { page: 4 },
  ]);

  const chooseDom = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.target as HTMLElement;
    element.style.border = "1px dashed red";
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
                <div
                  className="absolute"
                  style={{ fontSize: "34px", left: "40px", top: "40px" }}
                >
                  张三
                </div>
                <div
                  className="absolute"
                  onClick={($e) => chooseDom($e)}
                  style={{ fontSize: "16px", left: "40px", top: "120px" }}
                >
                  电话: 13333333333
                </div>
                <div
                  className="absolute"
                  style={{ fontSize: "16px", left: "300px", top: "120px" }}
                >
                  年龄: 28岁
                </div>
                <div
                  className="absolute"
                  style={{ fontSize: "16px", left: "500px", top: "120px" }}
                >
                  性别: 男
                </div>

                <div
                  className="absolute"
                  style={{ fontSize: "16px", left: "40px", top: "150px" }}
                >
                  邮箱: 13333333333@qq.com
                </div>
                <div
                  className="absolute"
                  style={{ fontSize: "16px", left: "300px", top: "150px" }}
                >
                  地址: 某某省某某市
                </div>
                <div
                  className="absolute"
                  style={{ fontSize: "16px", left: "500px", top: "150px" }}
                >
                  工作经验: 三年
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
