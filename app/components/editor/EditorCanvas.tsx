// app/components/editor/EditorCanvas.tsx
"use client";

import React from "react";
import CardSurface from "@/app/components/CardSurface";
import TextEditingOverlayLayer from "@/app/components/editor/TextEditingOverlayLayer";
import CanvasFrame from "@/app/components/editor/CanvasFrame";
import { useEditorCanvasHandlers } from "@/app/components/editor/useEditorCanvasHandlers";
import { useCanvasResize } from "@/app/components/editor/useCanvasResize";
import type { Block } from "@/shared/blocks";
import type { DesignKey } from "@/shared/design";
import { CARD_BASE_W, CARD_BASE_H } from "@/shared/print";
import type { CardImage } from "@/shared/images";

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
  const { onResizeStart, onResizeBlockStart } = useCanvasResize({
    scale,
    resizeImage,
    onChangeWidth,
    blockRefs,
  });

  const { handleSurfacePointerDown, handleBlockPointerDown } =
    useEditorCanvasHandlers({
      scale,
      onSurfacePointerDown,
      onSelectImage,
      onPointerDown,
    });

  return (
    <CanvasFrame
      cardRef={cardRef}
      scale={scale}
      cardW={CARD_BASE_W}
      cardH={CARD_BASE_H}
      isPreview={isPreview}
      showGuides={showGuides}
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
        onSurfacePointerDown={handleSurfacePointerDown}
        onBlockPointerDown={handleBlockPointerDown}
        onStartInlineEdit={onStartInlineEdit}
        activeBlockId={editingBlockId ? undefined : activeBlockId}
        editingBlockId={editingBlockId}
        blockRefs={blockRefs}
        snapGuide={snapGuide}
        className={isPreview ? "shadow-lg" : ""}
      />

      <TextEditingOverlayLayer
        isPreview={isPreview}
        blocks={blocks}
        editingBlockId={editingBlockId}
        editingText={editingText}
        onChangeEditingText={onChangeEditingText}
        onCommitText={onCommitText}
        onStopEditing={onStopEditing}
      />
    </CanvasFrame>
  );
}
