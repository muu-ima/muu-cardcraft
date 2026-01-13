// app/components/panels/FontPanel.tsx
"use client";

import { useState } from "react";
import type { Block } from "@/shared/blocks";
import FontTab from "@/app/components/tabs/FontTab";
import PanelSection from "@/app/components/panels/PanelSection";
import { FONT_DEFINITIONS, type FontKey } from "@/shared/fonts";

type Props = {
  blocks: Block[];
  activeBlockId: string;
  onChangeFont: (id: string, fontKey: FontKey) => void;
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
      (k) => k in FONT_DEFINITIONS
    ) as FontKey[],
  },
  pop: {
    label: "ポップ",
    keys: ["pop1", "pop2", "pop3"].filter(
      (k) => k in FONT_DEFINITIONS
    ) as FontKey[],
  },
};

export default function FontPanel({
  blocks,
  activeBlockId,
  onChangeFont,
}: Props) {
  const value = blocks.find((b) => b.id === activeBlockId)?.fontKey ?? "sans";

  // ⭐ カテゴリ state
  const [activeCategory, setActiveCategory] = useState<FontCategory>("basic");

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

  return (
    <PanelSection title="フォント" desc="文字のフォントを選択します。">
      {/* ⭐カテゴリタブ */}
      <div className="mb-2 flex gap-2 text-xs">
        {(
          Object.entries(FONT_CATEGORIES) as [
            FontCategory,
            (typeof FONT_CATEGORIES)[FontCategory]
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
    </PanelSection>
  );
}
