"use client";

import React from "react";
import EditableTextLayer from "@/app/components/editor/EditableTextLayer";
import ImageLayer from "@/app/components/cardSurface/ImageLayer";
import type { RenderLayerArgs } from "@/app/components/cardSurface/renderLayer.types";
import type { Block } from "@/shared/blocks";
import type { CardImage } from "@/shared/images";

export function renderLayer({
  layer,
  blocks,
  images,
  interactive,
  activeBlockId,
  editingBlockId,
  selectedImageId,
  dragImageId,
  blockRefs,
  onSelectImage,
  onImagePointerDown,
  onResizeImageStart,
  onBlockPointerDown,
  onBlockClick,
  onResizeBlockStart,
}: RenderLayerArgs) {
  if (layer.kind === "image") {
    const img = images.find((x) => x.id === layer.id);
    if (!img) return null;

    const isDragging = dragImageId === img.id;
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
          onImagePointerDown(e, img);
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
    interactive && activeBlockId === block.id && editingBlockId !== block.id;

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
      onClick={() => onBlockClick(block)}
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
}
