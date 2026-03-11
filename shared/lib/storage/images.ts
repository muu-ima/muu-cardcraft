// shared/lib/storage/images.ts
import { supabaseAdmin } from "@/shared/lib/supabase/admin";

// 例：S3/R2/Supabase 等、何であれ「初期化時」に requireEnv を通す
const BUCKET = requireEnv("IMAGES_BUCKET");
// const ENDPOINT = requireEnv("IMAGES_ENDPOINT");
// const ACCESS_KEY = requireEnv("IMAGES_ACCESS_KEY");
// const SECRET_KEY = requireEnv("IMAGES_SECRET_KEY");
function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`missing_env:${name}`);
  return v;
}

export function tmpPath(code: string, assetId: string) {
  return `tmp/${code}/${assetId}.webp`;
}
export function finalPath(code: string, assetId: string) {
  return `final/${code}/${assetId}.webp`;
}

export async function uploadTmpWebp(
  code: string,
  assetId: string,
  webp: Buffer,
) {
  const path = tmpPath(code, assetId);

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, webp, {
      contentType: "image/webp",
      upsert: true,
    });
  if (error) throw error;

  return path;
}

// tmp → final（コピーしてから tmp を消す。移動APIが無い環境でも安全）
export async function promoteTmpToFinal(code: string, assetId: string) {
  const from = tmpPath(code, assetId);
  const to = finalPath(code, assetId);

  const { data, error: dlErr } = await supabaseAdmin.storage
    .from(BUCKET)
    .download(from);
  if (dlErr) throw dlErr;

  const arrayBuf = await data.arrayBuffer();
  const buf = Buffer.from(arrayBuf);

  const { error: upErr } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(to, buf, {
      contentType: "image/webp",
      upsert: true,
    });
  if (upErr) throw upErr;

  // tmp掃除（失敗しても致命じゃない）
  await supabaseAdmin.storage.from(BUCKET).remove([from]);

  return { from, to };
}

// 表示用：署名付きURL（tmpはこれで出す想定）
export async function createSignedUrl(path: string, expiresInSec = 60 * 10) {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresInSec);
  if (error) throw error;
  return data.signedUrl;
}
