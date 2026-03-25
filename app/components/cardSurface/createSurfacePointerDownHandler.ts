import type React from "react";

type Args = {
  interactive: boolean;
  onSurfacePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export function createSurfacePointerDownHandler({
  interactive,
  onSurfacePointerDown,
}: Args) {
  return (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;

    const target = e.target as HTMLElement;
    const hitBlock = target.closest("[data-block-id]");
    const hitImage = target.closest("[data-image-id]");

    if (!hitBlock && !hitImage) {
      onSurfacePointerDown?.(e);
    }
  };
}
