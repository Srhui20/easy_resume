"use client";

import { theme as antdThemeAlgorithm, type ThemeConfig } from "antd";
import { useEffect, useMemo, useState } from "react";

export type AppThemeKey =
  | "default"
  | "stableGreen"
  | "neutralGray"
  | "strongRed"
  | "rose"
  | "purple"
  | "brightYellow";
export type AppThemeMode = "light" | "dark";

type AppTheme = {
  key: AppThemeKey;
  name: string;
  color: string;
  hoverColor: string;
  softColor: string;
};

type ThemePalette = {
  accent: string;
  accentHover: string;
  accentSoft: string;
  bg: string;
  border: string;
  canvas: string;
  panel: string;
  panelAlt: string;
  text: string;
  textMuted: string;
};

type AppThemeState = {
  mode: AppThemeMode;
  themeKey: AppThemeKey;
};

type AppThemeResult = {
  key: AppThemeKey;
  mode: AppThemeMode;
  name: string;
  colors: {
    accent: string;
    accentHover: string;
    accentSoft: string;
    bg: string;
    border: string;
    canvas: string;
    panel: string;
    panelAlt: string;
    text: string;
    textMuted: string;
  };
};

const STORAGE_KEY = "easyResumeAppTheme";
const MODE_STORAGE_KEY = "easyResumeAppThemeMode";

export const appThemes: AppTheme[] = [
  {
    color: "#2563eb",
    hoverColor: "#1d4ed8",
    key: "default",
    name: "默认",
    softColor: "#eff6ff",
  },
  {
    color: "#16a34a",
    hoverColor: "#15803d",
    key: "stableGreen",
    name: "稳定绿",
    softColor: "#ecfdf5",
  },
  {
    color: "#27272a",
    hoverColor: "#18181b",
    key: "neutralGray",
    name: "中性灰",
    softColor: "#f4f4f5",
  },
  {
    color: "#dc2626",
    hoverColor: "#b91c1c",
    key: "strongRed",
    name: "强调红",
    softColor: "#fef2f2",
  },
  {
    color: "#e11d48",
    hoverColor: "#be123c",
    key: "rose",
    name: "玫瑰红",
    softColor: "#fff1f2",
  },
  {
    color: "#7c3aed",
    hoverColor: "#6d28d9",
    key: "purple",
    name: "紫罗兰",
    softColor: "#f5f3ff",
  },
  {
    color: "#f2b705",
    hoverColor: "#d99a00",
    key: "brightYellow",
    name: "明亮黄",
    softColor: "#fffbeb",
  },
];

const fallbackTheme = appThemes[0];

function getThemeByKey(themeKey: string | null) {
  return (
    appThemes.find((themeItem) => themeItem.key === themeKey) ?? fallbackTheme
  );
}

function getMode(mode: string | null): AppThemeMode {
  return mode === "dark" ? "dark" : "light";
}

function buildPalette(theme: AppTheme, mode: AppThemeMode): ThemePalette {
  if (mode === "dark") {
    return {
      accent: theme.color,
      accentHover: theme.hoverColor,
      accentSoft: "color-mix(in srgb, var(--app-accent) 20%, #1f2937)",
      bg: "#111827",
      border: "#475569",
      canvas: "#0b1220",
      panel: "#1e293b",
      panelAlt: "#172033",
      text: "#f8fafc",
      textMuted: "#d6dee9",
    };
  }

  return {
    accent: theme.color,
    accentHover: theme.hoverColor,
    accentSoft: theme.softColor,
    bg:
      theme.key === "default"
        ? "#f5f7fb"
        : "color-mix(in srgb, var(--app-accent) 7%, #f8fafc)",
    border:
      theme.key === "default"
        ? "#dbe4f0"
        : "color-mix(in srgb, var(--app-accent) 22%, #dbe4f0)",
    canvas:
      theme.key === "default"
        ? "#eef3fb"
        : "color-mix(in srgb, var(--app-accent) 12%, #eef3fb)",
    panel: "#ffffff",
    panelAlt: "color-mix(in srgb, var(--app-accent) 5%, #fbfcfe)",
    text: "#111827",
    textMuted: "#64748b",
  };
}

export function useAppTheme() {
  const [themeState, setThemeState] = useState<AppThemeState>({
    mode: "light",
    themeKey: fallbackTheme.key,
  });

  useEffect(() => {
    const savedTheme = getThemeByKey(localStorage.getItem(STORAGE_KEY));
    const savedMode = getMode(localStorage.getItem(MODE_STORAGE_KEY));
    setThemeState({
      mode: savedMode,
      themeKey: savedTheme.key,
    });
  }, []);

  useEffect(() => {
    const theme = getThemeByKey(themeState.themeKey);
    const colors = buildPalette(theme, themeState.mode);
    const root = document.documentElement;

    root.dataset.appTheme = theme.key;
    root.dataset.appThemeMode = themeState.mode;
    for (const [key, value] of Object.entries(colors)) {
      root.style.setProperty(`--app-${key}`, value);
    }
    localStorage.setItem(STORAGE_KEY, theme.key);
    localStorage.setItem(MODE_STORAGE_KEY, themeState.mode);
  }, [themeState]);

  const currentTheme = useMemo<AppThemeResult>(() => {
    const theme = getThemeByKey(themeState.themeKey);
    return {
      colors: buildPalette(theme, themeState.mode),
      key: theme.key,
      mode: themeState.mode,
      name: theme.name,
    };
  }, [themeState]);

  const antdTheme = useMemo<ThemeConfig>(
    () => ({
      algorithm:
        currentTheme.mode === "dark"
          ? antdThemeAlgorithm.darkAlgorithm
          : antdThemeAlgorithm.defaultAlgorithm,
      token: {
        borderRadius: 6,
        colorBgContainer: currentTheme.colors.panel,
        colorBgElevated: currentTheme.colors.panel,
        colorBorder: currentTheme.colors.border,
        colorInfo: currentTheme.colors.accent,
        colorLink: currentTheme.colors.accent,
        colorPrimary: currentTheme.colors.accent,
        colorText: currentTheme.colors.text,
        colorTextSecondary: currentTheme.colors.textMuted,
      },
    }),
    [currentTheme],
  );

  return {
    antdTheme,
    currentTheme,
    mode: themeState.mode,
    setMode: (mode: AppThemeMode) =>
      setThemeState((current) => ({ ...current, mode })),
    setThemeKey: (themeKey: AppThemeKey) =>
      setThemeState((current) => ({ ...current, themeKey })),
    themeKey: themeState.themeKey,
  };
}
