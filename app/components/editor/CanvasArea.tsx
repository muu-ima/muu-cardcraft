// app/components/editor/CanvasArea.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
  innerRef: React.RefObject<HTMLDivElement | null>;
  onBackgroundPointerDown?: (e: React.PointerEvent) => void;

  /** 既存互換（当面は受けるだけで使わない） */
  panelVisible?: boolean;
};

export default function CanvasArea({
  children,
  innerRef,
  onBackgroundPointerDown,
}: Props) {
  return (
    <main
      ref={innerRef}
      className={[
        "flex-1 min-w-0 min-h-0",
        "canvas-area-scroll overflow-y-auto overflow-x-auto",
        "px-3 sm:px-6 lg:px-10 py-6",
        "pb-24 xl:pb-0",
      ].join(" ")}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onBackgroundPointerDown?.(e);
      }}
    >
      <div className="min-h-full w-full">
        <div ref={innerRef} className="w-full min-w-0">
          {children}
        </div>
      </div>
    </main>
  );
}
