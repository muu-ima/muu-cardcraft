"use client";

import React, { useLayoutEffect, useRef } from "react";
import type { Block } from "@/shared/blocks";
import { FONT_DEFINITIONS, type FontKey } from "@/shared/fonts";

type Props = {
  blocks: Block[];
  editingBlockId?: string | null;
  editingText?: string;
  onChangeEditingText?: (text: string) => void;
  onCommitText?: (id: string, text: string) => void;
  onStopEditing?: () => void;
};

function fontFamilyFromKey(fontKey: FontKey): string {
  switch (fontKey) {
    case "serif":
      return FONT_DEFINITIONS.serif.css;
    case "maru":
      return FONT_DEFINITIONS.maru.css;
    case "script1":
      return FONT_DEFINITIONS.script1.css;
    case "script2":
      return FONT_DEFINITIONS.script2.css;
    case "sans":
    default:
      return FONT_DEFINITIONS.sans.css;
  }
}

export default function InlineTextareaOverlay({
  blocks,
  editingBlockId,
  editingText,
  onChangeEditingText,
  onCommitText,
  onStopEditing,
}: Props) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    if (!editingBlockId) return;

    const editingBlock = blocks.find((block) => block.id === editingBlockId);
    if (!editingBlock || editingBlock.type !== "text") return;

    ta.style.height = "auto";

    if (editingBlock.manualWidth) {
      ta.style.width = `${editingBlock.width ?? 160}px`;
      ta.style.height = `${ta.scrollHeight}px`;
      return;
    }

    const measure = document.createElement("span");
    measure.style.position = "fixed";
    measure.style.left = "-9999px";
    measure.style.top = "-9999px";
    measure.style.visibility = "hidden";
    measure.style.whiteSpace = "pre";
    measure.style.fontSize = `${editingBlock.fontSize ?? 16}px`;
    measure.style.fontWeight = editingBlock.fontWeight ?? "normal";
    measure.style.fontFamily = fontFamilyFromKey(editingBlock.fontKey);
    measure.style.lineHeight = "1.2";
    measure.style.padding = "2px 6px";
    measure.style.boxSizing = "border-box";

    measure.textContent =
      editingText && editingText.length > 0
        ? editingText
        : editingBlock.text || " ";

    document.body.appendChild(measure);

    const naturalWidth = Math.max(
      48,
      Math.ceil(measure.getBoundingClientRect().width) + 16,
    );

    document.body.removeChild(measure);

    ta.style.width = `${naturalWidth}px`;
    ta.style.height = `${ta.scrollHeight}px`;
  }, [editingText, editingBlockId, blocks]);

  if (!editingBlockId) return null;

  const b = blocks.find((x) => x.id === editingBlockId);
  if (!b || b.type !== "text") return null;

  const isManualWidth = b.manualWidth === true;
  const editWidth = isManualWidth ? (b.width ?? 160) : undefined;

  return (
    <textarea
      key={b.id}
      ref={taRef}
      autoFocus
      rows={1}
      value={editingText ?? ""}
      onPointerDown={(e) => e.stopPropagation()}
      onChange={(e) => onChangeEditingText?.(e.currentTarget.value)}
      onBlur={() => {
        onCommitText?.(b.id, editingText ?? "");
        onStopEditing?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onStopEditing?.();
        }
      }}
      style={{
        position: "absolute",
        left: b.x,
        top: b.y,
        width: editWidth,
        minWidth: isManualWidth ? undefined : 40,
        minHeight: (b.fontSize ?? 16) * 1.2 + 8,
        display: "inline-block",

        fontSize: `${b.fontSize}px`,
        fontWeight: b.fontWeight ?? "normal",
        fontFamily: fontFamilyFromKey(b.fontKey),
        textAlign: b.align ?? "left",
        padding: "2px 6px",
        lineHeight: 1.2,

        whiteSpace: isManualWidth ? "pre-wrap" : "pre",
        overflowWrap: isManualWidth ? "break-word" : "normal",
        wordBreak: isManualWidth ? "break-word" : "normal",
        boxSizing: "border-box",

        background: "transparent",
        borderRadius: 6,
        border: "1px solid rgba(236, 72, 153, 0.45)",

        outline: "none",
        resize: "none",
        overflow: "hidden",
        zIndex: 50,
      }}
    />
  );
}
