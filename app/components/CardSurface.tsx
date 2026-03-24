// app/components/CardSurface.tsx
"use client";

import React, { useRef } from "react";
import { useImageDrag } from "@/app/components/cardSurface/useImageDrag";
import { renderLayer } from "@/app/components/cardSurface/renderLayer";
import { getCardSurfaceStyle } from "@/app/components/cardSurface/getCardSurfaceStyle";
import type { CSSProperties, RefObject } from "react";
import type { Block } from "@/shared/blocks";
import type { CardImage } from "@/shared/images";
import type { DesignKey } from "@/shared/design";

type MixedLayer = {
  kind: "block" | "image";
  id: string;
  z: number;
};

type CardSurfaceProps = {
  blocks: Block[];
  images?: CardImage[];
  mixedLayers: MixedLayer[];

  onMoveImage?: (id: string, x: number, y: number) => void;
  design: DesignKey;

  w: number;
  h: number;

  snapGuide?: {
    type: "centerX" | "centerY" | "left" | "top";
    pos: number;
  } | null;

  /** 編集可能か (ドラッグ有無) */
  interactive?: boolean;
  editingBlockId?: string | null;

  /** ブロック押下（選択/ドラッグ開始） */
  onBlockPointerDown?: (
    e: React.PointerEvent<HTMLDivElement>,
    blockId: string,
  ) => void;

  /** 同じブロックを再タップで編集開始 */
  onStartInlineEdit?: (blockId: string) => void;

  /** 外クリック（選択解除など） */
  onSurfacePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;

  /** 選択中ブロック */
  activeBlockId?: string;

  /** editor / export 用 ref */
  cardRef?: RefObject<HTMLDivElement | null>;
  blockRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>;

  /** class / style 拡張 */
  className?: string;
  style?: CSSProperties;

  /** resizeImage */
  selectedImageId?: string | null;
  onSelectImage?: (id: string | null) => void;
  onResizeImageStart?: (
    e: React.PointerEvent,
    image: { id: string; w: number; h: number },
  ) => void;

  onResizeBlockStart?: (
    e: React.PointerEvent,
    block: { id: string; width?: number },
  ) => void;
};

export default function CardSurface({
  blocks,
  images = [],
  mixedLayers = [],
  onMoveImage,
  selectedImageId,
  onSelectImage,
  onResizeImageStart,
  onResizeBlockStart,
  design,
  w,
  h,
  editingBlockId,
  interactive = false,
  onBlockPointerDown,
  onStartInlineEdit,
  onSurfacePointerDown,
  activeBlockId,
  cardRef,
  blockRefs,
  className,
  snapGuide,
  style,
}: CardSurfaceProps) {
  const lastClickedBlockIdRef = useRef<string | null>(null);

  const handleBlockClick = (block: Block) => {
    if (!interactive) return;
    if (!onStartInlineEdit) return;
    if (block.type !== "text") return;

    const last = lastClickedBlockIdRef.current;

    if (last === block.id && editingBlockId !== block.id) {
      // ✅ 同じブロックを 2 回連続でクリック → 編集開始
      onStartInlineEdit(block.id);
      lastClickedBlockIdRef.current = null; // 1回使ったらリセットしておく
    } else {
      // ✅ 1回目クリック（または別ブロックに切り替え）
      lastClickedBlockIdRef.current = block.id;
    }
  };

  const { dragImage, handleImagePointerDown, handlePointerMove, endImageDrag } =
    useImageDrag({
      interactive,
      onMoveImage,
    });

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerUp={endImageDrag}
      onPointerCancel={endImageDrag}
      onPointerDown={(e) => {
        if (!interactive) return;

        const target = e.target as HTMLElement;
        const hitBlock = target.closest("[data-block-id]");
        const hitImage = target.closest("[data-image-id]");

        if (!hitBlock && !hitImage) onSurfacePointerDown?.(e);
      }}
      style={{
        width: w,
        height: h,
        position: "relative",
        ...getCardSurfaceStyle(design),
        ...style,
        touchAction: "none",
      }}
      className={`rounded-xl border shadow-md ${className ?? ""}`}
    >
      {/* z順で統合描画するレイヤー */}{" "}
      {mixedLayers.map((layer) =>
        renderLayer({
          layer,
          blocks,
          images,
          interactive,
          activeBlockId,
          editingBlockId,
          selectedImageId,
          dragImageId: dragImage?.id ?? null,
          blockRefs,
          onSelectImage,
          onImagePointerDown: handleImagePointerDown,
          onResizeImageStart,
          onBlockPointerDown,
          onBlockClick: handleBlockClick,
          onResizeBlockStart,
        }),
      )}
      {/* ===== Snap Guide Line ===== */}
      {snapGuide && (
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            background: "rgba(0,0,0,0.4)",
            zIndex: 50,

            ...(snapGuide.type === "centerX" || snapGuide.type === "left"
              ? {
                  left: snapGuide.pos,
                  top: 0,
                  width: 1,
                  height: "100%",
                }
              : {
                  top: snapGuide.pos,
                  left: 0,
                  height: 1,
                  width: "100%",
                }),
          }}
        />
      )}
    </div>
  );
}
