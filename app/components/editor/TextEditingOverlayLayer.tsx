"use client";

import InlineTextareaOverlay from "@/app/components/editor/InlineTextareaOverlay";
import type { Block } from "@/shared/blocks";

type Props = {
  isPreview: boolean;
  blocks: Block[];
  editingBlockId?: string | null;
  editingText?: string;
  onChangeEditingText?: (text: string) => void;
  onCommitText?: (id: string, text: string) => void;
  onStopEditing?: () => void;
};

export default function TextEditingOverlayLayer({
  isPreview,
  blocks,
  editingBlockId,
  editingText,
  onChangeEditingText,
  onCommitText,
  onStopEditing,
}: Props) {
  if (isPreview) return null;

  return (
    <InlineTextareaOverlay
      blocks={blocks}
      editingBlockId={editingBlockId}
      editingText={editingText}
      onChangeEditingText={onChangeEditingText}
      onCommitText={onCommitText}
      onStopEditing={onStopEditing}
    />
  );
}
