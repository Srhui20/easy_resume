import { useEffect, useRef } from "react";
import { usePublicStore } from "../store/public";

export function useMouseOpeartion() {
  const moveRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const scale = usePublicStore((state) => state.scale);

  // useEffect(() => {
  //   const handleWheel = (e: WheelEvent) => {
  //     if (!e.ctrlKey && !e.metaKey) return;
  //     e.preventDefault();
  //     const delta = e.deltaY < 0 ? 0.1 : -0.1;
  //     setScale((prev) => {
  //       let newScale = +(prev + delta).toFixed(1);
  //       if (newScale <= 0.3) newScale = 0.3; // 最小缩放
  //       if (newScale > 1.5) newScale = 1.5; // 最大缩放
  //       return newScale;
  //     });
  //   };
  //   document.body.addEventListener("wheel", handleWheel, { passive: false });
  //   return () => document.body.removeEventListener("wheel", handleWheel);
  // }, []);

  useEffect(() => {
    const moveElement = moveRef.current;
    if (!moveElement) return;

    // moveElement.scrollLeft =
    //   (moveElement.scrollHeight - moveElement.clientHeight) / 2;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        // 中键拖动
        e.preventDefault();
        isDragging.current = true;
      } else if (e.button === 0 && (e.ctrlKey || e.metaKey)) {
        // Ctrl/Command + 左键拖动
        e.preventDefault();
        isDragging.current = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      // 根据缩放比例适当调整拖动速度，保证放大后依然可明显拖动
      const baseSpeed = 1;
      const factor = 1 / scale; // 放大越大，单位拖动越小，但不会接近 0

      moveElement.scrollTop =
        moveElement.scrollTop - e.movementY * baseSpeed * factor;
      moveElement.scrollLeft =
        moveElement.scrollLeft - e.movementX * baseSpeed * factor;

      document.body.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "default";
    };

    moveElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // 清理函数，避免重复绑定导致拖动越来越快
    return () => {
      moveElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scale]);

  return {
    moveRef,
    scale,
  };
}
