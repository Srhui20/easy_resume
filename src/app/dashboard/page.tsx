"use client";

import {
  DesktopOutlined,
  DownloadOutlined,
  GithubOutlined,
  LoadingOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Drawer,
  Dropdown,
  FloatButton,
  Input,
  Modal,
  message,
  Slider,
  Spin,
  Tooltip,
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
import type { OperationBtnType, PAGE_ATTRIBUTE } from "@/types/resume";
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
    setFileOperationShow,
    setAttributeShow,
  } = useMobilePage();

  useEffect(() => {
    if (chooseId) {
      setAttributeShow(true);
      setFileOperationShow(false);
    } else setAttributeShow(false);
  }, [chooseId, setAttributeShow, setFileOperationShow]);

  useEffect(() => {
    localStorage.setItem(
      "resumeData",
      JSON.stringify(
        resumeData.map((item) => {
          return {
            ...item,
            ref: null,
          };
        }),
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

  const btnList: OperationBtnType[] = [
    {
      handleFunc: () => handleDownload(),
      isTip: false,
      key: "download",
      label: "下载 PDF",
      style: {
        backgroundColor: "var(--app-accent)",
        boxShadow:
          "0 8px 18px color-mix(in srgb, var(--app-accent) 24%, transparent)",
      },
      type: "primary",
    },
    {
      handleFunc: () => setThemeOpen(true),
      isTip: false,
      key: "resumeTheme",
      label: "简历样式",
      style: {
        color: "var(--app-text)",
      },
      type: "link",
    },
    {
      handleFunc: () => setSystemDialogOpen(true),
      isTip: false,
      key: "system",
      label: "系统",
      style: {
        color: "var(--app-text)",
      },
      type: "link",
    },
  ];

  const iconMap: { [key: string]: React.ReactNode } = {
    download: <DownloadOutlined />,
    resumeTheme: <DesktopOutlined />,
    system: <DesktopOutlined />,
  };

  const executeDownload = async () => {
    setDownloadModalOpen(false);
    // 先将文件转成static
    clearChoose();
    setPrintData();

    requestAnimationFrame(async () => {
      // 第二次 rAF: 等待浏览器完成重绘

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

        if (!res.ok)
          return messageApi.open({
            content: "下载出错，请稍后重试~",
            type: "error",
          });

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        messageApi.error("下载出错，请稍后再试~");
      } finally {
        setSpinning(false);
        setPrintResumeData([]);
      }
    });
  };

  const handleDownload = () => {
    setDownloadModalOpen(true);
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
        tip="下载中~"
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
      {/* 系统弹框 */}
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
        <div
          className="z-20 flex h-14 shrink-0 items-center justify-between border-b px-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur md:px-6"
          style={{
            background: "color-mix(in srgb, var(--app-panel) 94%, transparent)",
            borderColor: "var(--app-border)",
          }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
              style={{
                background: "var(--app-panel)",
                borderColor: "var(--app-border)",
              }}
            >
              <Image
                alt="Easy Resume Logo"
                height={26}
                src="/logo.png"
                width={26}
              />
            </div>
            <div className="min-w-0 leading-tight">
              <div
                className="truncate font-semibold text-[15px]"
                style={{ color: "var(--app-text)" }}
              >
                Easy Resume
              </div>
              <div
                className="hidden text-[12px] sm:block"
                style={{ color: "var(--app-textMuted)" }}
              >
                在线简历编辑器
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <AppThemePopover
              mode={mode}
              onModeChange={setMode}
              onThemeChange={setThemeKey}
              themeKey={themeKey}
            />
            {btnList
              .filter((btn) => btn.key !== "download")
              .map((btn) => (
                <Button
                  className="font-medium"
                  icon={iconMap[btn.key]}
                  key={btn.key}
                  onClick={() => btn.handleFunc()}
                  style={btn.style}
                  type={btn.type}
                >
                  {btn.label}
                </Button>
              ))}
            <Tooltip title="Github">
              <Button
                href="https://github.com/Srhui20/easy_resume"
                icon={<GithubOutlined />}
                style={{ color: "var(--app-textMuted)" }}
                type="text"
              />
            </Tooltip>
            <div
              className="mx-2 h-6 w-px"
              style={{ background: "var(--app-border)" }}
            />
            <Button
              className="font-semibold"
              icon={iconMap.download}
              onClick={() => handleDownload()}
              style={btnList[0].style}
              type="primary"
            >
              {btnList[0].label}
            </Button>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <AppThemePopover
              mode={mode}
              onModeChange={setMode}
              onThemeChange={setThemeKey}
              themeKey={themeKey}
            />
            <Button
              className="font-semibold"
              icon={iconMap.download}
              onClick={() => handleDownload()}
              style={btnList[0].style}
              type="primary"
            >
              下载 PDF
            </Button>
            <Dropdown
              menu={{
                items: btnList
                  .filter((item) => item.key !== "download")
                  .map((item) => {
                    return {
                      icon: iconMap[item.key],
                      key: item.key,
                      label: item.label,
                      onClick: item.handleFunc,
                    };
                  }),
              }}
              placement="bottomRight"
            >
              <Button
                shape="circle"
                style={{
                  borderColor: "var(--app-border)",
                  color: "var(--app-text)",
                }}
                type="default"
              >
                <MenuOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1">
            <MainContainer />
          </div>
          <div
            className="hidden w-[380px] shrink-0 border-l md:block xl:w-[420px]"
            style={{
              background: "var(--app-panel)",
              borderColor: "var(--app-border)",
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
              {" "}
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
