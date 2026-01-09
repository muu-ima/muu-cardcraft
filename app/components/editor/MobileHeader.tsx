// app/components/editor/MobileHeader.tsx
"use client";

import React from "react";
import {
  Home,
  Eye,
  Pencil,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

type Align = "left" | "center" | "right";

type Props = {
  isPreview: boolean;
  onTogglePreview: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onHome: () => void;
  onChangeAlign?: (align: Align) => void;
};

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={[
        "inline-flex h-10 w-10 items-center justify-center rounded-xl",
        "text-zinc-700 hover:bg-zinc-900/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function MobileHeader({
  isPreview,
  onTogglePreview,
  onUndo,
  onRedo,
  onHome,
  onChangeAlign,
}: Props) {
  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 xl:hidden",
        "h-14",
        "border-b bg-white/85 backdrop-blur",
        "px-3",
      ].join(" ")}
    >
      <div className="mx-auto flex h-full max-w-[520px] items-center justify-between">
        {/* Left: Home */}
        <div className="flex items-center gap-1">
          <IconButton label="ホーム" onClick={onHome}>
            <Home size={20} strokeWidth={1.75} />
          </IconButton>
        </div>

        {/* Center: Preview toggle */}
        <button
          type="button"
          onClick={onTogglePreview}
          className={[
            "inline-flex items-center gap-2 rounded-xl px-3 py-2",
            "text-sm font-medium",
            isPreview
              ? "bg-pink-500/15 text-pink-700"
              : "text-zinc-700 hover:bg-zinc-900/5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/30",
          ].join(" ")}
        >
          {isPreview ? (
            <>
              <Pencil size={18} strokeWidth={1.75} />
              編集
            </>
          ) : (
            <>
              <Eye size={18} strokeWidth={1.75} />
            </>
          )}
        </button>
        {/* 仮置き : 整列 3 ボタン*/}
        {onChangeAlign && (
          <div className="ml-1 flex items-center gap-0.5 rounded-xl bg-zinc-50 px-1 py-0.5">
            <IconButton label="左揃え" onClick={() => onChangeAlign("left")}>
              <AlignLeft size={18} strokeWidth={1.75} />
            </IconButton>
            <IconButton
              label="中央揃え"
              onClick={() => onChangeAlign("center")}
            >
              <AlignCenter></AlignCenter>
            </IconButton>
            <IconButton label="右揃え" onClick={() => onChangeAlign("right")}>
              <AlignRight></AlignRight>
            </IconButton>
          </div>
        )}

        {/* Right: Undo/Redo */}
        <div className="flex items-center gap-1">
          <IconButton label="元に戻す" onClick={onUndo}>
            <Undo2 size={20} strokeWidth={1.75} />
          </IconButton>
          <IconButton label="やり直し" onClick={onRedo}>
            <Redo2 size={20} strokeWidth={1.75} />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
