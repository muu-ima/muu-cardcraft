// shared/cardDesigns.ts
import { CARD_DESIGNS, type DesignKey } from "./design";
import type { Block } from "@/shared/blocks";

/**
 * 1つのデザインは
 * - 背景 (bg)
 * - 表面(front): 基本固定（editable:false）
 * - 裏面(back): 編集可能（editable:true）
 * を持つ
 */
export type cardDesign = {
  bg: {
    color: string;
    image?: string;
    mode?: "cover" | "contain";
  };
  front: {
    editable: false;
    blocks: Block[];
  };
  back: {
    editable: true;
    blocks: Block[];
  };
};

// 🌟 表面・裏面の共通テンプレート
const BASE_FRONT_BLOCKS: Block[] = [
  {
    id: "brand",
    type: "text",
    text: "Cocco",
    side: "front",
    x: 40,
    y: 40,
    fontSize: 20,
    fontWeight: "bold",
    fontKey: "sans",
  },
  {
    id: "url",
    type: "text",
    text: "cocco.example",
    side: "front",
    x: 40,
    y: 80,
    fontSize: 14,
    fontWeight: "normal",
    fontKey: "sans",
  },
];

const BASE_BACK_BLOCKS: Block[] = [
  {
    id: "name",
    type: "text",
    text: "山田 太郎",
    side: "front",
    x: 100,
    y: 120,
    fontSize: 24,
    fontWeight: "bold",
    fontKey: "sans",
  },
  {
    id: "title",
    type: "text",
    text: "デザイナー / Designer",
    side: "front",
    x: 100,
    y: 80,
    fontSize: 18,
    fontWeight: "normal",
    fontKey: "sans",
  },
];

// 🌟 CARD_DESIGNS から背景をコピーして cardDesign を作るヘルパー
function makeDesign(key: DesignKey): cardDesign {
  const bg = CARD_DESIGNS[key];
  return {
    bg: {
      color: bg.bgColor,
      image: bg.image,
      mode: bg.mode,
    },
    front: {
      editable: false,
      blocks: BASE_FRONT_BLOCKS,
    },
    back: {
      editable: true,
      blocks: BASE_BACK_BLOCKS,
    },
  };
}

/**
 * ここを DesignKey に合わせて全部定義する
 * （例：mint / urtraMarin / ... / girl / kinmokusei / usaCarrot）
 */
export const CARD_FULL_DESIGNS: Record<DesignKey, cardDesign> = {
  // simple（Pastel）
  mint: makeDesign("mint"),
  peach: makeDesign("peach"),
  sky: makeDesign("sky"),
  milk: makeDesign("milk"),
  paper: makeDesign("paper"),
  snow: makeDesign("snow"),
  ultramarine: makeDesign("ultramarine"),

  // illustration / texture
  girl: makeDesign("girl"),
  kinmokusei: makeDesign("kinmokusei"),
  usaCarrot: makeDesign("usaCarrot"),
};

