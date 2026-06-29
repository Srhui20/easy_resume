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
  gradient?: boolean;
  gradientWidth?: number | string;
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
  color = "color-mix(in srgb, var(--app-accent) 10%, rgba(255,255,255,0.2))",
  size = 1,
  spacing = 24,
  children,
  className,
  style,
  gradient = true,
  gradientWidth = 100,
  gradientHeight = 200,
}: DotProps) {
  const gradientColor = "rgba(255, 255, 255, 0.72)";
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
    [gradientHeight, gradientWidth],
  );

  return (
    <div
      className={cn("relative", className)}
      style={{
        backgroundImage: `radial-gradient(${color} ${size}px, transparent ${size}px)`,
        backgroundPosition: "center top",
        backgroundSize: `calc(${spacing} * ${size}px) calc(${spacing} * ${size}px)`,
        height: "100%",
        position: "relative",
        width: "100%",
        zIndex: 1,
        ...style,
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
          <div
            className={cn(
              "pointer-events-none absolute top-0 left-0 z-2 h-[var(--gradient-height)] w-full",
              "bg-gradient-to-b from-[var(--gradient-color)] to-transparent",
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute bottom-0 left-0 z-2 h-[var(--gradient-height)] w-full rotate-180 transform",
              "bg-gradient-to-b from-[var(--gradient-color)] to-transparent",
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute top-0 left-0 z-2 hidden h-full w-[var(--gradient-width)] md:block",
              "bg-gradient-to-r from-[var(--gradient-color)] to-transparent",
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute top-0 right-0 z-2 hidden h-full w-[var(--gradient-width)] rotate-180 transform md:block",
              "bg-gradient-to-r from-[var(--gradient-color)] to-transparent",
            )}
          />
        </div>
      )}
    </div>
  );
}
