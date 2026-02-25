// app/components/editor/BottomSheet.tsx
"use client";

import React, { useEffect, useRef } from "react";

export type SheetSnap = "collapsed" | "half" | "full";

const SHEET_HEIGHT: Record<Exclude<SheetSnap, "collapsed">, string> = {
  half: "40dvh",
  full: "85dvh",
};

export default function BottomSheet({
  snap,
  onChangeSnap,
  onClose,
  title,
  children,
}: {
  snap: SheetSnap;
  onChangeSnap: (v: SheetSnap) => void;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const open = snap !== "collapsed";
  const toggleSnap = () => {
    onChangeSnap(snap === "half" ? "full" : "half");
  };

  // ✅ Hooksは常に同じ順で呼ぶ（条件分岐はeffect内で）
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const height = SHEET_HEIGHT[snap]; // snap は half|full のみ

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <button
        type="button"
        aria-label="Close bottom sheet"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="
          absolute bottom-0 left-0 w-full
          rounded-t-2xl bg-white shadow-xl
          outline-none
          transition-[height] duration-200
        "
        onClick={(e) => e.stopPropagation()}
        style={{
          height,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="sticky top-0 z-10 rounded-t-2xl bg-transparent">
          <button
            type="button"
            aria-label="Resize bottom sheet"
            onClick={toggleSnap}
            className="flex w-full justify-center pt-2"
          >
            <span className="h-1.5 w-12 rounded-full bg-zinc-300" />
          </button>

          <div className="flex items-center justify-between px-4 pt-2 pb-3">
            <div className="text-sm font-semibold text-zinc-800">
              {title ?? "編集"}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-900/5"
            >
              閉じる
            </button>
          </div>

          <div className="h-px bg-zinc-200" />
        </div>

        <div className="h-[calc(100%-56px)] overflow-y-auto px-4 pt-3 pb-24">
          {children}
        </div>
      </div>
    </div>
  );
}
