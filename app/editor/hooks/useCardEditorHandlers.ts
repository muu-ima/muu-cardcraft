"use client";

import type React from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";

import type { UploadImageAsset } from "@/hooks/card/useUploadImage";
import type { TabKey } from "@/shared/editor";
import type { Block } from "@/shared/blocks";
import type { CardImage, Side } from "@/shared/images";
import {
  buildMixedLayers,
  applyLayerOrderToBlocksAndImages,
  moveToFront,
  moveToBack,
  moveForwardOne,
  moveBackwardOne,
} from "@/shared/layers";

import type { SheetSnap } from "../CardEditor.types";

type EditingState = { id: string; initialText: string } | null;
type LayerMoveAction = "front" | "back" | "forward" | "backward";

type UseCardEditorHandlersParams = {
  state: {
    side: Side;
  };
  actions: {
    onChangeTab: (tab: TabKey) => void;
    setActiveTab: (tab: TabKey | null) => void;
    setActiveBlockId: (id: string) => void;
  };
  editing: EditingState;
  setEditing: Dispatch<SetStateAction<EditingState>>;
  commitText: (id: string, value: string) => void;
  previewText: (id: string, value: string) => void;
  setBlockWidth: (id: string, width: number) => void;
  dragPointerDown: (
    e: React.PointerEvent<Element>,
    blockId: string,
    opts: { scale: number },
  ) => void;
  addFromUpload: (args: { assetId: string; url: string; side: Side }) => {
    ok: boolean;
    image?: unknown;
  };
  setSheetSnap: Dispatch<SetStateAction<SheetSnap>>;
  cardRef: RefObject<HTMLDivElement | null>;
  centerWrapRef: RefObject<HTMLDivElement | null>;
  activeBlockId?: string;
  selectedImageId?: string | null;

  currentBlocks: Block[];
  currentImages: CardImage[];
  setBlocks: (next: Block[] | ((prev: Block[]) => Block[])) => void;
  setImages: (next: CardImage[] | ((prev: CardImage[]) => CardImage[])) => void;
};

export function reorderMixedLayers(params: {
  targetId: string;
  action: LayerMoveAction;
  currentBlocks: Block[];
  currentImages: CardImage[];
  side: Side;
}) {
  const { targetId, action, currentBlocks, currentImages, side } = params;

  const sideBlocks = currentBlocks.filter((b) => b.side === side);
  const otherBlocks = currentBlocks.filter((b) => b.side !== side);

  const sideImages = currentImages.filter((img) => img.side === side);
  const otherImages = currentImages.filter((img) => img.side !== side);

  const mixedLayers = buildMixedLayers(sideBlocks, sideImages);

  let nextLayers = mixedLayers;

  switch (action) {
    case "front":
      nextLayers = moveToFront(mixedLayers, targetId);
      break;
    case "back":
      nextLayers = moveToBack(mixedLayers, targetId);
      break;
    case "forward":
      nextLayers = moveForwardOne(mixedLayers, targetId);
      break;
    case "backward":
      nextLayers = moveBackwardOne(mixedLayers, targetId);
      break;
  }

  const reordered = applyLayerOrderToBlocksAndImages(
    sideBlocks,
    sideImages,
    nextLayers,
  );

  return {
    blocks: [...otherBlocks, ...reordered.blocks],
    images: [...otherImages, ...reordered.images],
  };
}

