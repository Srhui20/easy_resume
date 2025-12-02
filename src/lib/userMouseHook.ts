import { useEffect, useRef, useState } from "react";

export function useZoom() {
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

  return { scale };
}

export function useMousePosition() {
  const moveRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const moveElement = moveRef.current;
    if (!moveElement) return;

    // moveElement.scrollLeft =
    //   (moveElement.scrollHeight - moveElement.clientHeight) / 2;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 1) return;
      e.preventDefault();
      isDragging.current = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      moveElement.scrollTop = moveElement.scrollTop - e.movementY;
      moveElement.scrollLeft = moveElement.scrollLeft - e.movementX;
      document.body.style.cursor = "grabbing";
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 1) return;
      isDragging.current = false;
      document.body.style.cursor = "default";
    };

    moveElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      moveElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  useEffect(() => {
    const moveElement = moveRef.current;
    if (!moveElement) return;
    const handleMouseDown = (e: MouseEvent) => {
      // 只有 Ctrl + 左键 才能拖动
      if (e.button !== 0 || (!e.ctrlKey && !e.metaKey)) return;
      e.preventDefault();
      isDragging.current = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      moveElement.scrollTop -= e.movementY;
      moveElement.scrollLeft -= e.movementX;
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
  });

  return {
    moveRef,
  };
}
