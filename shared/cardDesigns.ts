// shared/cardDesigns.ts
import { CARD_DESIGNS, type DesignKey } from "./design";
import type { Block } from "@/shared/blocks";

type CardBg = {
  color: string;
  image?: string;
  mode?: "cover" | "contain";
};

export type CardDesign = {
  frontBg: CardBg;
  backBg: CardBg;
  back: {
    editable: false;
    blocks: Block[];
  };
};

const BASE_BACK_BLOCKS: Block[] = [
  {
    id: "support-title",
    type: "text",
    side: "back",
    text: "サポート窓口",
    x: 40,
    y: 60,
    z: 1,
    fontSize: 20,
    fontWeight: "bold",
    fontKey: "sans",
  },
  {
    id: "support-mail",
    type: "text",
    side: "back",
    text: "support@example.com",
    x: 40,
    y: 100,
    z: 2,
    fontSize: 14,
    fontWeight: "normal",
    fontKey: "sans",
  },
  {
    id: "support-note",
    type: "text",
    side: "back",
    text: "受付時間: 平日 10:00〜18:00",
    x: 40,
    y: 130,
    z: 3,
    fontSize: 12,
    fontWeight: "normal",
    fontKey: "sans",
  },
];

function cloneBlocks(blocks: Block[]): Block[] {
  return blocks.map((b) => ({ ...b }));
}

function makeDesign(key: DesignKey): CardDesign {
  const bg = CARD_DESIGNS[key];

  return {
    frontBg: {
      color: bg.bgColor,
      image: bg.image,
      mode: bg.mode,
    },
    backBg: {
      color: "#ffffff",
      // 固定背景画像を入れたいならここに追加
      // image: "/designs/back/support-bg.png",
      // mode: "cover",
    },
    back: {
      editable: false,
      blocks: cloneBlocks(BASE_BACK_BLOCKS),
    },
  };
}

export const CARD_FULL_DESIGNS: Record<DesignKey, CardDesign> = {
  mint: makeDesign("mint"),
  peach: makeDesign("peach"),
  sky: makeDesign("sky"),
  milk: makeDesign("milk"),
  paper: makeDesign("paper"),
  snow: makeDesign("snow"),
  ultramarine: makeDesign("ultramarine"),

  girl: makeDesign("girl"),
  itigoSoda: makeDesign("itigoSoda"),
  usaCarrot: makeDesign("usaCarrot"),
  cityGirl: makeDesign("cityGirl"),
  mocaGirl: makeDesign("mocaGirl"),
  nekoFusen: makeDesign("nekoFusen"),
  mirrorBoy: makeDesign("mirrorBoy"),
  mirrorGirl: makeDesign("mirrorGirl"),

  circlePattern: makeDesign("circlePattern"),
  kinmokusei: makeDesign("kinmokusei"),
  coffeeWood: makeDesign("coffeeWood"),
  coffeeWoodCorner: makeDesign("coffeeWoodCorner"),
};
