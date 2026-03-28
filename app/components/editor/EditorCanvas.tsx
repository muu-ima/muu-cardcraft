// app/components/editor/EditorCanvas.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import CardSurface from "@/app/components/CardSurface";
import TextEditingOverlayLayer from "@/app/components/editor/TextEditingOverlayLayer";
import CanvasFrame from "@/app/components/editor/CanvasFrame";
import CanvasScrollbar from "@/app/components/editor/CanvasScroollbar";
import { useEditorCanvasHandlers } from "@/app/components/editor/useEditorCanvasHandlers";
import { useCanvasResize } from "@/app/components/editor/useCanvasResize";
import type { Block } from "@/shared/blocks";
import type { DesignKey } from "@/shared/design";
import { CARD_BASE_W, CARD_BASE_H } from "@/shared/print";
import type { CardImage } from "@/shared/images";
import type { Side } from "@/app/editor/CardEditor.types";

type MixedLayer = {
  kind: "block" | "image";
  id: string;
  z: number;
};

type ScrollState = {
  left: number;
  top: number;
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
};

type Props = {
  blocks: Block[];
  images: CardImage[];
  mixedLayers: MixedLayer[];
  design: DesignKey;
  side: Side;
  moveImage: (id: string, x: number, y: number) => void;
  resizeImage: (id: string, w: number, h: number) => void;
  scale: number;
  activeBlockId?: string;
  isPreview: boolean;
  showGuides: boolean;
  isMobile?: boolean;

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
  side,
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
  isMobile,
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

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollClass = isMobile
    ? "relative h-full min-h-0 overflow-hidden"
    : "relative h-full min-h-0 overflow-x-scroll overflow-y-scroll";

  const [scrollState, setScrollState] = useState<ScrollState>({
    left: 0,
    top: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
  });

  const hasHorizontalScroll = scrollState.scrollWidth > scrollState.clientWidth;

  const horizontalTrackWidth = 320;

  const horizontalThumbWidth = hasHorizontalScroll
    ? Math.max(
        (scrollState.clientWidth / scrollState.scrollWidth) *
          horizontalTrackWidth,
        48,
      )
    : horizontalTrackWidth;

  const horizontalThumbLeft =
    hasHorizontalScroll && scrollState.scrollWidth > scrollState.clientWidth
      ? (scrollState.left /
          (scrollState.scrollWidth - scrollState.clientWidth)) *
        (horizontalTrackWidth - horizontalThumbWidth)
      : 0;

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setScrollState({
      left: el.scrollLeft,
      top: el.scrollTop,
      scrollWidth: el.scrollWidth,
      scrollHeight: el.scrollHeight,
      clientWidth: el.clientWidth,
      clientHeight: el.clientHeight,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    const handleScroll = () => {
      updateScrollState();
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  return (
    <div
      ref={scrollRef}
      className={scrollClass}
      style={isMobile ? undefined : { scrollbarGutter: "stable both-edges" }}
    >
      {/* <pre className="absolute left-2 top-2 z-50 bg-black/70 p-2 text-xs text-white">
        {JSON.stringify(
          {
            scrollState,
            hasHorizontalScroll,
            horizontalTrackWidth,
            horizontalThumbWidth,
            horizontalThumbLeft,
          },
          null,
          2,
        )}
      </pre> */}
      <CanvasScrollbar
        visible={!isMobile && hasHorizontalScroll}
        trackWidth={horizontalTrackWidth}
        thumbWidth={horizontalThumbWidth}
        thumbLeft={horizontalThumbLeft}
      />
      <div className="flex min-h-full min-w-full items-start justify-center pt-0 pb-20">
        {" "}
        <div
          style={{
            width: CARD_BASE_W * scale,
            height: CARD_BASE_H * scale,
            position: "relative",
          }}
        >
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
              side={side}
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
        </div>
      </div>
    </div>
  );
}
