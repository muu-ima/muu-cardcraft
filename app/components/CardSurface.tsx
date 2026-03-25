// app/components/CardSurface.tsx
"use client";

import { useImageDrag } from "@/app/components/cardSurface/useImageDrag";
import { renderLayer } from "@/app/components/cardSurface/renderLayer";
import { getCardSurfaceStyle } from "@/app/components/cardSurface/getCardSurfaceStyle";
import { useBlockInlineEditTrigger } from "@/app/components/cardSurface/useBlockInlineEditTrigger";
import { createSurfacePointerDownHandler } from "@/app/components/cardSurface/createSurfacePointerDownHandler";
import { SurfaceSnapGuide } from "@/app/components/cardSurface/SurfaceSnapGuide";
import type { CardSurfaceProps } from "@/app/components/cardSurface/CardSurface.types";

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
  const { handleBlockClick } = useBlockInlineEditTrigger({
    interactive,
    editingBlockId,
    onStartInlineEdit,
  });

  const { dragImage, handleImagePointerDown, handlePointerMove, endImageDrag } =
    useImageDrag({
      interactive,
      onMoveImage,
    });

  const handleSurfacePointerDown = createSurfacePointerDownHandler({
    interactive,
    onSurfacePointerDown,
  });

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerUp={endImageDrag}
      onPointerCancel={endImageDrag}
      onPointerDown={handleSurfacePointerDown}
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
      <SurfaceSnapGuide snapGuide={snapGuide} />
    </div>
  );
}
