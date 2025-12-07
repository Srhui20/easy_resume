import { useUpdateEffect } from "ahooks";
import { useCallback, useEffect, useRef, useState } from "react";
import resumeStyle1 from "@/lib//resume_sytle/resume1";
import { usePublicStore } from "@/lib/store/public";
import { useMouseOpeartion } from "@/lib/userMouseHook";
import styles from "./index.module.scss";

export default function MainContainer() {
  const { moveRef, scale } = useMouseOpeartion();
  const printContainerRef = useRef<HTMLDivElement>(null);

  const resumeData = usePublicStore((state) => state.resumeData);
  const isMoving = usePublicStore((state) => state.isMoving);
  const pageId = usePublicStore((state) => state.pageId);
  const attributeIndex = usePublicStore((state) => state.attributeIndex);
  const movePageAttribute = usePublicStore((state) => state.movePageAttribute);
  const setResumeData = usePublicStore((state) => state.setResumeData);
  const setChooseResumeData = usePublicStore(
    (state) => state.setChooseResumeData,
  );
  const clearAlignLabel = usePublicStore((state) => state.clearAlignLabel);
  const setIsMoving = usePublicStore((state) => state.setIsMoving);
  const setChooseValue = usePublicStore((state) => state.setChooseValue);

  useEffect(() => {
    setResumeData(resumeStyle1);
  }, [setResumeData]);

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  // 使用 requestAnimationFrame 合并一帧内多次 move 调用
  const lastPosRef = useRef<{ clientX: number; clientY: number } | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const mouseDownAttribute = (
    $e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pid: number,
    ai: number,
  ) => {
    if (pid !== pageId || ai !== attributeIndex) return;
    if ($e.ctrlKey || $e.metaKey) {
      return;
    }
    $e.stopPropagation();
    setPosition({
      x: $e.nativeEvent.clientX,
      y: $e.nativeEvent.clientY,
    });
    setChooseValue(pid, ai);
    setIsMoving(true);
  };

  const moveChooseAttribute = useCallback(
    ($e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!isMoving) return;
      if ($e.ctrlKey || $e.metaKey) {
        return;
      }
      $e.stopPropagation();

      const clientX = $e.nativeEvent.clientX;
      const clientY = $e.nativeEvent.clientY;

      lastPosRef.current = { clientX, clientY };
      // 一帧内执行一次moveChooseAttribute
      if (rafIdRef.current == null) {
        rafIdRef.current = window.requestAnimationFrame(() => {
          rafIdRef.current = null;
          if (!lastPosRef.current) return;
          const { clientX: lx, clientY: ly } = lastPosRef.current;
          movePageAttribute(lx, ly, position.x, position.y, scale);
          setPosition({
            x: lx,
            y: ly,
          });
        });
      }
    },
    [isMoving, movePageAttribute, position.x, position.y, scale],
  );

  const mouseUpAttribute = () => {
    if (!isMoving) return;
    setIsMoving(false);
    setPosition({
      x: 0,
      y: 0,
    });
  };

  // 组件卸载时清理未完成的动画帧
  useEffect(() => {
    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  useUpdateEffect(() => {
    if (!isMoving) {
      clearAlignLabel();
    }
  }, [isMoving, clearAlignLabel]);

  return (
    <div
      className="main-container flex h-full flex-col overflow-auto bg-gray-200"
      onMouseUp={() => mouseUpAttribute()}
      ref={moveRef}
    >
      <div className="h-full w-full">
        <div
          className="flex w-[1688px] items-center justify-center bg-gray-200"
          style={{ height: `${1122 * resumeData.length * scale + 500}px` }}
        >
          <div
            className={`flex flex-col gap-[10] ${styles.print_container}`}
            id="print-container"
            ref={printContainerRef}
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
                {page.pageAttributes.map((attr, index) => {
                  return attr.type === "baseInfo" ? (
                    <div
                      className={`${attr.className} ${attr.pageLabel}`}
                      key={attr.id}
                      onClick={() => setChooseResumeData(attr.id)}
                      onMouseDown={($e) =>
                        mouseDownAttribute($e, page.page, index)
                      }
                      ref={($el) => {
                        attr.ref = $el;
                      }}
                      style={attr.style}
                    >
                      {attr.pageLabel || "空"}
                    </div>
                  ) : (
                    <div
                      className={attr.className}
                      key={attr.id}
                      onClick={() => setChooseResumeData(attr.id)}
                      onMouseDown={($e) =>
                        mouseDownAttribute($e, page.page, index)
                      }
                      ref={($el) => {
                        attr.ref = $el;
                      }}
                      style={attr.style}
                    >
                      <div className="flex flex-col">
                        <div className="w-[714px] font-bold">
                          {attr.title || "空"}
                        </div>
                        <div
                          className="w-[714px]"
                          dangerouslySetInnerHTML={{
                            __html: attr.pageLabel || "空",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
