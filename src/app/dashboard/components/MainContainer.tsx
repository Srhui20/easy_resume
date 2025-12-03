import { useEffect, useState } from "react";
import resumeStyle1 from "@/lib//resume_sytle/resume1";
import { usePublicStore } from "@/lib/store/public";
import { useMousePosition, useZoom } from "@/lib/userMouseHook";
import styles from "./index.module.scss";

export default function MainContainer() {
  const { scale } = useZoom();
  const { moveRef } = useMousePosition();

  const {
    resumeData,
    isMoving,
    pageId,
    attributeIndex,
    movePageAttribute,
    setResumeData,
    setChooseResumeData,
    setIsMoving,
    setChooseValue,
  } = usePublicStore();

  useEffect(() => {
    setResumeData(resumeStyle1);
  }, [setResumeData]);

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const mouseDownAttribute = (
    $e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pid: number,
    ai: number,
  ) => {
    if (pid !== pageId || ai !== attributeIndex) return;
    setPosition({
      x: $e.nativeEvent.clientX,
      y: $e.nativeEvent.clientY,
    });

    setChooseValue(pid, ai);
    setIsMoving(true);
  };

  const moveChooseAttribute = (
    $e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (!isMoving) return;
    movePageAttribute(
      $e.nativeEvent.clientX,
      $e.nativeEvent.clientY,
      position.x,
      position.y,
      scale,
    );
    setPosition({
      x: $e.nativeEvent.clientX,
      y: $e.nativeEvent.clientY,
    });
  };

  const mouseUpAttribute = () => {
    setIsMoving(false);
    setPosition({
      x: 0,
      y: 0,
    });
  };

  return (
    <div
      className="main-container flex h-full flex-col overflow-auto bg-gray-200"
      onMouseUp={() => mouseUpAttribute()}
      ref={moveRef}
    >
      <div className="h-full w-full">
        <div
          className="flex w-[1688px] items-center justify-center bg-red-200"
          style={{ height: `${1122 * (resumeData.length + 1)}px` }}
        >
          <div
            className={`flex flex-col gap-[10] ${styles.print_container}`}
            id="print-container"
            style={{
              transform: `scale(${scale})`,
            }}
          >
            {resumeData.map((page) => (
              <div
                className={`relative flex h-[1122px] w-[794px] flex-col justify-between overflow-hidden bg-white p-[40px] ${styles.page_container}`}
                key={page.page}
                onMouseMove={($e) => moveChooseAttribute($e)}
                ref={($el) => {
                  page.ref = $el;
                }}
                style={{ fontSize: "20px" }}
              >
                {page.pageAttributes.map((attr, index) => (
                  <div
                    className={attr.className}
                    dangerouslySetInnerHTML={{ __html: attr.pageLabel }}
                    key={attr.id}
                    onClick={() => setChooseResumeData(attr.id)}
                    onMouseDown={($e) =>
                      mouseDownAttribute($e, page.page, index)
                    }
                    ref={($el) => {
                      attr.ref = $el;
                    }}
                    style={attr.style}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
