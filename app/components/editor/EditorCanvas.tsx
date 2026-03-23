// app/components/editor/EditorCanvas.tsx
"use client";

import React, { useState, useEffect } from "react";
import CardSurface from "@/app/components/CardSurface";
import InlineTextareaOverlay from "@/app/components/editor/InlineTextareaOverlay";
import PrintGuides from "@/app/components/editor/PrintGuides";
import type { Block } from "@/shared/blocks";
import type { DesignKey } from "@/shared/design";
import { CARD_BASE_W, CARD_BASE_H } from "@/shared/print";
import type { CardImage } from "@/shared/images";
import {
  IMAGE_MIN_W,
  IMAGE_MIN_H,
  IMAGE_MAX_W,
  IMAGE_MAX_H,
  clamp,
} from "@/shared/images";

type MixedLayer = {
  kind: "block" | "image";
  id: string;
  z: number;
};

type Props = {
  blocks: Block[];
  images: CardImage[];
  mixedLayers: MixedLayer[];
  design: DesignKey;
  moveImage: (id: string, x: number, y: number) => void;
  resizeImage: (id: string, w: number, h: number) => void;
  scale: number;
  activeBlockId?: string;
  isPreview: boolean;
  showGuides: boolean;

  snapGuide?: {
    type: "centerX" | "centerY" | "left" | "top";
    pos: number;
  } | null;

  onPointerDown?: (
    e: React.PointerEvent,
    id: string,
    opts: { scale: number },
  ) => void;
  /** 同じブロックを再タップで編集開始 */
  onStartInlineEdit?: (blockId: string) => void;

  // refs
  cardRef: React.RefObject<HTMLDivElement | null>;
  blockRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;

  // outside click etc
  onSurfacePointerDown?: () => void;

  // inline editing
  editingBlockId?: string | null;
  onStopEditing?: () => void;
  onPreviewText?: (id: string, text: string) => void;
  onCommitText?: (id: string, text: string) => void;
  editingText?: string;
  onChangeEditingText?: (text: string) => void;
  selectedImageId: string | null;
  onSelectImage: (id: string | null) => void;
  onChangeWidth?: (id: string, width: number) => void;
};

export default function EditorCanvas({
  blocks,
  images,
  moveImage,
  resizeImage,
  onChangeWidth,
  design,
  scale,
  isPreview,
  showGuides,
  snapGuide,
  onPointerDown,
  onStartInlineEdit,
  activeBlockId,
  cardRef,
  blockRefs,
  onSurfacePointerDown,
  editingBlockId,
  onStopEditing,
  onCommitText,
  editingText,
  onChangeEditingText,
  selectedImageId,
  onSelectImage,
  mixedLayers,
}: Props) {
  const [resizeState, setResizeState] = useState<{
    id: string;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);

  const [resizeBlockState, setResizeBlockState] = useState<{
    id: string;
    pointerId: number;
    startX: number;
    startWidth: number;
  } | null>(null);

  const onResizeStart = (
    e: React.PointerEvent,
    image: { id: string; w: number; h: number },
  ) => {
    e.stopPropagation();

    setResizeState({
      id: image.id,
      startX: e.clientX,
      startY: e.clientY,
      startW: image.w,
      startH: image.h,
    });
  };

  const onResizeBlockStart = (
    e: React.PointerEvent,
    block: { id: string; width?: number },
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const el = blockRefs.current[block.id];
    const renderedWidth = el
      ? el.getBoundingClientRect().width / scale
      : undefined;

    setResizeBlockState({
      id: block.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startWidth: block.width ?? renderedWidth ?? 40,
    });
  };

  useEffect(() => {
    if (!resizeState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const dx = (e.clientX - resizeState.startX) / scale;
      const dy = (e.clientY - resizeState.startY) / scale;

      const nextW = clamp(resizeState.startW + dx, IMAGE_MIN_W, IMAGE_MAX_W);
      const nextH = clamp(resizeState.startH + dy, IMAGE_MIN_H, IMAGE_MAX_H);

      resizeImage(resizeState.id, nextW, nextH);
    };

    const handlePointerUp = () => {
      setResizeState(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [resizeState, scale, resizeImage]);

  useEffect(() => {
    if (!resizeBlockState) return;
    if (!onChangeWidth) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerId !== resizeBlockState.pointerId) return;

      const dx = (e.clientX - resizeBlockState.startX) / scale;
      const nextWidth = Math.max(40, resizeBlockState.startWidth + dx);

      onChangeWidth(resizeBlockState.id, nextWidth);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerId !== resizeBlockState.pointerId) return;
      setResizeBlockState(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [resizeBlockState, scale, onChangeWidth]);

  return (
    <section className="flex flex-col items-center gap-3">
      <div className="w-full flex justify-center">
        <div
          className="relative mx-auto"
          style={{
            width: CARD_BASE_W * scale,
            height: CARD_BASE_H * scale,
          }}
        >
          {/* ✅ scaleする箱（ここが Card + textarea の共通親） */}
          <div
            ref={cardRef} // ✅ ここに付けるのが重要
            className={[
              "relative",
              isPreview ? "overflow-hidden" : "overflow-visible",
            ].join(" ")}
            style={{
              width: CARD_BASE_W,
              height: CARD_BASE_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <CardSurface
              blocks={blocks}
              images={images}
              mixedLayers={mixedLayers}
              onMoveImage={moveImage}
              selectedImageId={selectedImageId}
              onSelectImage={onSelectImage}
              onResizeImageStart={onResizeStart}
              onResizeBlockStart={onResizeBlockStart}
              design={design}
              w={CARD_BASE_W}
              h={CARD_BASE_H}
              interactive={!isPreview}
              onSurfacePointerDown={(e) => {
                onSurfacePointerDown?.();
                onSelectImage(null);
              }}
              onBlockPointerDown={(e, id) => onPointerDown?.(e, id, { scale })}
              onStartInlineEdit={onStartInlineEdit}
              activeBlockId={editingBlockId ? undefined : activeBlockId}
              editingBlockId={editingBlockId} // ✅ 二重文字防止
              blockRefs={blockRefs}
              snapGuide={snapGuide}
              className={isPreview ? "shadow-lg" : ""}
            />

            {/* ✅ Inline editor overlay（CardSurface と同じ scale 階層） */}
            {!isPreview && (
              <InlineTextareaOverlay
                blocks={blocks}
                editingBlockId={editingBlockId}
                editingText={editingText}
                onChangeEditingText={onChangeEditingText}
                onCommitText={onCommitText}
                onStopEditing={onStopEditing}
              />
            )}
          </div>

          {showGuides && (
            <PrintGuides
              scale={scale}
              cardW={CARD_BASE_W}
              cardH={CARD_BASE_H}
            />
          )}
        </div>
      </div>
      {!isPreview && (
        <p className="w-full max-w-[480px] text-xs text-zinc-500">
          ※プレビュー時はドラッグできません。編集モードで配置を調整してください。
        </p>
      )}
    </section>
  );
}
