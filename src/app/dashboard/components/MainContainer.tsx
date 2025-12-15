import { CopyOutlined } from "@ant-design/icons";
import { useMount, useUpdateEffect } from "ahooks";
import { Button, Tooltip } from "antd";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import resumeStyle1 from "@/lib//resume_sytle/resume1";
import { useMouseOpeartion } from "@/lib/hooks/userMouseHook";
import { useTypesetting } from "@/lib/hooks/useTypesetting";
import { usePrintStore } from "@/lib/store/print";
import { usePublicStore } from "@/lib/store/public";
import { useUndoStore } from "@/lib/store/undo";
import type { PAGE_ATTRIBUTE } from "@/types/resume";
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
  const clearChoose = usePublicStore((state) => state.clearChoose);

  const setUndoList = useUndoStore.getState().setUndoList;
  const printResumeData = usePrintStore.getState().printResumeData;

  const [pageLength, setPageLength] = useState(1);

  useEffect(() => {
    if (printResumeData.length) {
      const el = printResumeData[printResumeData.length - 1].ref;
      const maxValue = (el?.offsetHeight || 0) + (el?.offsetTop || 0);
      setPageLength(Math.ceil(maxValue / 1123));
      return;
    }
    const raf = window.requestAnimationFrame(() => {
      let maxValue = 0;
      for (const item of resumeData) {
        const num = parseInt(item?.style?.top as string, 10);
        const height = item?.ref?.offsetHeight ?? 0;
        const mv = height + num;
        if (mv > maxValue) {
          maxValue = mv;
        }
      }

      setPageLength(Math.min(Math.ceil((maxValue + 1) / 1123), 5));
    });
    return () => {
      window.cancelAnimationFrame(raf);
    };
  }, [resumeData, printResumeData]);

  useEffect(() => {
    const localData = JSON.parse(
      localStorage.getItem("resumeData") || JSON.stringify(resumeStyle1),
    );

    setUndoList(localData);
    setResumeData(localData);
  }, [setResumeData, setUndoList]);

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
    $e.stopPropagation();
    if (attrId !== chooseId || ai !== attributeIndex) return;
    if ($e.ctrlKey || $e.metaKey) {
      return;
    }
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
    setUndoList(resumeData);
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

  const mouseClickAttribute = (
    $e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string,
  ) => {
    $e.stopPropagation();
    setChooseResumeData(id);
  };

  useMount(() => {
    const el = moveRef.current;
    if (!el) return;
    const targetScrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTo({
      behavior: "smooth", // 关键属性：启用平滑滚动动画
      left: targetScrollLeft,
      top: 100, // 保持垂直滚动位置不变
    });
  });

  const { setPrintData } = useTypesetting();
  const setPrintResumeData = usePrintStore((state) => state.setPrintResumeData);

  const paragraphUniversal = (id: string) => {
    const curNode = resumeData.find((item) => item.id === id);
    const arr: PAGE_ATTRIBUTE[] = [...resumeData].map((item) => {
      if (item.type === "baseInfo") return item;
      return {
        ...item,
        borderStyle: curNode?.borderStyle ?? {},
        titleInfo: {
          label: item.titleInfo?.label ?? "",
          style: curNode?.titleInfo?.style ?? {},
        },
      };
    });
    setResumeData(arr);
    setUndoList(usePublicStore.getState().resumeData);
    setPrintData();
    requestAnimationFrame(() => {
      setPrintResumeData([]);
    });
  };

  return (
    <div
      className="main-container flex h-full flex-col overflow-auto bg-gray-200"
      onClick={clearChoose}
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
              id="print-page-bg"
              style={{ height: `${1123 * pageLength + 80}px` }}
            />

            <div
              className={`relative flex w-[794px] flex-col justify-start justify-between bg-white ${styles.page_container}`}
              onMouseMove={($e) => moveChooseAttribute($e)}
              ref={($el: HTMLDivElement) => setPageRef($el)}
              style={{ fontSize: "20px", height: `${1123 * pageLength}px` }}
            >
              <AnimatePresence>
                {(printResumeData.length ? printResumeData : resumeData).map(
                  (attr, index) => {
                    return attr.type === "baseInfo" ? (
                      <motion.div
                        animate={{
                          opacity: 1,
                          transition: { duration: 0.8 },
                          y: 0,
                        }}
                        className={`${attr.className} ${chooseId === attr.id ? "choose_label" : ""}`}
                        exit={{
                          opacity: 0,
                          transition: { duration: 0.1 },
                        }}
                        initial={{ opacity: 0, y: 24 }}
                        key={attr.id}
                        onClick={($e) => mouseClickAttribute($e, attr.id)}
                        onMouseDown={($e) =>
                          mouseDownAttribute($e, attr.id, index)
                        }
                        ref={($el) => {
                          attr.ref = $el;
                        }}
                        style={attr.style}
                      >
                        {attr.pageLabel || "空"}
                      </motion.div>
                    ) : (
                      <div
                        className={` ${attr.className} ${chooseId === attr.id ? "choose_label" : ""}`}
                        key={attr.id}
                        onClick={($el) => mouseClickAttribute($el, attr.id)}
                        onMouseDown={($e) =>
                          mouseDownAttribute($e, attr.id, index)
                        }
                        ref={($el) => {
                          attr.ref = $el;
                        }}
                        style={attr.style}
                      >
                        {attr.id === chooseId && (
                          <motion.div
                            className="absolute right-[-38px]"
                            whileHover={{
                              scale: 1.08,
                              transition: { duration: 0.1 },
                            }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Tooltip title="样式一键通用">
                              <Button
                                icon={<CopyOutlined />}
                                onClick={() => paragraphUniversal(attr.id)}
                                shape="circle"
                                style={{ background: "#171717" }}
                                type="primary"
                              />
                            </Tooltip>
                          </motion.div>
                        )}
                        <motion.div
                          animate={{
                            opacity: 1,
                            transition: { duration: 0.8 },
                            y: 0,
                          }}
                          className="flex flex-col"
                          exit={{
                            opacity: 0,
                            transition: { duration: 0.1 },
                          }}
                          initial={{
                            animationDuration: 1,
                            opacity: 0,
                            transitionDuration: 1,
                            y: 24,
                          }}
                        >
                          <div
                            className="mb-[8px] w-[790px] font-bold"
                            style={attr?.borderStyle}
                          >
                            <div
                              className="w-[100px]"
                              style={attr.titleInfo?.style}
                            >
                              {attr.titleInfo?.label || "空"}
                            </div>
                          </div>

                          <div className="flex w-full flex-col gap-[15px]">
                            {attr.paragraphArr?.map((paragraph) => (
                              <div className="" key={paragraph.id}>
                                <div className="flex w-full">
                                  <div className="w-1/3 font-bold">
                                    {paragraph.name}
                                  </div>
                                  <div className="w-1/3 text-center">
                                    {paragraph.position}
                                  </div>
                                  {paragraph.startTime && (
                                    <div className="w-1/3 text-right">
                                      {paragraph.startTime} ~{" "}
                                      {paragraph.endTime || "至今"}
                                    </div>
                                  )}
                                </div>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: paragraph.label || "空",
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    );
                  },
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
