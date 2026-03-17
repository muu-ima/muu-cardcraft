// app/api/uploads/images/route.ts
import { NextResponse } from "next/server";
import { createRandomId } from "@/shared/randomId";
import { toOptimizedWebp } from "@/shared/lib/image/optimize";
import {
  createSignedUrl,
  uploadTmpWebp,
  tmpPath,
} from "@/shared/lib/storage/images";

export const runtime = "nodejs"; // sharp を使うので必須

// 受け入れ制限（必要なら調整してOK）
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

function badRequest(message: string, extra?: Record<string, unknown>) {
  return NextResponse.json(
    { ok: false, error: message, ...extra },
    { status: 400 },
  );
}

export async function POST(req: Request) {
  try {
    // multipart/form-data を想定
    const form = await req.formData();

    // 必須：code（名刺コード）
    const code = String(form.get("code") || "").trim();
    if (!code) return badRequest("missing_code");

    // TODO: editToken 検証を入れるならここ（例：form.get("editToken")）
    // const editToken = String(form.get("editToken") || "").trim();
    // if (!isValidEditToken(code, editToken)) return badRequest("invalid_token");

    const file = form.get("file");
    if (!(file instanceof File)) return badRequest("missing_file");

    if (!ALLOWED_MIME.has(file.type)) {
      return badRequest("unsupported_file_type", { mime: file.type });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return badRequest("file_too_large", {
        size: file.size,
        max: MAX_UPLOAD_BYTES,
      });
    }

    // File -> Buffer
    const arrayBuf = await file.arrayBuffer();
    const inputBuf = Buffer.from(arrayBuf);

    // sharp で最適化して webp に変換
    const webpBuf = await toOptimizedWebp(inputBuf);

    // assetId を発行して tmp に保存
    const assetId = createRandomId(); // shared/randomId.ts の関数を使う
    await uploadTmpWebp(code, assetId, webpBuf);

    // 表示用の署名URL（10分）
    const path = tmpPath(code, assetId);
    const signedUrl = await createSignedUrl(path, 60 * 10);

    // 返却：assetId + path + signedUrl
    return NextResponse.json({
      ok: true,
      asset: {
        id: assetId,
        kind: "image",
        tmpPath: path,
        signedUrl,
        mime: "image/webp",
        originalName: file.name,
        size: webpBuf.byteLength,
      },
    });
  } catch (err: any) {
    console.error("[upload image] error:", err);

    // optimize.ts で image_too_large を投げる設計ならここで拾える
    const msg =
      typeof err?.message === "string" ? err.message : "upload_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
