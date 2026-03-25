"use client";

import React from "react";
import {
  Type,
  TextCursor,
  Image as ImageIcon,
  ImagePlus,
  Download,
  Undo2,
  Redo2,
  Eye,
  Pencil,
  Layers,
} from "lucide-react";
import type { TabKey } from "@/shared/editor";

type Props = {
  activeTab: TabKey | null;
  onChange: (tab: TabKey) => void;
  onUndo: () => void;
  onRedo: () => void;

  isPreview: boolean;
  onTogglePreview: () => void;
};

const tools: { key: TabKey; label: string; Icon: React.ElementType }[] = [
  { key: "text", label: "文字", Icon: Type },
  { key: "font", label: "フォント", Icon: TextCursor },
  { key: "design", label: "背景", Icon: ImageIcon },
  { key: "image", label: "画像", Icon: ImagePlus },
  { key: "layers", label: "レイヤー", Icon: Layers },
  { key: "export", label: "書き出し", Icon: Download },
];

function ToolButton({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative",
        "flex w-14 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5",
        "transition",
        active
          ? "bg-pink-500/15 text-pink-700"
          : "text-zinc-500 hover:bg-zinc-900/5 hover:text-zinc-800",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/35",
      ].join(" ")}
    >
      <span className="flex h-5 items-center justify-center">{children}</span>
      <span className="text-[10px] leading-none">{label}</span>
    </button>
  );
}

function ActionButton({
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
      onClick={onClick}
      aria-label={label}
      className={[
        "group relative",
        "flex w-14 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5",
        "transition",
        "text-zinc-500 hover:bg-zinc-900/5 hover:text-zinc-800",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
      ].join(" ")}
    >
      <span className="flex h-5 items-center justify-center">{children}</span>
      <span className="text-[10px] leading-none">{label}</span>
    </button>
  );
}

export default function Toolbar({
  activeTab,
  onChange,
  onUndo,
  onRedo,
  isPreview,
  onTogglePreview,
}: Props) {
  return (
    <div className="flex h-full w-full min-h-0 flex-col px-2 py-3">
      {/* 上：スクロール領域 */}
      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center gap-2">
          {tools.map(({ key, label, Icon }) => (
            <ToolButton
              key={key}
              label={label}
              active={activeTab === key}
              onClick={() => onChange(key)}
            >
              <Icon size={22} strokeWidth={1.75} />
            </ToolButton>
          ))}
        </div>
      </div>

      {/* 下：固定領域 */}
      <div className="shrink-0 pt-3">
        <div className="flex flex-col items-center gap-2">
          {/* Preview */}
          <ToolButton
            label={isPreview ? "編集モード" : "プレビュー"}
            active={isPreview}
            onClick={onTogglePreview}
          >
            {isPreview ? (
              <Pencil size={22} strokeWidth={1.75} />
            ) : (
              <Eye size={22} strokeWidth={1.75} />
            )}
          </ToolButton>

          {/* Undo / Redo */}
          <ActionButton label="元に戻す" onClick={onUndo}>
            <Undo2 size={22} strokeWidth={1.75} />
          </ActionButton>

          <ActionButton label="やり直し" onClick={onRedo}>
            <Redo2 size={22} strokeWidth={1.75} />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
