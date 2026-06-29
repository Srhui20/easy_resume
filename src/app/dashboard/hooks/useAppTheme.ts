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
  colors: ThemePalette;
};

const STORAGE_KEY = "easyResumeAppTheme";
const MODE_STORAGE_KEY = "easyResumeAppThemeMode";

export const appThemes: AppTheme[] = [
  {
    color: "#2563eb",
    hoverColor: "#1d4ed8",
    key: "default",
    name: "经典蓝",
    softColor: "#dbeafe",
  },
  {
    color: "#0f766e",
    hoverColor: "#115e59",
    key: "stableGreen",
    name: "森林简报",
    softColor: "#d1fae5",
  },
  {
    color: "#475569",
    hoverColor: "#334155",
    key: "neutralGray",
    name: "石板桌面",
    softColor: "#e2e8f0",
  },
  {
    color: "#c2410c",
    hoverColor: "#9a3412",
    key: "strongRed",
    name: "陶土暖棕",
    softColor: "#ffedd5",
  },
  {
    color: "#be185d",
    hoverColor: "#9d174d",
    key: "rose",
    name: "玫瑰信笺",
    softColor: "#fce7f3",
  },
  {
    color: "#5b21b6",
    hoverColor: "#4c1d95",
    key: "purple",
    name: "皇家初紫",
    softColor: "#ede9fe",
  },
  {
    color: "#d97706",
    hoverColor: "#b45309",
    key: "brightYellow",
    name: "金色标记",
    softColor: "#fef3c7",
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
      accentSoft: "color-mix(in srgb, var(--app-accent) 18%, #0f172a)",
      bg: "#08111f",
      border: "color-mix(in srgb, var(--app-accent) 28%, #233876)",
      canvas: "#0a1020",
      panel: "rgba(10, 18, 36, 0.92)",
      panelAlt: "#101a33",
      text: "#eff6ff",
      textMuted: "#b6c7ea",
    };
  }

  return {
    accent: theme.color,
    accentHover: theme.hoverColor,
    accentSoft: theme.softColor,
    bg: "color-mix(in srgb, var(--app-accent) 4%, #f8fbff)",
    border: "color-mix(in srgb, var(--app-accent) 16%, #d9e4f5)",
    canvas: "color-mix(in srgb, var(--app-accent) 8%, #eef4ff)",
    panel: "rgba(255, 255, 255, 0.9)",
    panelAlt: "color-mix(in srgb, var(--app-accent) 4%, #f8fbff)",
    text: "#1e293b",
    textMuted: "#5b6b85",
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
        borderRadius: 16,
        colorBgContainer: currentTheme.colors.panel,
        colorBgElevated: currentTheme.colors.panel,
        colorBorder: currentTheme.colors.border,
        colorInfo: currentTheme.colors.accent,
        colorLink: currentTheme.colors.accent,
        colorPrimary: currentTheme.colors.accent,
        colorText: currentTheme.colors.text,
        colorTextSecondary: currentTheme.colors.textMuted,
        controlHeight: 40,
        fontFamily: "var(--app-body)",
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
