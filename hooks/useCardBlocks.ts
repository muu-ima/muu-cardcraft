// hooks/useCardBlocks.ts
"use client";

import { useRef } from "react";
import { useBlocksHistory } from "@/hooks/card/useBlocksHistory";
import { useBlockActions } from "@/hooks/card/useBlockActions";
import { useBlockDrag } from "@/hooks/card/useBlockDrag";
import { useHistoryHotkeys } from "@/hooks/card/useHistoryHotkeys";
import { useInlineEditing } from "@/hooks/card/useInlineEditing";
import { useExportImage } from "@/hooks/export/useExportImage";
import type { Block } from "@/shared/blocks";

// ✅ 初期ブロックは定数に（毎レンダリングで作らない）
const INITIAL_BLOCKS: Block[] = [
  {
    id: "name",
    type: "text",
    side: "front",
    text: "Pastel Link",
    x: 100,
    y: 120,
    fontSize: 24,
    fontWeight: "bold",
    fontKey: "serif",
  },
  {
    id: "title",
    type: "text",
    side: "front",
    text: "Designer",
    x: 100,
    y: 80,
    fontSize: 18,
    fontWeight: "normal",
    fontKey: "sans",
  },
];

export function useCardBlocks() {
  const { blocks, set, commit, undo, redo, blocksRef, setRef, commitRef } =
    useBlocksHistory(INITIAL_BLOCKS);

  const {
    previewText,
    commitText,
    updateFont,
    updateTextStyle,
    addBlock,
    updateFontSize,
    bumpFontSize,
    setBlockWidth,
    removeBlock,
    setTextColor,
  } = useBlockActions({ set, commit, blocksRef });

  const {
    editingBlockId,
    editingText,
    setEditingText,
    startEditing,
    stopEditing,
  } = useInlineEditing();

  useHistoryHotkeys({ undo, redo });

  // カードと各ブロックの DOM
  const cardRef = useRef<HTMLDivElement | null>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const textSpanRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  const { handlePointerDown } = useBlockDrag({
    blocks,
    blocksRef,
    setRef,
    commitRef,
    cardRef,
    blockRefs,
    editingBlockId,
  });

  const { downloadImage } = useExportImage();

  return {
    blocks,
    addBlock,
    previewText,
    commitText,
    textSpanRefs,
    updateFont,
    updateFontSize,
    updateTextStyle,
    bumpFontSize,
    handlePointerDown,
    cardRef,
    blockRefs,
    downloadImage,
    undo,
    redo,
    editingBlockId,
    editingText,
    setEditingText,
    startEditing,
    stopEditing,
    setBlockWidth,
    removeBlock,
    setTextColor,
  };
}
