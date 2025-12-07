import { useUpdateEffect } from "ahooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import resumeStyle1 from "@/lib//resume_sytle/resume1";
import { usePublicStore } from "@/lib/store/public";
import { useMouseOpeartion } from "@/lib/userMouseHook";
import styles from "./index.module.scss";

export default function MainContainer() {
  const { moveRef, scale } = useMouseOpeartion();
  const printContainerRef = useRef<HTMLDivElement>(null);

  const resumeData = usePublicStore((state) => state.resumeData);
  const isMoving = usePublicStore((state) => state.isMoving);
  const chooseId = usePublicStore((state) => state.chooseId);
  const attributeIndex = usePublicStore((state) => state.attributeIndex);
  // const pageRef = usePublicStore((state) => state.pageRef);
  const setPageRef = usePublicStore((state) => state.setPageRef);
  const movePageAttribute = usePublicStore((state) => state.movePageAttribute);
  const setResumeData = usePublicStore((state) => state.setResumeData);
  const setChooseResumeData = usePublicStore(
    (state) => state.setChooseResumeData,
  );
  const clearAlignLabel = usePublicStore((state) => state.clearAlignLabel);
  const setIsMoving = usePublicStore((state) => state.setIsMoving);
  const setChooseValue = usePublicStore((state) => state.setChooseValue);

  const pageLength = useMemo(() => {
    let maxValue = 0;

    for (const item of resumeData) {
      const num = parseInt(item?.style?.top as string, 10);
      const height = item?.ref?.offsetHeight ?? 0;
      const mv = height + num;
      if (mv > maxValue) {
        maxValue = mv;
      }
    }

    return Math.ceil(maxValue / (1123 - 41));
  }, [resumeData]);

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
  const isMovingRef = useRef<boolean>(false);

  useEffect(() => {
    isMovingRef.current = isMoving;
  }, [isMoving]);

  const mouseDownAttribute = (
    $e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    attrId: string,
    ai: number,
  ) => {
    if (attrId !== chooseId || ai !== attributeIndex) return;
    if ($e.ctrlKey || $e.metaKey) {
      return;
    }
    $e.stopPropagation();
    setPosition({
      x: $e.nativeEvent.clientX,
      y: $e.nativeEvent.clientY,
    });
    setChooseValue(attrId, ai);
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
          if (!lastPosRef.current || !isMovingRef.current) return;
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
          className="relative flex w-[1688px] items-center justify-center bg-gray-200"
          style={{ height: `${1123 * pageLength * scale + 500}px` }}
        >
          <div
            className={`relative flex flex-col gap-[10] ${styles.print_container}`}
            id="print-container"
            ref={printContainerRef}
            style={{
              transform: `scale(${scale})`,
            }}
          >
            <div
              className="absolute top-[-40px] right-[-40px] z-[-1] w-[874px] bg-white"
              style={{ height: `${1123 * pageLength + 80}px` }}
            />

            <div
              className={`relative flex w-[794px] flex-col justify-between overflow-hidden bg-white ${styles.page_container}`}
              onMouseMove={($e) => moveChooseAttribute($e)}
              ref={($el: HTMLDivElement) => setPageRef($el)}
              style={{ fontSize: "20px", height: `${1123 * pageLength}px` }}
            >
              {resumeData.map((attr, index) => {
                return attr.type === "baseInfo" ? (
                  <div
                    className={`${attr.className} ${attr.pageLabel}`}
                    key={attr.id}
                    onClick={() => setChooseResumeData(attr.id)}
                    onMouseDown={($e) => mouseDownAttribute($e, attr.id, index)}
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
                    onMouseDown={($e) => mouseDownAttribute($e, attr.id, index)}
                    ref={($el) => {
                      attr.ref = $el;
                    }}
                    style={attr.style}
                  >
                    <div className="flex flex-col">
                      <div className="w-[790px] font-bold">
                        {attr.title || "空"}
                      </div>
                      <div
                        className="w-[790px]"
                        dangerouslySetInnerHTML={{
                          __html: attr.pageLabel || "空",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
