// app/components/panels/DesignPanel.tsx
"use client";

import { useState } from "react";
import PanelSection from "@/app/components/panels/PanelSection";
import DesignTab from "@/app/components/tabs/DesignTab";
import type { DesignCategory, DesignKey } from "@/shared/design";
import { CARD_DESIGNS } from "@/shared/design";

// ⭐ カテゴリごとの設定
const DESIGN_CATEGORIES: Record<
  DesignCategory,
  { label: string; keys: DesignKey[] }
> = {
  simple: {
    label: "シンプル",
    keys: ["mint", "peach", "sky", "milk", "paper", "snow", "ultramarine"],
  },
  illustration: {
    label: "イラスト",
    keys: ["girl", "usaCarrot"],
  },
  texture: {
    label: "素材・柄",
    keys: ["kinmokusei"],
  },
};

// ⭐ デザイン名（表示用）
const DESIGN_LABELS: Record<DesignKey, string> = {
  mint: "ミント",
  peach: "ピーチ",
  sky: "スカイ",
  milk: "ミルク",
  paper: "ペーパー",
  snow: "スノー",
  ultramarine: "ウルトラマリン",

  girl: "ガール",
  kinmokusei: "金木犀",
  usaCarrot: "うさぎ&にんじん",
};
export default function DesignPanel({
  design,
  onChangeDesign,
}: {
  design: DesignKey;
  onChangeDesign: (design: DesignKey) => void;
}) {
  const [activeCategory, setActiveCategory] =
    useState<DesignCategory>("simple");

  const category = DESIGN_CATEGORIES[activeCategory];

  const designs = category.keys.map((key) => ({
    key,
    label: DESIGN_LABELS[key],
    bgColor: CARD_DESIGNS[key].bgColor,
  }));

  const variant = activeCategory === "simple" ? "swatch" : "default";

  return (
    <div className="space-y-4">
      <PanelSection
        title="背景デザイン"
        desc="カードの背景デザインを選択します。"
      >
        {/* カテゴリタブ */}
        <div className="mb-2 flex gap-2 text-xs">
          {(
            Object.entries(DESIGN_CATEGORIES) as [
              DesignCategory,
              (typeof DESIGN_CATEGORIES)[DesignCategory],
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

        <DesignTab
          value={design}
          designs={designs}
          onChange={onChangeDesign}
          variant={variant}
        />
      </PanelSection>
    </div>
  );
}
