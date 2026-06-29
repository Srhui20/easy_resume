"use client";

import {
  DesktopOutlined,
  DownloadOutlined,
  LoadingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Drawer,
  FloatButton,
  Input,
  Modal,
  message,
  Slider,
  Spin,
} from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import MobileBaseInfoStyle from "@/components/baseInfo/MobileBaseInfoStyle";
import ResumeOperation from "@/components/operation/ResumeOperation";
import MobileParagraphStyle from "@/components/paragraph/MobileParagraphStyle";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useTypesetting } from "@/lib/hooks/useTypesetting";
import { usePrintStore } from "@/lib/store/print";
import { usePublicStore } from "@/lib/store/public";
import { useUndoStore } from "@/lib/store/undo";
import type { PAGE_ATTRIBUTE } from "@/types/resume";
import { AppThemePopover } from "./components/AppThemePopover";
import { ChooseTheme } from "./components/ChooseTheme";
import MainContainer from "./components/MainContainer";
import RightInfo from "./components/RightInfo";
import SystemDilaog from "./components/SystemDialog";
import { useAppTheme } from "./hooks/useAppTheme";
import { useMobilePage } from "./hooks/usePage";

export default function Dashboard() {
  const [messageApi, contextHolder] = message.useMessage();
  const [spinning, setSpinning] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [fileName, setFileName] = useState("我的简历");
  const [systemDialogOpen, setSystemDialogOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const { antdTheme, currentTheme, mode, setMode, setThemeKey, themeKey } =
    useAppTheme();
  const resumeData = usePublicStore((state) => state.resumeData);
  const applyResumeSnapshot = usePublicStore(
    (state) => state.applyResumeSnapshot,
  );
  const clearChoose = usePublicStore((state) => state.clearChoose);
  const chooseId = usePublicStore((state) => state.chooseId);
  const setIsMoving = usePublicStore((state) => state.setIsMoving);
  const undoList = useUndoStore((state) => state.undoList);
  const redoList = useUndoStore((state) => state.redoList);
  const toSetUndo = useUndoStore((state) => state.toSetUndo);
  const toSetRedo = useUndoStore((state) => state.toSetRedo);

  const { setPrintData, setRsData } = useTypesetting();
  const printResumeData = usePrintStore((state) => state.printResumeData);
  const setPrintResumeData = usePrintStore((state) => state.setPrintResumeData);

  const {
    attributeShow,
    fileOperationShow,
    setAttributeShow,
    setFileOperationShow,
  } = useMobilePage();

  useEffect(() => {
    if (chooseId) {
      setAttributeShow(true);
      setFileOperationShow(false);
    } else {
      setAttributeShow(false);
    }
  }, [chooseId, setAttributeShow, setFileOperationShow]);

  useEffect(() => {
    localStorage.setItem(
      "resumeData",
      JSON.stringify(
        resumeData.map((item) => ({
          ...item,
          ref: null,
        })),
      ),
    );
  }, [resumeData]);

  useEffect(() => {
    if (!printResumeData.length) return;
    setRsData();
  }, [printResumeData, setRsData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
          target.closest(".w-e-text-container"))
      ) {
        return;
      }

      const isUndo =
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        event.key === "z";
      const isRedo =
        (event.metaKey && event.shiftKey && event.key === "z") ||
        (event.ctrlKey && event.key === "y");

      if (isUndo) {
        if (!undoList.length) return;
        event.preventDefault();
        setIsMoving(false);
        const prevResumeData = toSetUndo(usePublicStore.getState().resumeData);
        if (prevResumeData) applyResumeSnapshot(prevResumeData);
      }

      if (isRedo) {
        if (!redoList.length) return;
        event.preventDefault();
        setIsMoving(false);
        const nextResumeData = toSetRedo(usePublicStore.getState().resumeData);
        if (nextResumeData) applyResumeSnapshot(nextResumeData);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    redoList.length,
    applyResumeSnapshot,
    setIsMoving,
    toSetRedo,
    toSetUndo,
    undoList.length,
  ]);

  const executeDownload = async () => {
    setDownloadModalOpen(false);
    clearChoose();
    setPrintData();

    requestAnimationFrame(async () => {
      const html = document.getElementById("print-container");
      const cloneHtml = html?.cloneNode(true) as HTMLElement;
      const bgInClone = cloneHtml.querySelector("#print-page-bg");

      if (bgInClone) bgInClone.remove();
      try {
        setSpinning(true);
        const res = await fetch("/api/pdf", {
          body: JSON.stringify({
            html: `${cloneHtml.innerHTML}`,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!res.ok) {
          return messageApi.open({
            content: "下载失败，请稍后重试。",
            type: "error",
          });
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        messageApi.error("下载失败，请稍后重试。");
      } finally {
        setSpinning(false);
        setPrintResumeData([]);
      }
    });
  };

  const currentNode: PAGE_ATTRIBUTE | null = usePublicStore((state) => {
    if (!state.chooseId) return null;
    return state.resumeData[state.attributeIndex] ?? null;
  });

  const isBaseInfo = currentNode?.type === "baseInfo";
  const { isMobile } = useIsMobile();
  const setScale = usePublicStore((state) => state.setScale);

  const changePageSize = (val: number) => {
    setScale(0.5 + (val - 1) / 16);
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <Spin
        fullscreen
        indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />}
        spinning={spinning}
        tip="正在导出 PDF..."
      />
      <Modal
        cancelText="取消"
        centered
        okText="确定"
        onCancel={() => setDownloadModalOpen(false)}
        onOk={() => executeDownload()}
        open={downloadModalOpen}
        title="请输入文件名"
      >
        <Input
          onChange={(e) => setFileName(e.target.value)}
          placeholder="请输入文件名"
          suffix=".pdf"
          value={fileName}
        />
      </Modal>
      {systemDialogOpen && (
        <SystemDilaog
          dialogOpen={systemDialogOpen}
          onCancel={() => setSystemDialogOpen(false)}
        />
      )}
      {themeOpen && (
        <ChooseTheme
          dialogOpen={themeOpen}
          onCancel={() => setThemeOpen(false)}
        />
      )}

      <div
        className="flex h-screen flex-col"
        style={{
          background: "var(--app-bg)",
          color: "var(--app-text)",
        }}
      >
        {contextHolder}

        <div className="z-20">
          <div
            className="border-b px-3 py-3 shadow-[var(--app-shadow-sm)] backdrop-blur-xl md:flex md:h-[58px] md:items-center md:justify-between md:px-4 md:py-0"
            style={{
              background:
                "color-mix(in srgb, var(--app-panel) 96%, transparent)",
              borderColor: "var(--app-border)",
            }}
          >
            <div className="flex items-center justify-between gap-3 md:min-w-0">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                  style={{
                    background:
                      "linear-gradient(135deg, color-mix(in srgb, var(--app-accent) 14%, white), white)",
                    borderColor: "var(--app-border)",
                  }}
                >
                  <Image
                    alt="Easy Resume Logo"
                    height={22}
                    src="/logo.png"
                    width={22}
                  />
                </div>
                <div className="min-w-0 leading-tight">
                  <div
                    className="truncate font-semibold text-[16px]"
                    style={{ color: "var(--app-text)" }}
                  >
                    Easy Resume
                  </div>
                  <div
                    className="hidden truncate text-[12px] md:block"
                    style={{ color: "var(--app-textMuted)" }}
                  >
                    让您更轻松地创建简历
                  </div>
                </div>
              </div>

              <div className="md:hidden">
                <Button
                  className="font-semibold"
                  icon={<DownloadOutlined />}
                  onClick={() => setDownloadModalOpen(true)}
                  style={{
                    backgroundColor: "var(--app-accent)",
                    border: "none",
                    boxShadow:
                      "0 12px 26px color-mix(in srgb, var(--app-accent) 28%, transparent)",
                    height: 36,
                    paddingInline: 12,
                  }}
                  type="primary"
                >
                  下载
                </Button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 md:hidden">
              <AppThemePopover
                mode={mode}
                onModeChange={setMode}
                onThemeChange={setThemeKey}
                themeKey={themeKey}
              />
              <Button
                icon={<DesktopOutlined />}
                onClick={() => setThemeOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  color: "var(--app-text)",
                  height: 36,
                }}
                type="default"
              >
                简历样式
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setSystemDialogOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  color: "var(--app-text)",
                  height: 36,
                }}
                type="default"
              >
                系统
              </Button>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <AppThemePopover
                mode={mode}
                onModeChange={setMode}
                onThemeChange={setThemeKey}
                themeKey={themeKey}
              />
              <Button
                icon={<DesktopOutlined />}
                onClick={() => setThemeOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  color: "var(--app-text)",
                  height: 36,
                }}
                type="default"
              >
                简历样式
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setSystemDialogOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  color: "var(--app-text)",
                  height: 36,
                }}
                type="default"
              >
                系统
              </Button>
              <Button
                className="font-semibold"
                icon={<DownloadOutlined />}
                onClick={() => setDownloadModalOpen(true)}
                style={{
                  backgroundColor: "var(--app-accent)",
                  border: "none",
                  boxShadow:
                    "0 12px 26px color-mix(in srgb, var(--app-accent) 28%, transparent)",
                  height: 36,
                  paddingInline: 14,
                }}
                type="primary"
              >
                下载 PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1">
            <MainContainer />
          </div>
          <div
            className="hidden w-[380px] shrink-0 md:block xl:w-[420px]"
            style={{
              background: "transparent",
            }}
          >
            <RightInfo />
          </div>

          <div className="block md:hidden">
            <FloatButton
              icon={<SettingOutlined />}
              onClick={() => setFileOperationShow(true)}
              style={{
                backgroundColor: currentTheme.colors.accent,
                boxShadow:
                  "0 12px 24px color-mix(in srgb, var(--app-accent) 28%, transparent)",
                insetInlineEnd: 24,
              }}
              type="primary"
            />
          </div>
        </div>

        <Slider
          className="z-[100] block md:hidden"
          defaultValue={30}
          max={10}
          min={1}
          onChange={changePageSize}
          styles={{
            root: {
              bottom: "100px",
              margin: "0 auto",
              position: "sticky",
              width: "300px",
            },
          }}
        />

        <div className="block md:hidden">
          {isMobile ? (
            <>
              <Drawer
                closable={{ "aria-label": "Close Button" }}
                mask={false}
                onClose={() => setFileOperationShow(false)}
                open={fileOperationShow}
                placement="bottom"
                size={300}
                styles={{
                  body: {
                    padding: "10px 24px",
                  },
                  header: {
                    padding: "10px 24px",
                  },
                }}
              >
                <ResumeOperation />
              </Drawer>
              <Drawer
                className="block md:hidden"
                closable={{ "aria-label": "Close Button" }}
                mask={false}
                onClose={() => setAttributeShow(false)}
                open={attributeShow}
                placement="bottom"
                styles={{
                  body: {
                    padding: "10px 24px",
                  },
                  header: {
                    padding: "10px 24px",
                  },
                }}
              >
                {isBaseInfo ? (
                  <MobileBaseInfoStyle />
                ) : (
                  <MobileParagraphStyle />
                )}
              </Drawer>
            </>
          ) : null}
        </div>
      </div>
    </ConfigProvider>
  );
}
