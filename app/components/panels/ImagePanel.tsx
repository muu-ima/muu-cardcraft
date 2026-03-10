// app/components/panels/ImagePanel.tsx
"use client";

import { useRef, useState } from "react";
import PanelSection from "@/app/components/panels/PanelSection";
import clsx from "clsx";
import type { CardImage } from "@/shared/images";
import {
  uploadImage,
  type UploadImageAsset,
} from "@/hooks/card/useUploadImage";

type Props = {
  code: string;
  onUploaded?: (asset: UploadImageAsset) => void;
  images: CardImage[];
  currentCount: number;
  maxCount: number;
  onDeleteImage: (id: string) => void;
};

export default function ImagePanel({
  code,
  onUploaded,
  images = [],
  currentCount = 0,
  maxCount = 3,
  onDeleteImage,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickFile = () => inputRef.current?.click();

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 同じファイル再選択できるようにする
    if (!file) return;

    if (currentCount >= maxCount) {
      setError("画像は最大3枚までです");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const asset = await uploadImage(code, file);
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

          <div className="text-xs text-zinc-500">
            {currentCount} / {maxCount} 枚
          </div>

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

      <PanelSection title="画像一覧">
        {images.length === 0 ? (
          <div className="text-sm text-black/40">まだ画像はありません</div>
        ) : (
          <div className="space-y-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="flex items-center gap-3 rounded-2xl bg-black/5 p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.assetId ?? "uploaded"}
                  className="h-16 w-16 rounded-xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs text-black/70">
                    assetId: {img.assetId}
                  </div>
                  <div className="text-xs text-black/40">
                    {Math.round(img.w)} × {Math.round(img.h)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteImage(img.id)}
                  className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-700 hover:bg-red-500/15"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </PanelSection>
    </div>
  );
}
