"use client";

import { useEffect, useState } from "react";
import {
  IMAGE_MIN_W,
  IMAGE_MIN_H,
  IMAGE_MAX_W,
  IMAGE_MAX_H,
  clamp,
} from "@/shared/images";

type UseCanvasResizeArgs = {
  scale: number;
  resizeImage: (id: string, w: number, h: number) => void;
  onChangeWidth?: (id: string, width: number) => void;
  blockRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
};

export function useCanvasResize({
  scale,
  resizeImage,
  onChangeWidth,
  blockRefs,
}: UseCanvasResizeArgs) {
  const [resizeState, setResizeState] = useState<{
    id: string;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);

  const [resizeBlockState, setResizeBlockState] = useState<{
    id: string;
    pointerId: number;
    startX: number;
    startWidth: number;
  } | null>(null);

  const onResizeStart = (
    e: React.PointerEvent,
    image: { id: string; w: number; h: number },
  ) => {
    e.stopPropagation();

    setResizeState({
      id: image.id,
      startX: e.clientX,
      startY: e.clientY,
      startW: image.w,
      startH: image.h,
    });
  };

  const onResizeBlockStart = (
    e: React.PointerEvent,
    block: { id: string; width?: number },
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const el = blockRefs.current[block.id];
    const renderedWidth = el
      ? el.getBoundingClientRect().width / scale
      : undefined;

    setResizeBlockState({
      id: block.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startWidth: block.width ?? renderedWidth ?? 40,
    });
  };

  useEffect(() => {
    if (!resizeState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const dx = (e.clientX - resizeState.startX) / scale;
      const dy = (e.clientY - resizeState.startY) / scale;

      const nextW = clamp(resizeState.startW + dx, IMAGE_MIN_W, IMAGE_MAX_W);
      const nextH = clamp(resizeState.startH + dy, IMAGE_MIN_H, IMAGE_MAX_H);

      resizeImage(resizeState.id, nextW, nextH);
    };

    const handlePointerUp = () => {
      setResizeState(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [resizeState, scale, resizeImage]);

  useEffect(() => {
    if (!resizeBlockState) return;
    if (!onChangeWidth) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerId !== resizeBlockState.pointerId) return;

      const dx = (e.clientX - resizeBlockState.startX) / scale;
      const nextWidth = Math.max(40, resizeBlockState.startWidth + dx);

      onChangeWidth(resizeBlockState.id, nextWidth);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerId !== resizeBlockState.pointerId) return;
      setResizeBlockState(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [resizeBlockState, scale, onChangeWidth]);

  return {
    onResizeStart,
    onResizeBlockStart,
  };
}
