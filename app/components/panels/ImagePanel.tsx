// app/components/panels/ImagePanel.tsx
"use client";

import { useRef, useState } from "react";
import PanelSection from "@/app/components/panels/PanelSection";
import clsx from "clsx";
import {
  uploadImage,
  type UploadImageAsset,
} from "@/hooks/card/useUploadImage";

type Props = {
  code: string; // ✅ 名刺コード（アップロードに必須）
  onUploaded?: (asset: UploadImageAsset) => void; // ✅ アップロード後、親がblock追加するため
};

export default function ImagePanel({ code, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAsset, setLastAsset] = useState<UploadImageAsset | null>(null);

  const pickFile = () => inputRef.current?.click();

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 同じファイル再選択できるようにする
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      const asset = await uploadImage(code, file);
      setLastAsset(asset);
      onUploaded?.(asset);
    } catch (err: any) {
      setError(err?.message ?? "upload_failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <PanelSection title="画像">
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={onChangeFile}
          />

          <button
            type="button"
            onClick={pickFile}
            disabled={!code || isUploading}
            className={clsx(
              "w-full rounded-xl px-3 py-2 text-sm",
              "bg-black/5 hover:bg-black/10",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {isUploading ? "アップロード中..." : "画像をアップロード"}
          </button>

          <div className="text-xs text-black/50">
            PNG/JPEG/WebP（最大10MB・保存はWebP最適化）
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
        </div>
      </PanelSection>

      <PanelSection title="プレビュー">
        {lastAsset ? (
          <div className="space-y-2">
            <div className="rounded-2xl bg-black/5 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lastAsset.signedUrl}
                alt={lastAsset.originalName ?? "uploaded"}
                className="h-auto w-full rounded-xl object-contain"
              />
            </div>
            <div className="text-xs text-black/60 break-all">
              assetId: {lastAsset.id}
            </div>
          </div>
        ) : (
          <div className="text-sm text-black/40">まだ画像はありません</div>
        )}
      </PanelSection>
    </div>
  );
}
