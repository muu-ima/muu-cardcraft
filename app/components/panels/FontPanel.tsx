// app/components/panels/FontPanel.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import type { Block } from "@/shared/blocks";
import FontTab from "@/app/components/tabs/FontTab";
import PanelSection from "@/app/components/panels/PanelSection";
import { FONT_DEFINITIONS, type FontKey } from "@/shared/fonts";
import clsx from "clsx";

type Props = {
  blocks: Block[];
  activeBlockId: string;
  onChangeFont: (id: string, fontKey: FontKey) => void;
  onChangeColor: (id: string, color: string) => void;
};

type FontCategory = "basic" | "script" | "pop";

const FONT_CATEGORIES: Record<
  FontCategory,
  { label: string; keys: FontKey[] }
> = {
  basic: {
    label: "ベーシック",
    keys: ["sans", "maru", "serif"],
  },
  script: {
    label: "筆記体",
    keys: ["script1", "script2", "script3"].filter(
      (k) => k in FONT_DEFINITIONS,
    ) as FontKey[],
  },
  pop: {
    label: "ポップ",
    keys: ["pop1", "pop2", "pop3"].filter(
      (k) => k in FONT_DEFINITIONS,
    ) as FontKey[],
  },
};

const TEXT_COLORS = [
  { id: "dark", label: "ダーク", value: "#111827" }, // text-gray-900
  { id: "gray", label: "グレー", value: "#4B5563" }, // text-gray-600
  { id: "white", label: "白", value: "#FFFFFF" },
  { id: "pink", label: "ピンク", value: "#EC4899" },
  { id: "orange", label: "オレンジ", value: "#F97316" },
  { id: "yellow", label: "黄", value: "#FACC15" },
  { id: "green", label: "緑", value: "#10B981" },
  { id: "cyan", label: "シアン", value: "#0EA5E9" },
  { id: "indigo", label: "藍", value: "#6366F1" },
] as const;

export default function FontPanel({
  blocks,
  activeBlockId,
  onChangeFont,
  onChangeColor,
}: Props) {
  const value = blocks.find((b) => b.id === activeBlockId)?.fontKey ?? "sans";
  const activeBlock =
    blocks.find((b) => b.id === activeBlockId && b.type === "text") ?? null;
  // ⭐ カテゴリ state
  const [activeCategory, setActiveCategory] = useState<FontCategory>("basic");

  const [showColorPicker, setShowColorPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  // 現在の色（未設定ならデフォルト）
  const currentColor = useMemo(() => {
    return activeBlock?.color ?? "#111827";
  }, [activeBlock?.color]);

  // 今のカテゴリ内のフォントのみ取り出す
  const keys = FONT_CATEGORIES[activeCategory].keys;
  const fonts = keys.map((key) => {
    const def = FONT_DEFINITIONS[key];
    return {
      key,
      label: def.label,
      css: def.css,
    };
  });

  useEffect(() => {
    if (!showColorPicker) return;

    const onDown = (e: MouseEvent) => {
      const el = pickerRef.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return;
      setShowColorPicker(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showColorPicker]);

  return (
    <PanelSection title="フォント" desc="文字のフォントを選択します。">
      {/* ⭐カテゴリタブ */}
      <div className="mb-2 flex gap-2 text-xs">
        {(
          Object.entries(FONT_CATEGORIES) as [
            FontCategory,
            (typeof FONT_CATEGORIES)[FontCategory],
          ][]
        ).map(([catKey, cat]) => (
          <button
            key={catKey}
            type="button"
            onClick={() => setActiveCategory(catKey)}
            className={[
              "rounded-full px-2 py-1 border transition",
              activeCategory === catKey
                ? "bg-pink-50 border-pink-300 text-pink-700"
                : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50",
            ].join(" ")}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ⭐カテゴリのフォントだけ FontTab に渡す */}
      <FontTab
        value={value}
        fonts={fonts} // ⭐ これを FontTab に渡す形に変更
        onChange={(font) => onChangeFont(activeBlockId, font)}
      />

      <div className="mt-6 border-t border-zinc-100 pt-4">
        <p className="text-xs text-zinc-500 mb-2">文字色</p>

        <div className="relative">
          <div className="grid grid-cols-5 gap-2">
            {TEXT_COLORS.map((c) => {
              const isActive =
                activeBlock?.color === c.value ||
                (!activeBlock?.color && c.value === "#111827"); // デフォルト

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    if (!activeBlock) return;
                    onChangeColor(activeBlock.id, c.value);
                  }}
                  disabled={!activeBlock}
                  className={clsx(
                    "w-6 h-6 rounded-full border border-zinc-200",
                    "transition-transform hover:scale-110",
                    "disabled:opacity-40 disabled:hover:scale-100",
                    isActive && "ring-2 ring-offset-1 ring-pink-400",
                  )}
                  style={{ backgroundColor: c.value }}
                  aria-label={c.label}
                />
              );
            })}

            {/* ＋：カスタムカラー */}
            <button
              type="button"
              onClick={() => {
                if (!activeBlock) return;
                setShowColorPicker((v) => !v);
              }}
              disabled={!activeBlock}
              className={clsx(
                "w-6 h-6 rounded-full border border-zinc-200",
                "flex items-center justify-center relative overflow-hidden",
                "transition-all duration-150 hover:scale-110",
                "disabled:opacity-40 disabled:hover:scale-100",
                showColorPicker && "ring-2 ring-offset-1 ring-pink-400",
              )}
              style={{
                background:
                  activeBlock?.color ??
                  "linear-gradient(135deg, #fbcfe8, #bfdbfe, #bbf7d0)", // パステル虹
              }}
              aria-label="カスタムカラー"
              title="カスタムカラー"
            >
              {/* ほんのり白レイヤー（パステル化） */}
              <span className="absolute inset-0 bg-white/30" />

              {/* ＋ */}
              <span className="relative text-[10px] font-bold text-white drop-shadow-sm">
                ＋
              </span>
            </button>
          </div>

          {/* ポップオーバー */}
          {showColorPicker && activeBlock && (
            <div
              ref={pickerRef}
              className="absolute z-50 mt-5 w-[300px] rounded-xl border border-zinc-200 bg-white p-3 shadow-lg"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-4 w-4 rounded border border-zinc-200"
                    style={{ backgroundColor: currentColor }}
                  />
                  <span className="text-xs text-zinc-600">{currentColor}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-700"
                >
                  閉じる
                </button>
              </div>

              <HexColorPicker
                color={currentColor}
                onChange={(hex) => onChangeColor(activeBlock.id, hex)}
              />

              <div className="mt-2">
                <input
                  value={currentColor}
                  onChange={(e) =>
                    onChangeColor(activeBlock.id, e.target.value)
                  }
                  className="w-full rounded-md border border-zinc-200 px-2 py-1 text-xs"
                  spellCheck={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </PanelSection>
  );
}
