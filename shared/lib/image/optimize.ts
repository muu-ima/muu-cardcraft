// shared/lib/image/optimize.ts
import sharp from "sharp";

export async function toOptimizedWebp(input: Buffer) {
  // 事故防止：メタ取って巨大なら弾ける（必要なら）
  const img = sharp(input, { failOn: "none" });
  const meta = await img.metadata();

  if ((meta.width ?? 0) > 8000 || (meta.height ?? 0) > 8000) {
    throw new Error("image_too_large");
  }

  return img
    .rotate() // iPhoneの向き対策
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}
