"use client";

import { useState, useEffect } from "react";
import type { TabKey } from "@/shared/editor";
import { FontKey } from "@/shared/fonts";
import {
  ChevronDown,
  Minus,
  Plus,
  Bold as BoldIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoreHorizontal,
} from "lucide-react";

export type Align = "left" | "center" | "right";

export type CenterToolbarValue = {
  fontKey: FontKey;
  fontSize: number;
  bold: boolean;
  align: Align;
};

type Props = {
  /** テキスト選択中だけ表示（nullなら非表示） */
  value: CenterToolbarValue | null;

  // ✅ 追加（Canvas状態）
  side: "front" | "back";
  onChangeSide: (side: "front" | "back") => void;

  showGuides: boolean;
  onToggleGuides: () => void;

  /** どのパネルが開いてるか（ハイライト用） */
  activeTab: TabKey | null;

  /** ツールバー操作で左パネルを開く */
  onOpenTab: (tab: TabKey) => void;

  /** クイック操作 */
  onChangeFontSize: (next: number) => void;
  onToggleBold: () => void;
  onChangeAlign: (align: Align) => void;

  /** プレビュー中など */
  disabled?: boolean;

  /** 固定位置の微調整など */
  className?: string;

  /** ヘッダー高さに合わせた top（デフォ 76px） */
  topPx?: number;

  /** 表示するか（透明にするだけで高さは確保） */
  visible?: boolean;
  sidePanelOpen: boolean;
};

function useIsNarrowScreen(maxWidth = 1280) {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);

    const update = () => setIsNarrow(mq.matches);
    update(); // 初回

    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [maxWidth]);

  return isNarrow;
}

type MoreMenuProps = {
  children: React.ReactNode;
};

function MoreMenu({ children }: MoreMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-full 
        px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-900/5"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 rounded-2xl bg-white shadow-lg
          border border-zinc-200 z-50
          px-2 py-2 text-xs text-zinc-700
          flex flex-col gap-1"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function CenterToolbar({
  value,
  activeTab,
  onOpenTab,
  onChangeFontSize,
  onToggleBold,
  onChangeAlign,

  // ✅ 追加（表/裏・ガイド）
  side,
  onChangeSide,
  showGuides,
  onToggleGuides,

  disabled = false,
  className,
  visible = true,
  topPx = 76,
  sidePanelOpen,
}: Props) {
  const isFontOpen = activeTab === "font";
  const isTextOpen = activeTab === "text";
  const isNarrow = useIsNarrowScreen(1280); // xl 未満で true
  const compact = sidePanelOpen && isNarrow;

  // ✅ 右側に出したい「表裏トグル＋ガイド」をまとめておく
  const secondaryControls = (
    <>
      <Segmented
        disabled={disabled}
        value={side}
        options={[
          { value: "front", label: "表面" },
          { value: "back", label: "裏面" },
        ]}
        onChange={onChangeSide}
      />

      <GhostButton
        disabled={disabled}
        pressed={showGuides}
        onClick={onToggleGuides}
      >
        ガイド {showGuides ? "ON" : "OFF"}
      </GhostButton>
    </>
  );

  return (
    // ① stickyの席（高さ固定）
    <div
      className={[
        "sticky z-40 flex justify-center h-15 w-full",
        className ?? "",
      ].join(" ")}
      style={{ top: topPx }}
    >
      {/* ② 透明化レイヤー */}
      <div
        className={[
          "transition-opacity duration-150",
          visible ? "opacity-100" : "opacity-0",
          visible ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        {/* ③ ツールバー本体（見た目はここ1回） */}
        <div
          className={[
            "flex h-11 items-center gap-2 rounded-2xl border bg-white/85 px-3 py-2 backdrop-blur",
            "shadow-[0_1px_0_rgba(0,0,0,0.06),0_10px_22px_rgba(0,0,0,0.10)]",
            "min-w-[720px] justify-between whitespace-nowrap",
            compact ? "max-w-[640px]" : "max-w-[820px]",
            value === null ? "opacity-70" : "",
          ].join(" ")}
        >
          {/* ✅ ① テキスト系 */}
          {value && (
            <>
              <GhostButton
                pressed={isFontOpen}
                disabled={disabled}
                onClick={() => onOpenTab("font")}
                className="max-w-[220px]"
                title="フォントを開く"
              >
                <span className="max-w-[180px] truncate">{value.fontKey}</span>
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              </GhostButton>

              <Divider />

              <GhostButton
                ariaLabel="文字サイズを下げる"
                disabled={disabled}
                onClick={() =>
                  onChangeFontSize(clamp(value.fontSize - 1, 6, 200))
                }
              >
                <Minus className="h-4 w-4" />
              </GhostButton>

              <GhostButton
                pressed={isTextOpen}
                disabled={disabled}
                onClick={() => onOpenTab("text")}
                className="min-w-14 justify-center border"
                title="テキスト設定を開く"
              >
                <span className="tabular-nums">{value.fontSize}</span>
              </GhostButton>

              <GhostButton
                ariaLabel="文字サイズを上げる"
                disabled={disabled}
                onClick={() =>
                  onChangeFontSize(clamp(value.fontSize + 1, 6, 200))
                }
              >
                <Plus className="h-4 w-4" />
              </GhostButton>

              <Divider />

              <GhostButton
                ariaLabel="太字"
                pressed={value.bold}
                disabled={disabled}
                onClick={onToggleBold}
              >
                <BoldIcon className="h-4 w-4" />
              </GhostButton>

              <div className="ml-1 flex items-center gap-1">
                <GhostButton
                  ariaLabel="左揃え"
                  pressed={value.align === "left"}
                  disabled={disabled}
                  onClick={() => onChangeAlign("left")}
                >
                  <AlignLeft className="h-4 w-4" />
                </GhostButton>

                <GhostButton
                  ariaLabel="中央揃え"
                  pressed={value.align === "center"}
                  disabled={disabled}
                  onClick={() => onChangeAlign("center")}
                >
                  <AlignCenter className="h-4 w-4" />
                </GhostButton>

                <GhostButton
                  ariaLabel="右揃え"
                  pressed={value.align === "right"}
                  disabled={disabled}
                  onClick={() => onChangeAlign("right")}
                >
                  <AlignRight className="h-4 w-4" />
                </GhostButton>
              </div>
            </>
          )}

          {/* ✅ 右側：表裏 & ガイド → compactのときだけ More に入れる */}
          <div className="flex items-center gap-1">
            {compact ? (
              <MoreMenu>{secondaryControls}</MoreMenu>
            ) : (
              secondaryControls
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function Divider() {
  return <div className="mx-1 h-6 w-px bg-black/10" />;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function GhostButton({
  children,
  onClick,
  pressed,
  disabled,
  className,
  title,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={ariaLabel}
      aria-pressed={!!pressed}
      disabled={disabled}
      onClick={() => !disabled && onClick()}
      className={[
        "inline-flex h-9 items-center gap-2 rounded-xl px-2.5 text-sm",
        "select-none",
        "hover:bg-black/5 active:bg-black/10",
        pressed ? "bg-pink-50 ring-1 ring-inset ring-pink-200" : "",
        disabled ? "opacity-60 cursor-not-allowed" : "",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
  disabled,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-xl border bg-white">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => !disabled && onChange(opt.value)}
            className={[
              "h-9 px-3 text-sm",
              active
                ? "bg-pink-50 ring-1 ring-inset ring-pink-200"
                : "hover:bg-zinc-50",
              disabled ? "cursor-not-allowed opacity-70" : "",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
