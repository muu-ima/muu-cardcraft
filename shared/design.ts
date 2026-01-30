// shared/designs.ts
export type DesignCategory = "simple" | "illustration" | "texture";

export type DesignKey =
  | "mint"
  | "peach"
  | "sky"
  | "milk"
  | "paper"
  | "snow"
  | "ultramarine"
  | "girl"
  | "kinmokusei"
  | "usaCarrot";

export type CardDesign = {
  category: DesignCategory;
  bgColor: string;
  image?: string;
  mode?: "cover" | "contain";
};

export const CARD_DESIGNS: Record<DesignKey, CardDesign> = {
  // ===== シンプル（Pastelテーマ） =====
  mint: {
    category: "simple",
    bgColor: "#DFF6F0", // ⭐ ブランド基準（デフォルト推し）
  },

  peach: {
    category: "simple",
    bgColor: "#FFEAF1", // やさしいコーラル
  },

  sky: {
    category: "simple",
    bgColor: "#EAF6FF", // パステルブルー
  },

  milk: {
    category: "simple",
    bgColor: "#FFF8EE", // ふわクリーム
  },

  paper: {
    category: "simple",
    bgColor: "#F6EFE7", // 上品紙ベージュ
  },

  snow: {
    category: "simple",
    bgColor: "#FFFFFF", // 純白
  },

  ultramarine: {
    category: "simple",
    bgColor: "#6C7BFF", // ⭐ アクセント（締め色）
  },

  // ===== イラスト =====
  girl: {
    category: "illustration",
    bgColor: "#F3F5FA",
    image: "/girl.png",
    mode: "cover",
  },
  usaCarrot: {
    category: "illustration",
    bgColor: "#FFFFFF",
    image: "/usa-carrot.png",
    mode: "contain",
  },

  // ===== 素材・柄 =====
  kinmokusei: {
    category: "texture",
    bgColor: "#FFF4E8",
    image: "/kinmokusei.png",
    mode: "cover",
  },
};
