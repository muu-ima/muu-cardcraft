// shared/images.ts
export type Side = "front" | "back";

export type CardImage = {
  id: string; // UI上の要素ID（uuid等）
  assetId: string; // アップロード結果で返ってくるID（あなたのAPIの戻りに合わせる）
  url: string; // 表示用URL（署名URL or /api/...）
  side: Side;

  x: number;
  y: number;
  w: number;
  h: number;

  rotate?: number;
};

export const IMAGE_MIN_W = 140;
export const IMAGE_MIN_H = 100;
export const IMAGE_MAX_W = 400;
export const IMAGE_MAX_H = 280;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
