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
    text: "山田 太郎",
    x: 100,
    y: 120,
    fontSize: 24,
    fontWeight: "bold",
    fontKey: "serif",
  },
  {
    id: "title",
    type: "text",
    text: "デザイナー / Designer",
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

  // ✅ 点字ブロックを追加（最後に追加されたブロックを点字用に変形）
  const addBrailleBlock = () => {
    // まずは通常のブロック追加ロジックを使う
    addBlock();

    // そのあとで「一番最後のブロック」を点字用に上書き
    set((prev) => {
      if (prev.length === 0) return prev;

      const next = [...prev];
      const lastIndex = next.length - 1;
      const last = next[lastIndex];

      next[lastIndex] = {
        ...last,
        text: "⠃⠗⠁⠊⠇⠇⠑", // 初期の点字（braille のつもり）
        // Block 型に isBraille?: boolean が入っている前提
        isBraille: true,
      } as Block;
      // ここでcommit(next)を実行
      commit(next);
      return next;
    });
  };

  return {
    blocks,
    addBlock,
    addBrailleBlock,
    previewText,
    commitText,
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
  };
}
