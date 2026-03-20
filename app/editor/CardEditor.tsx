"use client";

import { useCallback, useRef, useState, useMemo } from "react";
import ModalPreview from "@/app/components/ModalPreview";
import CardSurface from "@/app/components/CardSurface";
import ExportSurface from "@/app/components/ExportSurface";
import InlineTextEditor from "@/app/components/editor/InlineTextEditor";

import { useScaleToFit } from "@/hooks/useScaleToFit";
import { useCardBlocks } from "@/hooks/useCardBlocks";
import { useCardImages } from "@/hooks/card/useCardImages";
import { useEditorLayout } from "@/hooks/useEditorLayout";
import { useCardEditorState } from "@/hooks/useCardEditorState";
import { type DesignKey } from "@/shared/design";
import { CARD_FULL_DESIGNS } from "@/shared/cardDesigns";
import { CARD_BASE_W, CARD_BASE_H } from "@/shared/print";
import { useCardEditorHandlers } from "@/app/editor/hooks/useCardEditorHandlers";
import { CardEditorMobileLayout } from "@/app/editor/CardEditorMobileLayout";
import { CardEditorDesktopLayout } from "@/app/editor/CardEditorDesktopLayout";
import type { SheetSnap, Side } from "./CardEditor.types";
import { useCardEditorLayoutProps } from "@/app/editor/hooks/useCardEditorLayoutProps";
import { buildMixedLayers, type MixedLayerItem } from "@/shared/layers";
import type { SelectedItem } from "@/shared/selection";

type Props = {
  code: string;
};

type EditingState = { id: string; initialText: string } | null;

