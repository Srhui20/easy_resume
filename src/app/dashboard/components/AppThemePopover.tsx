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
    <div className="w-[196px] py-1">
      <div className="px-3 pt-2 pb-2 font-semibold text-[14px]">模式</div>
      <div className="pb-1">
        {modeList.map((modeItem) => (
          <button
            className="flex h-9 w-full items-center gap-2.5 px-3 text-left text-[14px] transition-colors hover:bg-[var(--app-accentSoft)]"
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

      <div className="border-[var(--app-border)] border-t px-3 pt-3 pb-2 font-semibold text-[14px]">
        主题色
      </div>
      <div className="pb-1">
        {appThemes.map((themeItem) => (
          <button
            className="flex h-9 w-full items-center gap-2.5 px-3 text-left text-[14px] transition-colors hover:bg-[var(--app-accentSoft)]"
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
        body: {
          borderRadius: 10,
          boxShadow:
            "0 16px 42px rgba(15, 23, 42, 0.16), 0 2px 8px rgba(15, 23, 42, 0.08)",
          padding: 0,
        },
      }}
      trigger="click"
    >
      <Button
        aria-label="页面主题"
        icon={<BgColorsOutlined />}
        style={{
          color: "var(--app-text)",
        }}
        type="text"
      />
    </Popover>
  );
}
