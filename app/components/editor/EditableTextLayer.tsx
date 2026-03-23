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
        width: block.width ?? "auto",
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
        ref={contentRef}
        className="block rounded px-1 py-0.5"
        style={{
          fontSize: `${block.fontSize}px`,
          fontWeight: block.fontWeight,
          fontFamily:
            FONT_DEFINITIONS[block.fontKey]?.css ?? FONT_DEFINITIONS.sans.css,
          whiteSpace: "pre-wrap",
          width: "100%",
          maxWidth: "100%",
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
            style={{
              position: "absolute",
              right: -8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 16,
              height: 16,
              borderRadius: 9999,
              border: "2px solid white",
              background: "#2563eb",
              cursor: "ew-resize",
              pointerEvents: "auto",
            }}
          />

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