export function useCardEditorHandlers({
  state,
  actions,
  editing,
  setEditing,
  commitText,
  previewText,
  setBlockWidth,
  dragPointerDown,
  addFromUpload,
  setSheetSnap,
  cardRef,
  centerWrapRef,
  activeBlockId,
  selectedImageId,
  currentBlocks,
  currentImages,
  setBlocks,
  setImages,
}: UseCardEditorHandlersParams) {
  const { side } = state;

  const onUploadedImage = (asset: UploadImageAsset) => {
    const result = addFromUpload({
      assetId: asset.id,
      url: asset.signedUrl,
      side,
    });

    if (!result.ok) {
      console.warn("この面には画像を最大3枚まで追加できます");
      return;
    }
  };

  const openTab = (tab: TabKey) => {
    actions.onChangeTab(tab);
    setSheetSnap((s) => (s === "collapsed" ? "half" : s));
  };

  const closeSheet = () => {
    setSheetSnap("collapsed");
    actions.setActiveTab(null);
  };

  const resetEditingState = (mode: "commit" | "cancel" = "commit") => {
    if (editing) {
      const b = currentBlocks.find((x) => x.id === editing.id);
      if (b) {
        if (mode === "commit") commitText(editing.id, b.text);
        if (mode === "cancel") previewText(editing.id, editing.initialText);
      }
    }

    setEditing(null);
    actions.setActiveBlockId("");
    actions.setActiveTab(null);
  };

  const onAnyPointerDownCapture = (e: React.PointerEvent) => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const target = e.target as Node;

    if (centerWrapRef.current?.contains(target)) return;

    if (!cardEl.contains(target)) {
      if (editing) {
        const b = currentBlocks.find((x) => x.id === editing.id);
        if (b) {
          commitText(editing.id, b.text);
        }
        setEditing(null);
        return;
      }

      actions.setActiveBlockId("");
      actions.setActiveTab(null);
    }
  };

  const onChangeText = (id: string, value: string) => {
    if (side !== "front") return;
    previewText(id, value);
  };

  const onCommitText = (id: string, value: string) => {
    if (side !== "front") return;
    commitText(id, value);
  };

  const handleChangeBlockWidth = (id: string, width: number) => {
    setBlockWidth(id, width);
  };

  const handleBlockPointerDown = (
    e: React.PointerEvent<Element>,
    blockId: string,
    opts: { scale: number },
  ) => {
    if (editing) {
      e.preventDefault();
      e.stopPropagation();

      const cur = currentBlocks.find((x) => x.id === editing.id);
      if (cur) {
        commitText(editing.id, cur.text);
      }

      actions.setActiveBlockId(blockId);

      const next = currentBlocks.find((x) => x.id === blockId);
      if (next) {
        setEditing({ id: blockId, initialText: next.text });
      } else {
        setEditing(null);
      }

      return;
    }

    actions.setActiveBlockId(blockId);
    dragPointerDown(e, blockId, opts);
  };

  const getSelectedLayerTarget = () => {
    if (selectedImageId) {
      return { kind: "image" as const, id: selectedImageId };
    }

    if (activeBlockId) {
      return { kind: "block" as const, id: activeBlockId };
    }

    return null;
  };

  const handleMoveMixedLayer = (
    targetId: string,
    action: "front" | "back" | "forward" | "backward",
  ) => {
    const result = reorderMixedLayers({
      targetId,
      action,
      currentBlocks,
      currentImages,
      side,
    });

    setBlocks(result.blocks);
    setImages(result.images);
  };

  const bringSelectionToFront = () => {
    const target = getSelectedLayerTarget();
    if (!target) return;
    handleMoveMixedLayer(target.id, "front");
  };

  const sendSelectionToBack = () => {
    const target = getSelectedLayerTarget();
    if (!target) return;
    handleMoveMixedLayer(target.id, "back");
  };

  const bringSelectionForwardOne = () => {
    const target = getSelectedLayerTarget();
    if (!target) return;
    handleMoveMixedLayer(target.id, "forward");
  };

  const sendSelectionBackwardOne = () => {
    const target = getSelectedLayerTarget();
    if (!target) return;
    handleMoveMixedLayer(target.id, "backward");
  };

  return {
    onUploadedImage,
    openTab,
    closeSheet,
    resetEditingState,
    onAnyPointerDownCapture,
    onChangeText,
    onCommitText,
    handleChangeBlockWidth,
    handleBlockPointerDown,
    bringSelectionToFront,
    sendSelectionToBack,
    bringSelectionForwardOne,
    sendSelectionBackwardOne,
  };
}
