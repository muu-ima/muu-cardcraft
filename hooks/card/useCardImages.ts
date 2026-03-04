// hooks/card/useCardImages.ts
"use client";

import { useCallback, useMemo, useState } from "react";
import type { CardImage, Side } from "@/shared/images";

// 依存なしで動く簡易ID（あとで randomId/uuid に差し替えOK）
function makeId() {
  return `img_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

type AddFromUploadArgs = {
  assetId: string;
  url: string;
  side: Side;

  // 追加時の初期配置（省略時は中央っぽく）
  x?: number;
  y?: number;
  w?: number;
  h?: number;
};

export function useCardImages(initial: CardImage[] = []) {
  const [images, setImages] = useState<CardImage[]>(initial);

  const addFromUpload = useCallback((args: AddFromUploadArgs) => {
    const img: CardImage = {
      id: makeId(),
      assetId: args.assetId,
      url: args.url,
      side: args.side,
      x: args.x ?? 80,
      y: args.y ?? 80,
      w: args.w ?? 220,
      h: args.h ?? 140,
      rotate: 0,
    };
    setImages((prev) => [...prev, img]);
    return img;
  }, []);

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
    setImages((prev) =>
      prev.map((it) => (it.id === id ? { ...it, w, h } : it)),
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
    ],
  );

  return api;
}
