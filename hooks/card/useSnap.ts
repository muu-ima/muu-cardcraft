// hooks/card/useSnap.ts
import type { Block } from "@/shared/blocks";

const SNAP = 10;

/* =========================
   型定義
========================= */

export type SnapGuide =
  | { type: "centerX"; pos: number }
  | { type: "centerY"; pos: number }
  | { type: "left"; pos: number }
  | { type: "top"; pos: number };

export type SnapResult = {
  x: number;
  y: number;
  guide?: SnapGuide | null;
};

/* =========================
   snap 本体
========================= */

export function snapXY(args: {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  blocks: Block[];
  baseW: number;
  baseH: number;
}): SnapResult {

  let { x, y } = args;
  const { id, w, h, blocks, baseW, baseH } = args;

  let guide: SnapGuide | null = null;

  // ===== 中央吸着 =====
  const cx = baseW / 2;
  const cy = baseH / 2;

  const centerX = x + w / 2;
  const centerY = y + h / 2;

  if (Math.abs(centerX - cx) <= SNAP) {
    x = cx - w / 2;
    guide = { type: "centerX", pos: cx };
  }

  if (Math.abs(centerY - cy) <= SNAP) {
    y = cy - h / 2;
    guide = { type: "centerY", pos: cy };
  }

  // ===== 他ブロック吸着 =====
  for (const b of blocks) {
    if (b.id === id) continue;

    if (Math.abs(x - b.x) <= SNAP) {
      x = b.x;
      guide = { type: "left", pos: b.x };
    }

    if (Math.abs(y - b.y) <= SNAP) {
      y = b.y;
      guide = { type: "top", pos: b.y };
    }
  }

  return { x, y, guide };
}
