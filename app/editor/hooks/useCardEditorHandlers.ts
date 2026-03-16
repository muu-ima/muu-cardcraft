"use client";

import type React from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";

import type { UploadImageAsset } from "@/hooks/card/useUploadImage";
import type { TabKey } from "@/shared/editor";
import type { Block } from "@/shared/blocks";
import type { SheetSnap, Side } from "../CardEditor.types";

type EditingState = { id: string; initialText: string } | null;

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
  currentBlocks: Block[];
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

  currentImages: { id: string; side: Side; z: number }[];
  updateImage: (id: string, patch: { z: number }) => void;
  updateBlockZ: (id: string, z: number) => void;

  activeBlockId?: string;
  selectedImageId?: string | null;
};

export function useCardEditorHandlers({
  state,
  actions,
  editing,
  setEditing,
  currentBlocks,
  commitText,
  previewText,
  setBlockWidth,
  dragPointerDown,
  addFromUpload,
  setSheetSnap,
  cardRef,
  centerWrapRef,
  currentImages,
  updateImage,
  updateBlockZ,
  activeBlockId,
  selectedImageId,
}: UseCardEditorHandlersParams) {
  const onUploadedImage = (asset: UploadImageAsset) => {
    console.log("[onUploadedImage] asset", asset);
    console.log("[onUploadedImage] side before add", state.side);

    const result = addFromUpload({
      assetId: asset.id,
      url: asset.signedUrl,
      side: state.side,
    });

    if (!result.ok) {
      console.warn("この面には画像を最大3枚まで追加できます");
      return;
    }

    console.log("[onUploadedImage] added", result.image);
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
    if (state.side !== "front") return;
    previewText(id, value);
  };

  const onCommitText = (id: string, value: string) => {
    if (state.side !== "front") return;
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

  const buildLayerItems = () => {
    return [
      ...currentBlocks
        .filter((b) => b.side === state.side)
        .map((b) => ({ id: b.id, kind: "block" as const, z: b.z })),
      ...currentImages
        .filter((img) => img.side === state.side)
        .map((img) => ({ id: img.id, kind: "image" as const, z: img.z })),
    ];
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

  const applyZToSelection = (z: number) => {
    const target = getSelectedLayerTarget();
    if (!target) return;

    if (target.kind === "image") {
      updateImage(target.id, { z });
      return;
    }

    updateBlockZ(target.id, z);
  };

  const bringSelectionToFront = () => {
    const layerItems = buildLayerItems();
    if (layerItems.length === 0) return;

    const maxZ = Math.max(...layerItems.map((it) => it.z));
    applyZToSelection(maxZ + 1);
  };

  const sendSelectionToBack = () => {
    const layerItems = buildLayerItems();
    if (layerItems.length === 0) return;

    const minZ = Math.min(...layerItems.map((it) => it.z));
    applyZToSelection(Math.max(1, minZ - 1));
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
  };
}
