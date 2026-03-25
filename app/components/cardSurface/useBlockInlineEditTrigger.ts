"use client";

import { useRef } from "react";
import type { Block } from "@/shared/blocks";

type Args = {
  interactive: boolean;
  editingBlockId?: string | null;
  onStartInlineEdit?: (blockId: string) => void;
};

export function useBlockInlineEditTrigger({
  interactive,
  editingBlockId,
  onStartInlineEdit,
}: Args) {
  const lastClickedBlockIdRef = useRef<string | null>(null);

  const handleBlockClick = (block: Block) => {
    if (!interactive) return;
    if (!onStartInlineEdit) return;
    if (block.type !== "text") return;

    const last = lastClickedBlockIdRef.current;

    if (last === block.id && editingBlockId !== block.id) {
      onStartInlineEdit(block.id);
      lastClickedBlockIdRef.current = null;
    } else {
      lastClickedBlockIdRef.current = block.id;
    }
  };

  return { handleBlockClick };
}
