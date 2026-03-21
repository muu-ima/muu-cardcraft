// app/components/ModalPreview.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { CARD_BASE_W, CARD_BASE_H } from "@/shared/print";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: (opts: { scale: number }) => ReactNode;
};

export default function ModalPreview({
  open,
  onClose,
  title,
  children,
}: ModalProps) {
  // ✅ Hooks は常に呼ばれる（ここ重要）
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [wrapSize, setWrapSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!open) return; // ← effect の中でガードするのはOK

    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      setWrapSize({ w: r.width, h: r.height });
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, [open]);

  const PREVIEW_PAD = 24;

  const scale = useMemo(() => {
    const s = Math.min(
      (wrapSize.w - PREVIEW_PAD) / CARD_BASE_W,
      (wrapSize.h - PREVIEW_PAD) / CARD_BASE_H,
      1,
    );
    return Math.max(0.1, s);
  }, [wrapSize.w, wrapSize.h]);

  // ✅ return null は Hooks の「後」
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold sm:text-base">
            {title ?? "プレビュー"}
          </h2>
          <button
            onClick={onClose}
            className="text-xl leading-none text-zinc-500 hover:text-zinc-800"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-3 py-3 sm:px-4 sm:py-4">
          <div
            ref={wrapRef}
            className="w-full min-h-60 flex items-center justify-center"
          >
            {children({ scale })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full border px-4 py-2 text-sm hover:bg-zinc-100"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
