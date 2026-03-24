// app/components/CardSurface.tsx
"use client";

import React, { useRef, useState, useCallback } from "react";
import EditableTextLayer from "@/app/components/editor/EditableTextLayer";
import ImageLayer from "@/app/components/cardSurface/ImageLayer";
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

type DragImageState = {
  id: string;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
} | null;

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
  const [dragImage, setDragImage] = useState<DragImageState>(null);

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

  const handleImagePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, img: CardImage) => {
      const target = e.target as HTMLElement;
      const isResizeHandle = target.closest("[data-resize-handle='true']");
      if (isResizeHandle) return;

      if (!interactive) return;
      if (!onMoveImage) return;

      e.preventDefault();
      e.stopPropagation();

      setDragImage({
        id: img.id,
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: img.x,
        startY: img.y,
      });
    },
    [interactive, onMoveImage],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragImage) return;
      if (!onMoveImage) return;
      if (e.pointerId !== dragImage.pointerId) return;

      const dx = e.clientX - dragImage.startClientX;
      const dy = e.clientY - dragImage.startClientY;

      const nextX = dragImage.startX + dx;
      const nextY = dragImage.startY + dy;

      onMoveImage(dragImage.id, nextX, nextY);
    },
    [dragImage, onMoveImage],
  );

  const endImageDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragImage) return;
      if (e.pointerId !== dragImage.pointerId) return;
      setDragImage(null);
    },
    [dragImage],
  );

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
      {mixedLayers.map((layer) => {
        if (layer.kind === "image") {
          const img = images.find((x) => x.id === layer.id);
          if (!img) return null;

          const isDragging = dragImage?.id === img.id;
          const isSelected = selectedImageId === img.id;

          return (
            <ImageLayer
              key={img.id}
              image={img}
              interactive={interactive}
              isSelected={isSelected}
              isDragging={isDragging}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelectImage?.(img.id);
                handleImagePointerDown(e, img);
              }}
              onResizeHandlePointerDown={(e) => {
                e.stopPropagation();
                onResizeImageStart?.(e, img);
              }}
            />
          );
        }

        const block = blocks.find((x) => x.id === layer.id);
        if (!block) return null;

        const showSelection =
          interactive &&
          activeBlockId === block.id &&
          editingBlockId !== block.id;

        return (
          <EditableTextLayer
            key={block.id}
            block={block}
            interactive={interactive}
            showSelection={showSelection}
            isEditing={editingBlockId === block.id}
            onPointerDown={(e) => {
              if (!interactive) return;

              const target = e.target as HTMLElement;
              const isResizeHandle = target.closest(
                "[data-block-resize-handle='true']",
              );
              if (isResizeHandle) return;

              e.stopPropagation();
              onBlockPointerDown?.(e, block.id);
            }}
            onClick={() => handleBlockClick(block)}
            contentRef={(el) => {
              if (!blockRefs) return;

              if (!el) {
                blockRefs.current[block.id] = null;
                return;
              }

              const width = el.getBoundingClientRect().width;
              if (width > 0) {
                blockRefs.current[block.id] = el;
              }
            }}
            onResizeHandlePointerDown={(e) => {
              e.stopPropagation();
              onResizeBlockStart?.(e, {
                id: block.id,
                width: block.width,
              });
            }}
          />
        );
      })}
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
