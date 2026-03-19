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
  | "itigoSoda"
  | "usaCarrot"
  | "cityGirl"
  | "mocaGirl"
  | "nekoFusen"
  | "mirrorBoy"
  | "mirrorGirl"
  | "circlePattern"
  | "kinmokusei"
  | "coffeeWood"
  | "coffeeWoodCorner";

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
  itigoSoda: {
    category: "illustration",
    bgColor: "#F8F4FF",
    image: "/itigo_soda.png",
    mode: "cover",
  },
  usaCarrot: {
    category: "illustration",
    bgColor: "#FFFFFF",
    image: "/usa-carrot.png",
    mode: "cover",
  },
  cityGirl: {
    category: "illustration",
    bgColor: "#F3F1EE",
    image: "/city_girl.png",
    mode: "cover",
  },
  mocaGirl: {
    category: "illustration",
    bgColor: "#F6F1EC",
    image: "/moca_girl.png",
    mode: "cover",
  },
  nekoFusen: {
    category: "illustration",
    bgColor: "#FFFBEF",
    image: "/neko_fusen.png",
    mode: "cover",
  },
  mirrorBoy: {
    category: "illustration",
    bgColor: "#FFFBEF",
    image: "/mirror_boy.png",
    mode: "cover",
  },
  mirrorGirl: {
    category: "illustration",
    bgColor: "#FFFBEF",
    image: "/mirror_girl.png",
    mode: "cover",
  },

  // ===== 素材・柄 =====
  circlePattern: {
    category: "texture",
    bgColor: "#FFF4E8",
    image: "/circle_pattern.png",
    mode: "cover",
  },
  kinmokusei: {
    category: "texture",
    bgColor: "#FFF4E8",
    image: "/kinmokusei.png",
    mode: "cover",
  },
  coffeeWood: {
    category: "texture",
    bgColor: "#FFF4E8",
    image: "/coffee_wood.png",
    mode: "cover",
  },
  coffeeWoodCorner: {
    category: "texture",
    bgColor: "#FFF4E8",
    image: "/coffee_wood_corner.png",
    mode: "cover",
  },
};
