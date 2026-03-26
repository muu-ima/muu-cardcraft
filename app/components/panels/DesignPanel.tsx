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
    keys: [
      "girl",
      "itigoSoda",
      "usaCarrot",
      "cityGirl",
      "mocaGirl",
      "nekoFusen",
      "mirrorBoy",
      "mirrorGirl",
    ],
  },
  texture: {
    label: "素材・柄",
    keys: ["kinmokusei", "circlePattern", "coffeeWood", "coffeeWoodCorner"],
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
  itigoSoda: "いちごソーダ",
  usaCarrot: "うさぎ&にんじん",
  cityGirl: "シティガール",
  mocaGirl: "モカガール",
  nekoFusen: "ねこ風船",
  mirrorBoy: "鏡を見て自撮り少年",
  mirrorGirl: "鏡を見て自撮り少女",

  kinmokusei: "金木犀",
  circlePattern: "サークルパターン",
  coffeeWood: "コーヒーウッド",
  coffeeWoodCorner: "コーヒーウッド右下",
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
    image: CARD_DESIGNS[key].image,
    mode: CARD_DESIGNS[key].mode,
  }));

  const variant = activeCategory === "simple" ? "swatch" : "default";

  return (
    <div className="space-y-4">
      <PanelSection
        title="背景デザイン"
        desc="カードの背景デザインを選択します。"
      >
        {/* カテゴリタブ */}
        <div className="mb-3 border-b border-zinc-200/70">
          <div className="flex flex-wrap gap-1 text-xs">
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
                  "relative -mb-px rounded-t-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  activeCategory === catKey
                    ? "border-zinc-300 border-b-white bg-white text-pink-500 shadow-[0_-1px_0_rgba(255,255,255,0.95),0_4px_12px_rgba(15,23,42,0.04)]"
                    : "border-transparent bg-transparent text-zinc-500 hover:bg-white/50 hover:text-zinc-700",
                ].join(" ")}
              >
                {cat.label}
              </button>
            ))}
          </div>
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
