// shared/fonts.ts

export const FONT_DEFINITIONS = {
  sans: {
    label: "ゴシック",
    css: "var(--font-noto-sans-jp), system-ui, sans-serif",
  },
  maru: {
    label: "丸ゴシック",
    css: "var(--font-zen-maru-gothic), system-ui, sans-serif",
  },
  serif: {
    label: "明朝",
    css: "var(--font-noto-serif-jp), serif",
  },
  script1: {
    label: "筆記体（Parisienne）",
    css: "var(--font-parisienne), cursive",
  },
  script2: {
    label: "筆記体（Dancing Script）",
    css: "var(--font-dancing-script), cursive",
  },
  pop1: {
    label: "ポップ (Lemon / 英字)",
    css: "var(--font-lemon), system-ui, sans-serif",
  },
  pop2: {
    label: "ポップ (Chicle / 英字)",
    css: "var(--font-chicle), system-ui, sans-serif",
  },
   pop3: {
    label: "ポップ (Potta_One / 日本)",
    css: "var(--font-potta_one), system-ui, sans-serif",
  },
} as const;

export type FontKey = keyof typeof FONT_DEFINITIONS;

// フォントサイズの増減量
export type FontSizeDelta = 1 | -1;
