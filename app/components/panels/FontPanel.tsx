// app/components/panels/FontPanel.tsx
"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
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

  // ✅ commit（履歴に積む）
  onChangeColor: (id: string, color: string) => void;

  // ✅ preview（履歴に積まない）
  onPreviewColor: (id: string, color: string) => void;
};

type FontCategory = "basic" | "script" | "pop";

const FONT_CATEGORIES: Record<
  FontCategory,
  { label: string; keys: FontKey[] }
> = {
  basic: { label: "ベーシック", keys: ["sans", "maru", "serif"] },
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
  { id: "dark", label: "ダーク", value: "#111827" },
  { id: "gray", label: "グレー", value: "#4B5563" },
  { id: "white", label: "白", value: "#FFFFFF" },
  { id: "pink", label: "ピンク", value: "#EC4899" },
  { id: "orange", label: "オレンジ", value: "#F97316" },
  { id: "yellow", label: "黄", value: "#FACC15" },
  { id: "green", label: "緑", value: "#10B981" },
  { id: "cyan", label: "シアン", value: "#0EA5E9" },
  { id: "indigo", label: "藍", value: "#6366F1" },
] as const;

type PanelTab = "font" | "color";

const normalizeHex = (raw: string) => {
  const s = raw.trim().replace(/^#/, "").toLowerCase();
  const cleaned = s.replace(/[^0-9a-f]/g, "").slice(0, 6);
  const ok = cleaned.length === 3 || cleaned.length === 6;
  return { cleaned, ok, withHash: ok ? `#${cleaned}` : null };
};

const normalizePickerColor = (raw: string) => {
  const { withHash } = normalizeHex(raw);
  return withHash ?? "#111827";
};

export default function FontPanel({
  blocks,
  activeBlockId,
  onChangeFont,
  onChangeColor,
  onPreviewColor,
}: Props) {
  const [tab, setTab] = useState<PanelTab>("font");
  const [activeCategory, setActiveCategory] = useState<FontCategory>("basic");

  const value = blocks.find((b) => b.id === activeBlockId)?.fontKey ?? "sans";
  const activeBlock =
    blocks.find((b) => b.id === activeBlockId && b.type === "text") ?? null;

  const currentColor = useMemo(() => {
    return activeBlock?.color ?? "#111827";
  }, [activeBlock?.color]);

  const [hexInput, setHexInput] = useState(
    () => normalizeHex(currentColor).cleaned,
  );

  // ブロック側の色が変わったら入力欄も同期（プリセット/リセットなど）
  useEffect(() => {
    setHexInput(normalizeHex(currentColor).cleaned);
  }, [currentColor]);

  const keys = FONT_CATEGORIES[activeCategory].keys;
  const fonts = keys.map((key) => {
    const def = FONT_DEFINITIONS[key];
    return { key, label: def.label, css: def.css };
  });

  const disabled = !activeBlock;

  // =========================================
  // ✅ ここが肝：ピッカー更新をRAFで間引き
  // =========================================
  const pendingColorRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastSentRef = useRef<string>(currentColor);

  useEffect(() => {
    // 外部から色が変わったら同期（プリセットクリック等）
    lastSentRef.current = currentColor;
  }, [currentColor]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const flushPreview = useCallback(() => {
    rafRef.current = null;
    if (!activeBlock) return;

    const next = pendingColorRef.current;
    pendingColorRef.current = null;
    if (!next) return;

    // ✅ 同じ色は送らない（無限ループ防止）
    if (next === lastSentRef.current) return;
    lastSentRef.current = next;

    onPreviewColor(activeBlock.id, next);
  }, [activeBlock, onPreviewColor]);

  const schedulePreview = useCallback(
    (hex: string) => {
      pendingColorRef.current = hex;
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(flushPreview);
    },
    [flushPreview],
  );

  // ✅ ピッカーの最後の色（pointerupでcommit）
  const lastPickedRef = useRef<string>(currentColor);
  useEffect(() => {
    lastPickedRef.current = currentColor;
  }, [currentColor]);

  const commitPickedColor = useCallback(() => {
    if (!activeBlock) return;
    const hex = lastPickedRef.current;
    if (!hex) return;
    if (hex === currentColor) return;
    onChangeColor(activeBlock.id, hex);
  }, [activeBlock, currentColor, onChangeColor]);

  // ✅ ドラッグ状態
  const draggingRef = useRef(false);

  useEffect(() => {
    const onUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      commitPickedColor();
    };

    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [commitPickedColor]);

  return (
    <PanelSection title="フォント" desc="文字のフォントを選択します。">
      <div className="mb-4 border-b border-zinc-200/80">
        <div className="flex gap-1 text-xs">
          <button
            type="button"
            onClick={() => setTab("font")}
            className={[
              "relative -mb-px rounded-t-xl border px-4 py-2 text-sm font-medium transition-all duration-200",
              tab === "font"
                ? "border-zinc-300 border-b-white bg-white text-pink-500 shadow-[0_-1px_0_rgba(255,255,255,0.9),0_6px_18px_rgba(15,23,42,0.05)]"
                : "border-transparent bg-transparent text-zinc-500 hover:text-zinc-700 hover:bg-white/50",
            ].join(" ")}
          >
            フォント
          </button>

          <button
            type="button"
            onClick={() => setTab("color")}
            className={[
              "relative -mb-px rounded-t-xl border px-4 py-2 text-sm font-medium transition-all duration-200",
              tab === "color"
                ? "border-zinc-300 border-b-white bg-white text-pink-500 shadow-[0_-1px_0_rgba(255,255,255,0.9),0_6px_18px_rgba(15,23,42,0.05)]"
                : "border-transparent bg-transparent text-zinc-500 hover:text-zinc-700 hover:bg-white/50",
            ].join(" ")}
          >
            色
          </button>
        </div>
      </div>

      {tab === "font" && (
        <>
          <div className="mb-3 border-b border-zinc-200/70">
            <div className="flex flex-wrap gap-1 text-xs">
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
                    "relative -mb-px rounded-t-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                    activeCategory === catKey
                      ? "border-zinc-300 border-b-white bg-white text-pink-500 shadow-[0_-1px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(15,23,42,0.04)]"
                      : "border-transparent bg-transparent text-zinc-500 hover:text-zinc-700 hover:bg-white/50",
                  ].join(" ")}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <FontTab
            value={value}
            fonts={fonts}
            onChange={(font) => onChangeFont(activeBlockId, font)}
          />
        </>
      )}

      {tab === "color" && (
        <div className="mt-4">
          <p className="text-xs text-zinc-500 mb-2">文字色</p>

          <div className="grid grid-cols-5 gap-2">
            {TEXT_COLORS.map((c) => {
              const isActive =
                activeBlock?.color === c.value ||
                (!activeBlock?.color && c.value === "#111827");

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    if (!activeBlock) return;
                    onChangeColor(activeBlock.id, c.value);
                  }}
                  disabled={disabled}
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
          </div>

          <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
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
                onClick={() => {
                  if (!activeBlock) return;
                  onChangeColor(activeBlock.id, "#111827");
                }}
                disabled={disabled}
                className="text-xs text-zinc-500 hover:text-zinc-700 disabled:opacity-40"
              >
                リセット
              </button>
            </div>

            <div
              className={clsx(disabled && "opacity-40 pointer-events-none")}
              onPointerUp={commitPickedColor}
              onPointerCancel={commitPickedColor}
            >
              <HexColorPicker
                color={normalizePickerColor(currentColor)}
                onChange={(hex) => {
                  if (!activeBlock) return;
                  draggingRef.current = true;

                  // react-colorful は #付きで来る
                  const { cleaned, ok, withHash } = normalizeHex(hex);
                  setHexInput(cleaned);

                  if (!withHash) return;
                  lastPickedRef.current = withHash;
                  schedulePreview(withHash);
                }}
              />

              <input
                value={hexInput}
                onChange={(e) => {
                  if (!activeBlock) return;

                  const { cleaned, withHash } = normalizeHex(e.target.value);
                  setHexInput(cleaned);

                  // ✅ valid(3 or 6) になった瞬間だけ preview（履歴なし）
                  if (withHash) {
                    lastPickedRef.current = withHash;
                    schedulePreview(withHash);
                  }
                }}
                onKeyDown={(e) => {
                  if (!activeBlock) return;
                  if (e.key !== "Enter") return;

                  const { withHash } = normalizeHex(hexInput);
                  if (!withHash) return;

                  // ✅ Enter で確定（履歴あり）
                  onChangeColor(activeBlock.id, withHash);
                }}
                onBlur={() => {
                  if (!activeBlock) return;

                  const { withHash } = normalizeHex(hexInput);
                  if (!withHash) return;

                  // ✅ フォーカス外れで確定（履歴あり）
                  onChangeColor(activeBlock.id, withHash);
                }}
                className="mt-2 w-full rounded-md border border-zinc-200 px-2 py-1 text-xs"
                spellCheck={false}
              />
            </div>
          </div>

          {!activeBlock && (
            <p className="mt-2 text-xs text-zinc-400">
              テキストブロックを選択すると色を変更できます
            </p>
          )}
        </div>
      )}
    </PanelSection>
  );
}
