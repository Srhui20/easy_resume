import { type ClassValue, clsx } from "clsx";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

interface DotProps {
  color?: string;
  size?: number;
  spacing?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /**
   * @description Whether to show the gradient or not
   * @type {boolean}
   * @default false
   */
  gradient?: boolean;
  /**
   * @description The width of the gradient on either side
   * @type {number | string}
   * @default 100
   */
  gradientWidth?: number | string;

  /**
   * @description The height of the gradient on either side
   * @type {number | string}
   * @default 200
   */
  gradientHeight?: number | string;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Placeholder() {
  return (
    <div className="flex h-full min-h-48 w-full min-w-48 items-center justify-center">
      <div
        className={cn(
          "pointer-events-none absolute top-0 left-0 z-2 h-full w-[var(--gradient-width)]",
          "bg-gradient-to-r from-black to-transparent",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute top-0 right-0 z-2 h-full w-[var(--gradient-width)] rotate-180 transform",
          "bg-gradient-to-r from-black to-transparent",
        )}
      />
    </div>
  );
}

export function DotBg({
  color = "#cbd5e1",
  size = 1,
  spacing = 20,
  children,
  className,
  gradient = true,
  gradientWidth = 100,
  gradientHeight = 200,
}: DotProps) {
  const gradientColor = "hsl(var(--background))"; // 引用 Tailwind CSS 变量
  const gradientStyle = useMemo(
    () => ({
      ["--gradient-color" as string]: gradientColor,
      ["--gradient-width" as string]:
        typeof gradientWidth === "number"
          ? `${gradientWidth}px`
          : gradientWidth,
      ["--gradient-height" as string]:
        typeof gradientHeight === "number"
          ? `${gradientHeight}px`
          : gradientHeight,
    }),
    [gradientWidth, gradientHeight],
  );
  return (
    <div
      className={cn("relative", className)}
      style={{
        backgroundImage: `radial-gradient(${color} ${size}px, transparent ${size}px)`,
        backgroundSize: `calc(${spacing} * ${size}px) calc(${spacing} * ${size}px)`,
        height: "100%",
        position: "relative",
        width: "100%",
        zIndex: 1,
      }}
    >
      <div
        style={{
          height: "100%",
          position: "relative",
          width: "100%",
          zIndex: 4,
        }}
      >
        {children ?? <Placeholder />}
      </div>
      {gradient && (
        <div style={gradientStyle}>
          {/* 上方渐变蒙版 */}
          <div
            className={cn(
              "pointer-events-none absolute top-0 left-0 z-2 h-[var(--gradient-height)] w-full",
              "bg-gradient-to-b from-[var(--gradient-color)] to-transparent",
            )}
          />
          {/* 下方渐变蒙版 */}
          <div
            className={cn(
              "pointer-events-none absolute bottom-0 left-0 z-2 h-[var(--gradient-height)] w-full rotate-180 transform",
              "bg-gradient-to-b from-[var(--gradient-color)] to-transparent",
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute top-0 left-0 z-2 h-full w-[var(--gradient-width)]",
              "bg-gradient-to-r from-[var(--gradient-color)] to-transparent",
              "hidden md:block",
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute top-0 right-0 z-2 h-full w-[var(--gradient-width)] rotate-180 transform",
              "bg-gradient-to-r from-[var(--gradient-color)] to-transparent",
              "hidden md:block",
            )}
          />
        </div>
      )}
    </div>
  );
}
