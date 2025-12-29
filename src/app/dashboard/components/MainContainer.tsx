import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useMount, useUpdateEffect } from "ahooks";
import { Button, Tooltip } from "antd";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DotBg } from "@/components/mainBg";
import resumeStyle1 from "@/lib//resume_sytle/resume1";
import { useMouseOpeartion } from "@/lib/hooks/userMouseHook";
import { usePrintStore } from "@/lib/store/print";
import { usePublicStore } from "@/lib/store/public";
import { useUndoStore } from "@/lib/store/undo";
import {
  useBaseInfoBtnFun,
  useParagraphBtnFun,
} from "../hooks/useMainContainer";
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

  const [pageHeight, setPageHeight] = useState(1123);

  useEffect(() => {
    if (printResumeData.length) {
      const el = printResumeData[printResumeData.length - 1].ref;
      const maxValue = (el?.offsetHeight || 0) + (el?.offsetTop || 0);
      setPageHeight(Math.ceil(maxValue));
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
      setPageHeight(Math.ceil(maxValue));
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
      if (resumeData[attributeIndex].type === "paragraph") return;
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
    [
      attributeIndex,
      isMoving,
      movePageAttribute,
      position.x,
      position.y,
      resumeData,
      scale,
    ],
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

  const { paragraphBtnList, paragraphBtnHandleFun } = useParagraphBtnFun();

  const { baseInfoBtnList, baseInfoBtnHandleFun } = useBaseInfoBtnFun();

  const paragraphBtnIconMap: { [key: string]: React.ReactNode } = {
    copy: <CopyOutlined />,
    delete: <DeleteOutlined />,
    down: <ArrowDownOutlined />,
    up: <ArrowUpOutlined />,
  };

  return (
    <DotBg
      className="flex h-full flex-col"
      gradient={false}
      gradientHeight="100%"
      gradientWidth="100%"
    >
      <div
        className="main-container flex h-full flex-col overflow-auto"
        onClick={clearChoose}
        onMouseUp={() => mouseUpAttribute()}
        ref={moveRef}
      >
        <div className="h-full w-full">
          <div
            className="relative flex w-[1688px] items-center justify-center"
            style={{ height: `${pageHeight + 500}px` }}
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
                className="absolute top-[-40px] right-[-40px] z-[-1] w-[874px] bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                id="print-page-bg"
                style={{ height: `${pageHeight + 80}px` }}
              />

              <div
                className={`relative flex w-[794px] flex-col justify-start justify-between bg-white ${styles.page_container}`}
                onMouseMove={($e) => moveChooseAttribute($e)}
                ref={($el: HTMLDivElement) => setPageRef($el)}
                style={{ fontSize: "20px", height: `${pageHeight}px` }}
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
                          {attr.id === chooseId && (
                            <div className="absolute top-[0] right-[-38px] flex flex-col">
                              {baseInfoBtnList.map((baseBtn) => (
                                <motion.div
                                  key={baseBtn.key}
                                  whileHover={{
                                    scale: 1.08,
                                    transition: { duration: 0.1 },
                                  }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Tooltip
                                    placement="right"
                                    title={baseBtn.label}
                                  >
                                    <Button
                                      disabled={baseBtn.disabled()}
                                      icon={paragraphBtnIconMap[baseBtn.key]}
                                      onClick={() =>
                                        baseInfoBtnHandleFun(baseBtn, index)
                                      }
                                      shape="circle"
                                      size="small"
                                      style={{
                                        background: "#171717",
                                        color: "#fff",
                                      }}
                                      type="primary"
                                    />
                                  </Tooltip>
                                </motion.div>
                              ))}
                            </div>
                          )}
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
                            <div className="absolute right-[-38px] flex flex-col">
                              {paragraphBtnList.map((paragraphBtn) => (
                                <motion.div
                                  key={paragraphBtn.key}
                                  whileHover={{
                                    scale: 1.08,
                                    transition: { duration: 0.1 },
                                  }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {!paragraphBtn.disabled(index) && (
                                    <Tooltip
                                      placement="right"
                                      title={paragraphBtn.label}
                                    >
                                      <Button
                                        icon={
                                          paragraphBtnIconMap[paragraphBtn.key]
                                        }
                                        onClick={() =>
                                          paragraphBtnHandleFun(
                                            paragraphBtn,
                                            index,
                                          )
                                        }
                                        shape="circle"
                                        size="small"
                                        style={{
                                          background: "#171717",
                                          color: "#fff",
                                        }}
                                        type="primary"
                                      />
                                    </Tooltip>
                                  )}
                                </motion.div>
                              ))}
                            </div>
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
                            <div className="mb-[8px] w-[790px] font-bold">
                              <div
                                className="w-[110px]"
                                style={attr.titleInfo?.style}
                              >
                                {attr.titleInfo?.label || "空"}
                              </div>
                              <div
                                className="transform-[scaleY(0.5)] mt-[-1px] h-[1px] w-full origin-bottom"
                                style={attr.borderStyle}
                              />
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
    </DotBg>
  );
}
