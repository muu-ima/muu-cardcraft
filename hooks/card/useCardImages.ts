// hooks/card/useCardImages.ts
"use client";

import { useCallback, useMemo, useState } from "react";
import type { CardImage, Side } from "@/shared/images";

// 依存なしで動く簡易ID（あとで randomId/uuid に差し替えOK）
function makeId() {
  return `img_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

const MAX_IMAGES_PER_SIDE = 3;

type AddFromUploadArgs = {
  assetId: string;
  url: string;
  side: Side;

  // 元画像サイズ
  naturalWidth?: number;
  naturalHeight?: number;

  // 追加時の初期配置（省略時は中央っぽく）
  x?: number;
  y?: number;
  w?: number;
  h?: number;
};

export function useCardImages(initial: CardImage[] = []) {
  const [images, setImages] = useState<CardImage[]>(initial);

  const countImagesFor = useCallback(
    (side: Side) => images.filter((it) => it.side === side).length,
    [images],
  );

  const addFromUpload = useCallback(
    (args: AddFromUploadArgs) => {
      const currentCount = images.filter((it) => it.side === args.side).length;

      if (currentCount >= MAX_IMAGES_PER_SIDE) {
        return {
          ok: false as const,
          reason: "limit" as const,
        };
      }

      const MIN_W = 140;
      const MIN_H = 100;

      let initialW = args.w ?? MIN_W;
      let initialH = args.h ?? MIN_H;

      if (!args.w && !args.h && args.naturalWidth && args.naturalHeight) {
        const scale = Math.min(
          MIN_W / args.naturalWidth,
          MIN_H / args.naturalHeight,
          1,
        );

        initialW = Math.round(args.naturalWidth * scale);
        initialH = Math.round(args.naturalHeight * scale);
      }

      const img: CardImage = {
        id: makeId(),
        assetId: args.assetId,
        url: args.url,
        side: args.side,
        x: args.x ?? 80,
        y: args.y ?? 80,
        w: initialW,
        h: initialH,
        rotate: 0,
      };

      setImages((prev) => [...prev, img]);

      return {
        ok: true as const,
        image: img,
      };
    },
    [images],
  );

  const updateImage = useCallback(
    (id: string, patch: Partial<Omit<CardImage, "id">>) => {
      setImages((prev) =>
        prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      );
    },
    [],
  );

  const moveImage = useCallback((id: string, x: number, y: number) => {
    setImages((prev) =>
      prev.map((it) => (it.id === id ? { ...it, x, y } : it)),
    );
  }, []);

  const resizeImage = useCallback((id: string, w: number, h: number) => {
    const MIN_W = 140;
    const MIN_H = 100;

    setImages((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              w: Math.max(MIN_W, Math.round(w)),
              h: Math.max(MIN_H, Math.round(h)),
            }
          : it,
      ),
    );
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clearSide = useCallback((side: Side) => {
    setImages((prev) => prev.filter((it) => it.side !== side));
  }, []);

  const getImagesFor = useCallback(
    (side: Side) => images.filter((it) => it.side === side),
    [images],
  );

  const api = useMemo(
    () => ({
      images,
      setImages, // history連携したくなったら、ここを封印して actions経由にする
      addFromUpload,
      updateImage,
      moveImage,
      resizeImage,
      removeImage,
      clearSide,
      getImagesFor,
      countImagesFor,
      maxImagesPerSide: MAX_IMAGES_PER_SIDE,
    }),
    [
      images,
      addFromUpload,
      updateImage,
      moveImage,
      resizeImage,
      removeImage,
      clearSide,
      getImagesFor,
      countImagesFor,
    ],
  );

  return api;
}
