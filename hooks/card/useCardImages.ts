// hooks/card/useCardImages.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { moveToBack, moveToFront } from "@/shared/layers";
import type { CardImage, Side } from "@/shared/images";
import {
  IMAGE_MIN_W,
  IMAGE_MIN_H,
  IMAGE_MAX_W,
  IMAGE_MAX_H,
  clamp,
} from "@/shared/images";

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

  useEffect(() => {
    console.log(
      "[useCardImages] images",
      images.map((img) => ({
        id: img.id,
        side: img.side,
        z: img.z,
        assetId: img.assetId,
      })),
    );
  }, [images]);

  const countImagesFor = useCallback(
    (side: Side) => images.filter((it) => it.side === side).length,
    [images],
  );

  const addFromUpload = useCallback(
    (args: AddFromUploadArgs) => {
      const currentCount = images.filter((it) => it.side === args.side).length;
      const nextZ =
        images
          .filter((it) => it.side === args.side)
          .reduce((max, it) => Math.max(max, it.z), 0) + 1;

      if (currentCount >= MAX_IMAGES_PER_SIDE) {
        return {
          ok: false as const,
          reason: "limit" as const,
        };
      }

      let initialW = args.w ?? IMAGE_MIN_W;
      let initialH = args.h ?? IMAGE_MIN_H;

      if (!args.w && !args.h && args.naturalWidth && args.naturalHeight) {
        const scale = Math.min(
          IMAGE_MIN_W / args.naturalWidth,
          IMAGE_MIN_H / args.naturalHeight,
          1,
        );

        initialW = Math.round(args.naturalWidth * scale);
        initialH = Math.round(args.naturalHeight * scale);
      }

      initialW = clamp(Math.round(initialW), IMAGE_MIN_W, IMAGE_MAX_W);
      initialH = clamp(Math.round(initialH), IMAGE_MIN_H, IMAGE_MAX_H);

      const img: CardImage = {
        id: makeId(),
        assetId: args.assetId,
        url: args.url,
        side: args.side,
        x: args.x ?? 80,
        y: args.y ?? 80,
        z: nextZ,
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
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                ...patch,
                z:
                  patch.z !== undefined
                    ? Math.max(1, Math.round(patch.z))
                    : it.z,
              }
            : it,
        ),
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
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              w: clamp(Math.round(w), IMAGE_MIN_W, IMAGE_MAX_W),
              h: clamp(Math.round(h), IMAGE_MIN_H, IMAGE_MAX_H),
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

  const bringImageToFront = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (!target) return prev;

      const sameSide = prev.filter((img) => img.side === target.side);
      const others = prev.filter((img) => img.side !== target.side);

      const reordered = moveToFront(sameSide, id);

      console.log("[bringImageToFront]", {
        targetId: id,
        side: target.side,
        reordered: reordered.map((img) => ({
          id: img.id,
          z: img.z,
          assetId: img.assetId,
        })),
      });

      return [...others, ...reordered];
    });
  }, []);

  const sendImageToBack = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (!target) return prev;

      const sameSide = prev.filter((img) => img.side === target.side);
      const others = prev.filter((img) => img.side !== target.side);

      const reordered = moveToBack(sameSide, id);

      console.log("[sendImageToBack]", {
        targetId: id,
        side: target.side,
        reordered: reordered.map((img) => ({
          id: img.id,
          z: img.z,
          assetId: img.assetId,
        })),
      });

      return [...others, ...reordered];
    });
  }, []);

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
      bringImageToFront,
      sendImageToBack,
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
      bringImageToFront,
      sendImageToBack,
    ],
  );

  return api;
}
