// shared/blocks.ts

import type { FontKey } from "@/shared/fonts";

export type Block = {
  id: string;
  type: "text"; 
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
  color?: string;
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
    color: "#111827", 
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
    color: "#111827", 
  },


];