export default function CardEditor({ code }: Props) {
  // =========================
  // 🧠 1. コア状態 & ロジック
  // =========================
  const [editing, setEditing] = useState<EditingState>(null);
  const [design, setDesign] = useState<DesignKey>("mint");
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    kind: "block",
    id: "name",
  });

  const setSelectedImageIdCompat = (id: string | null) => {
    setSelectedItem(id ? { kind: "image", id } : null);
  };

  const activeBlockId = selectedItem?.kind === "block" ? selectedItem.id : "";

  const selectedImageId =
    selectedItem?.kind === "image" ? selectedItem.id : null;

  const setActiveBlockIdCompat = (id: string) => {
    setSelectedItem(id ? { kind: "block", id } : null);
  };

  const exportRef = useRef<HTMLDivElement | null>(null);

  // ✅ CanvasArea 自体の ref（スクロール/レイアウト用）
  const canvasAreaRef = useRef<HTMLDivElement | null>(null);
  // scale（mobile / desktop）
  const { ref: scaleWrapRefMobile, scale: scaleMobile } = useScaleToFit(
    CARD_BASE_W,
    true,
  );

  const { ref: scaleWrapRefDesktop, scale: scaleDesktop } = useScaleToFit(
    CARD_BASE_W,
    true,
  );

  const {
    blocks: editableBlocks,
    setBlocks,
    addBlock,
    previewText,
    commitText,
    updateFont,
    updateTextStyle,
    bumpFontSize,
    handlePointerDown: dragPointerDown,
    snapGuide,
    cardRef,
    blockRefs,
    downloadImage,
    undo,
    redo,
    editingBlockId,
    startEditing,
    stopEditing,
    editingText,
    setEditingText,
    setBlockWidth,
    removeBlock,
    setTextColor,
    previewTextColor,
    updateBlockZ,
  } = useCardBlocks();

  const {
    images,
    setImages,
    addFromUpload,
    getImagesFor,
    moveImage,
    resizeImage,
    removeImage,
    countImagesFor,
    maxImagesPerSide,
  } = useCardImages();

  const editor = useCardEditorState({
    editableBlocks,
    design,
    setDesign,
    cardRef,
    blockRefs,
    previewText,
    commitText,
    updateTextStyle,
    bumpFontSize,
    dragPointerDown,
    activeBlockId,
    setActiveBlockId: setActiveBlockIdCompat,
  });

  const { state, actions, selectors } = editor;

  const { sheetTitle } = useEditorLayout({
    activeTab: state.activeTab,
    isPreview: state.isPreview,
  });

  const [sheetSnap, setSheetSnap] = useState<SheetSnap>("collapsed");

  const getBlocksFor = (s: Side) =>
    s === "front" ? editableBlocks : CARD_FULL_DESIGNS[design].back.blocks;

  const mixedLayers = useMemo(
    () => buildMixedLayers(getBlocksFor(state.side), getImagesFor(state.side)),
    [state.side, editableBlocks, images, design, getImagesFor],
  );
  // いま編集してる面
  const currentBlocks = getBlocksFor(state.side);
  const currentImages = getImagesFor(state.side);
  const centerWrapRef = useRef<HTMLDivElement | null>(null);

  const handlers = useCardEditorHandlers({
    state,
    actions,
    editing,
    setEditing,
    currentBlocks,
    currentImages,
    commitText,
    previewText,
    setBlockWidth,
    dragPointerDown,
    addFromUpload,
    setSheetSnap,
    cardRef,
    centerWrapRef,
    activeBlockId: state.activeBlockId,
    selectedImageId,
    setBlocks,
    setImages,
  });

  const centerVisible = selectors.centerVisible;
  const centerToolbarValue = selectors.centerToolbarValue;

  // =========================
  // 📦 Layout Props
  // =========================

  const { desktopProps, mobileProps } = useCardEditorLayoutProps({
    code,
    state,
    actions,
    openTab: handlers.openTab,
    closeSheet: handlers.closeSheet,
    sheetTitle,
    sheetSnap,
    setSheetSnap,
    canvasAreaRef,
    centerWrapRef,
    scaleWrapRefDesktop,
    scaleWrapRefMobile,
    scaleDesktop,
    scaleMobile,
    getBlocksFor,
    getImagesFor,
    mixedLayers,
    moveImage,
    resizeImage,
    editableBlocks,
    addBlock,
    onChangeText: handlers.onChangeText,
    onCommitText: handlers.onCommitText,
    updateFont,
    bumpFontSize,
    design,
    setDesign,
    onChangeWidth: handlers.handleChangeBlockWidth,
    setTextColor,
    previewTextColor,
    onUploadedImage: handlers.onUploadedImage,
    currentImageCount: countImagesFor(state.side),
    maxImageCount: maxImagesPerSide,
    onDeleteImage: removeImage,
    exportRef,
    downloadImage,
    onAnyPointerDownCapture: handlers.onAnyPointerDownCapture,
    centerToolbarValue,
    centerVisible,
    handleBlockPointerDown: handlers.handleBlockPointerDown,
    startEditing,
    editingBlockId,
    editingText,
    setEditingText,
    stopEditing,
    snapGuide,
    cardRef,
    blockRefs,
    undo,
    redo,
    removeBlock,
    selectedImageId,
    setSelectedImageId: setSelectedImageIdCompat,
    onBringSelectedImageToFront: handlers.bringSelectionToFront,
    onSendSelectedImageToBack: handlers.sendSelectionToBack,
    setActiveBlockId: setActiveBlockIdCompat,
    onMoveLayerFront: handlers.onMoveLayerFront,
    onMoveLayerBack: handlers.onMoveLayerBack,
    onDeleteLayer: handlers.onDeleteLayer,
    onMoveLayerForward: handlers.onMoveLayerForward,
    onMoveLayerBackward: handlers.onMoveLayerBackward,
  });

  // =========================
  // 🎨 2. レイアウト描画
  // =========================
  return (
    <div
      className="relative h-dvh w-full"
      style={{
        background:
          "linear-gradient(135deg, #eef3f8 0%, #f7eef2 55%, #eef4ff 100%)",
      }}
    >
      {/* ---------- Mobile (<768px) ---------- */}
      <div className="md:hidden">
        <CardEditorMobileLayout {...mobileProps} />
      </div>

      {/* ---------- Desktop / Tablet (>=768px) ---------- */}
      <div className="hidden md:block">
        <CardEditorDesktopLayout {...desktopProps} />
      </div>
      {/* ---------- Preview / Export / Inline Editor ---------- */}
      {/* ここは「出力モデル」担当 */}
      {/* ModalPreview / ExportSurface / InlineTextEditor はそのまま */}
      <ModalPreview
        open={state.isPreview}
        onClose={() => actions.setIsPreview(false)}
        title="プレビュー"
      >
        {({ scale }) => (
          <div
            style={{ width: CARD_BASE_W * scale, height: CARD_BASE_H * scale }}
          >
            <div
              style={{
                width: CARD_BASE_W,
                height: CARD_BASE_H,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <CardSurface
                blocks={getBlocksFor(state.side)}
                images={getImagesFor(state.side)}
                mixedLayers={mixedLayers}
                onMoveImage={moveImage}
                design={design}
                w={CARD_BASE_W}
                h={CARD_BASE_H}
                interactive={false}
                activeBlockId={undefined}
                onSurfacePointerDown={() => {
                  handlers.resetEditingState("commit");
                }}
                className="shadow-lg"
              />
            </div>
          </div>
        )}
      </ModalPreview>
      <ExportSurface
        ref={exportRef}
        blocks={getBlocksFor(state.side)}
        images={getImagesFor(state.side)}
        design={design}
      />
      {editing && (
        <InlineTextEditor
          targetEl={blockRefs.current[editing.id]}
          text={
            (currentBlocks.find((b) => b.id === editing.id && b.type === "text")
              ?.text as string) ?? ""
          }
          onChangeText={(next) => previewText(editing.id, next)}
          onCommit={() => {
            const b = currentBlocks.find((x) => x.id === editing.id);
            if (b && b.type === "text") commitText(editing.id, b.text);
            setEditing(null);
          }}
          onCancel={() => {
            previewText(editing.id, editing.initialText);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
