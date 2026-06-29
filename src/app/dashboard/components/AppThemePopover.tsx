"use client";

import {
  BgColorsOutlined,
  CheckOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Button, Popover } from "antd";
import type { ReactNode } from "react";
import {
  type AppThemeKey,
  type AppThemeMode,
  appThemes,
} from "../hooks/useAppTheme";

type AppThemePopoverProps = {
  mode: AppThemeMode;
  onModeChange: (mode: AppThemeMode) => void;
  onThemeChange: (themeKey: AppThemeKey) => void;
  themeKey: AppThemeKey;
};

const modeList: Array<{
  icon: ReactNode;
  key: AppThemeMode;
  label: string;
}> = [
  {
    icon: <SunOutlined />,
    key: "light",
    label: "浅色",
  },
  {
    icon: <MoonOutlined />,
    key: "dark",
    label: "深色",
  },
];

export function AppThemePopover({
  mode,
  onModeChange,
  onThemeChange,
  themeKey,
}: AppThemePopoverProps) {
  const content = (
    <div className="w-[240px] py-2">
      <div className="px-4 pt-2 font-semibold text-[11px] text-[var(--app-textMuted)] uppercase tracking-[0.24em]">
        外观
      </div>
      <div className="px-4 pt-1 pb-3">
        <div className="font-[var(--app-heading)] text-[18px] text-[var(--app-text)]">
          系统主题
        </div>
        <div className="text-[12px] text-[var(--app-textMuted)]">
          选择界面的显示模式与主题色。
        </div>
      </div>
      <div className="pb-1">
        {modeList.map((modeItem) => (
          <button
            className="flex h-10 w-full cursor-pointer items-center gap-2.5 px-4 text-left text-[14px] transition-colors hover:bg-[var(--app-accentSoft)]"
            key={modeItem.key}
            onClick={() => onModeChange(modeItem.key)}
            type="button"
          >
            <span className="flex w-5 justify-center text-[17px] text-[var(--app-textMuted)]">
              {modeItem.icon}
            </span>
            <span className="min-w-0 flex-1">{modeItem.label}</span>
            {mode === modeItem.key && (
              <CheckOutlined className="text-[var(--app-accent)]" />
            )}
          </button>
        ))}
      </div>

      <div className="border-[var(--app-border)] border-t px-4 pt-3 pb-2 font-semibold text-[11px] text-[var(--app-textMuted)] uppercase tracking-[0.24em]">
        主题色
      </div>
      <div className="pb-1">
        {appThemes.map((themeItem) => (
          <button
            className="flex h-10 w-full cursor-pointer items-center gap-3 px-4 text-left text-[14px] transition-colors hover:bg-[var(--app-accentSoft)]"
            key={themeItem.key}
            onClick={() => onThemeChange(themeItem.key)}
            type="button"
          >
            <span
              className="h-[18px] w-[18px] rounded-full border border-white shadow-[0_0_0_1px_rgba(15,23,42,0.16)]"
              style={{ background: themeItem.color }}
            />
            <span className="min-w-0 flex-1">{themeItem.name}</span>
            {themeKey === themeItem.key && (
              <CheckOutlined className="text-[var(--app-accent)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Popover
      arrow={false}
      content={content}
      placement="bottomRight"
      styles={{
        container: {
          borderRadius: 20,
          boxShadow:
            "0 16px 42px rgba(15, 23, 42, 0.16), 0 2px 8px rgba(15, 23, 42, 0.08)",
          padding: 0,
        },
      }}
      trigger="click"
    >
      <Button
        aria-label="系统主题"
        icon={<BgColorsOutlined />}
        style={{
          background: "transparent",
          border: "none",
          boxShadow: "none",
          color: "var(--app-text)",
          height: 36,
        }}
        type="default"
      >
        系统主题
      </Button>
    </Popover>
  );
}
