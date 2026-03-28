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
  zenKaku: {
    label: "やわらかゴシック",
    css: "var(--font-zen-kaku-gothic-new), system-ui, sans-serif",
  },
  serif: {
    label: "明朝",
    css: "var(--font-noto-serif-jp), serif",
  },
  mplus: {
    label: "M PLUS",
    css: "var(--font-m-plus-1p), sans-serif",
  },
  shippori: {
    label: "しっぽり明朝",
    css: "var(--font-shippori-mincho), serif",
  },
  kosugimaru: {
    label: "こすぎ丸",
    css: "var(--font-kosugi-maru), sans-serif",
  },
  script1: {
    label: "筆記体（Parisienne / 英字のみ）",
    css: "var(--font-parisienne), cursive",
  },
  script2: {
    label: "筆記体（Dancing Script / 英字のみ）",
    css: "var(--font-dancing-script), cursive",
  },
  pop1: {
    label: "ポップ (Lemon / 英字のみ)",
    css: "var(--font-lemon), system-ui, sans-serif",
  },
  pop2: {
    label: "ポップ (Chicle / 英字のみ)",
    css: "var(--font-chicle), system-ui, sans-serif",
  },
  pop3: {
    label: "ポップ (Potta_One / 日本語)",
    css: "var(--font-potta_one), system-ui, sans-serif",
  },
  yuseimagic: {
    label: "ポップ (yusei / 日本語)",
    css: "var(--font-yusei-magic), cursive",
  },
} as const;

export type FontKey = keyof typeof FONT_DEFINITIONS;

// フォントサイズの増減量
export type FontSizeDelta = 1 | -1;
