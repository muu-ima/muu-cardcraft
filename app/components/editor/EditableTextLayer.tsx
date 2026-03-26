"use client";

import React from "react";
import { FONT_DEFINITIONS } from "@/shared/fonts";
import type { Block } from "@/shared/blocks";

type Props = {
  block: Block;
  interactive?: boolean;
  showSelection?: boolean;
  isEditing?: boolean;
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onResizeHandlePointerDown?: React.PointerEventHandler<HTMLButtonElement>;
  contentRef?: (el: HTMLDivElement | null) => void;
};

export default function EditableTextLayer({
  block,
  interactive = false,
  showSelection = false,
  isEditing = false,
  onPointerDown,
  onClick,
  onResizeHandlePointerDown,
  contentRef,
}: Props) {
  const textColor =
    block.type === "text" ? (block.color ?? "#111827") : undefined;

  const hasFixedWidth = typeof block.width === "number";

  return (
    <div
      data-block-id={block.id}
      onPointerDown={onPointerDown}
      onClick={onClick}
      style={{
        position: "absolute",
        top: block.y,
        left: block.x,
        zIndex: block.z,
        width: hasFixedWidth ? block.width : undefined,
        minWidth: 0,
        textAlign: block.align ?? "left",
        cursor: interactive ? "move" : "default",
        padding: 0,
        color: textColor,
      }}
      className={[
        "relative select-none",
        showSelection
          ? "ring-2 ring-sky-400/80 ring-offset-2 ring-offset-white rounded-md"
          : "",
      ].join(" ")}
    >
      <div
        ref={(el) => {
          contentRef?.(el);
        }}
        className="block rounded px-1 py-0.5"
        style={{
          display: "inline-block",
          fontSize: `${block.fontSize}px`,
          fontWeight: block.fontWeight,
          fontFamily:
            FONT_DEFINITIONS[block.fontKey]?.css ?? FONT_DEFINITIONS.sans.css,
          whiteSpace: "pre-wrap",
          width: hasFixedWidth ? "100%" : "fit-content",
          maxWidth: hasFixedWidth ? "100%" : "none",
          minWidth: 0,
          boxSizing: "border-box",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {block.type === "text" && (isEditing ? null : block.text)}
      </div>

      {showSelection && (
        <>
          <button
            type="button"
            data-block-resize-handle="true"
            onPointerDown={onResizeHandlePointerDown}
            aria-label="テキスト幅を変更"
            style={{
              position: "absolute",
              right: -10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 10,
              height: 34,
              borderRadius: 9999,
              border: "1.5px solid #60a5fa",
              background: "rgba(255,255,255,0.96)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
              cursor: "ew-resize",
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
            className="transition hover:scale-105 active:scale-100"
          >
            <span
              aria-hidden="true"
              style={{
                width: 2,
                height: 16,
                borderRadius: 9999,
                background: "#60a5fa",
                boxShadow: "4px 0 0 #60a5fa, -4px 0 0 #60a5fa",
              }}
            />
          </button>

          {typeof block.width === "number" && (
            <div
              className="
          pointer-events-none
          absolute -top-4 right-0
          text-[10px]
          rounded-full border border-zinc-200
          bg-white/90 px-2 py-0.5
          text-zinc-500 shadow-sm
        "
            >
              {Math.round(block.width)}px
            </div>
          )}
        </>
      )}
    </div>
  );
}
