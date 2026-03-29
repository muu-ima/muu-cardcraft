"use client";

import { useMemo } from "react";

// scale は block pointer down 時に下流へ渡す interactionScale
type Args = {
  scale: number;
  onSurfacePointerDown?: () => void;
  onSelectImage: (id: string | null) => void;
  onPointerDown?: (
    e: React.PointerEvent,
    id: string,
    opts: { scale: number },
  ) => void;
};

export function useEditorCanvasHandlers({
  scale,
  onSurfacePointerDown,
  onSelectImage,
  onPointerDown,
}: Args) {
  return useMemo(
    () => ({
      handleSurfacePointerDown: () => {
        onSurfacePointerDown?.();
        onSelectImage(null);
      },

      handleBlockPointerDown: (e: React.PointerEvent, id: string) => {
        onPointerDown?.(e, id, { scale });
      },
    }),
    [scale, onSurfacePointerDown, onSelectImage, onPointerDown],
  );
}
