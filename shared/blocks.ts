import type { FontKey } from "@/shared/fonts";

// shared/blocks.ts

export type Block = {
  id: string;
  type: "text"; // いずれ "braille" も足すかも
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: "normal" | "bold";
  fontKey: FontKey; // 実際の定義に合わせて
  width?: number;
  align?: "left" | "center" | "right";
  side: "front" | "back";
  isBraille?: boolean;
};

// ✅ カードの初期状態をここに集約
export const INITIAL_BLOCKS: Block[] = [
  {
    id: "name",
    type: "text",
    text: "山田 太郎",
    x: 100,
    y: 120,
    fontSize: 24,
    fontWeight: "bold",
    fontKey: "serif",
    side: "front",
  },
  {
    id: "title",
    type: "text",
    text: "デザイナー / Designer",
    x: 100,
    y: 80,
    fontSize: 18,
    fontWeight: "normal",
    fontKey: "sans",
    width: 140,
    side: "front",
  },

  // 👇 点字用に 1 個ブロックを予約（あとで位置・サイズは調整）
  {
    id: "braille-main",
    type: "text",
    text: "⠃⠗⠁⠊⠇⠇⠑", // ダミー。起動後はパネルから上書きされる想定
    x: 100,
    y: 200,
    fontSize: 18,
    fontWeight: "normal",
    fontKey: "sans",
    side: "front",
    isBraille: true, // ← 点字用
  },
];
