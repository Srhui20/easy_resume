import { useEffect, useRef, useState } from "react";

export function useMouseOpeartion() {
  const moveRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setScale((prev) => {
        let newScale = +(prev + delta).toFixed(1);
        if (newScale <= 0.3) newScale = 0.3; // 最小缩放
        if (newScale > 2) newScale = 2; // 最大缩放
        return newScale;
      });
    };
    document.body.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.body.removeEventListener("wheel", handleWheel);
  }, []);

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
      let i = 1;
      if (scale > 1) {
        i = scale / 100;
      } else {
        i = scale / 3;
      }
      moveElement.scrollTop = moveElement.scrollTop - e.movementY * i;
      moveElement.scrollLeft = moveElement.scrollLeft - e.movementX * i;

      document.body.style.cursor = "grabbing";
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "default";
    };

    moveElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  });

  return {
    moveRef,
    scale,
  };
}
