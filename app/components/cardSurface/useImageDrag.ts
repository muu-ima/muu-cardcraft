"use client";

import { useCallback, useState } from "react";
import type React from "react";
import type { CardImage } from "@/shared/images";

type DragImageState = {
  id: string;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
} | null;

type Args = {
  interactive: boolean;
  onMoveImage?: (id: string, x: number, y: number) => void;
};

export function useImageDrag({ interactive, onMoveImage }: Args) {
  const [dragImage, setDragImage] = useState<DragImageState>(null);

  const handleImagePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, img: CardImage) => {
      const target = e.target as HTMLElement;
      const isResizeHandle = target.closest("[data-resize-handle='true']");
      if (isResizeHandle) return;

      if (!interactive) return;
      if (!onMoveImage) return;

      e.preventDefault();
      e.stopPropagation();

      setDragImage({
        id: img.id,
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: img.x,
        startY: img.y,
      });
    },
    [interactive, onMoveImage],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragImage) return;
      if (!onMoveImage) return;
      if (e.pointerId !== dragImage.pointerId) return;

      const dx = e.clientX - dragImage.startClientX;
      const dy = e.clientY - dragImage.startClientY;

      const nextX = dragImage.startX + dx;
      const nextY = dragImage.startY + dy;

      onMoveImage(dragImage.id, nextX, nextY);
    },
    [dragImage, onMoveImage],
  );

  const endImageDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragImage) return;
      if (e.pointerId !== dragImage.pointerId) return;
      setDragImage(null);
    },
    [dragImage],
  );

  return {
    dragImage,
    handleImagePointerDown,
    handlePointerMove,
    endImageDrag,
  };
}
