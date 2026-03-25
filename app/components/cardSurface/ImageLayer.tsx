"use client";

import React from "react";
import type { CardImage } from "@/shared/images";

type Props = {
  image: CardImage;
  interactive?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  onResizeHandlePointerDown?: React.PointerEventHandler<HTMLButtonElement>;
};

export default function ImageLayer({
  image,
  interactive = false,
  isSelected = false,
  isDragging = false,
  onPointerDown,
  onResizeHandlePointerDown,
}: Props) {
  return (
    <div
      data-image-id={image.id}
      onPointerDown={onPointerDown}
      style={{
        position: "absolute",
        left: image.x,
        top: image.y,
        width: image.w,
        height: image.h,
        zIndex: image.z,
        transform: `rotate(${image.rotate ?? 0}deg)`,
        transformOrigin: "center",
        cursor: interactive ? (isDragging ? "grabbing" : "grab") : "default",
        userSelect: "none",
        border: isSelected ? "2px solid #2563eb" : "none",
        boxSizing: "border-box",
      }}
    >
      <img
        src={image.url}
        alt=""
        draggable={false}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          userSelect: "none",
        }}
      />

      {interactive && isSelected && (
        <button
          type="button"
          data-resize-handle="true"
          onPointerDown={onResizeHandlePointerDown}
          style={{
            position: "absolute",
            right: -8,
            bottom: -8,
            width: 16,
            height: 16,
            borderRadius: 9999,
            border: "2px solid white",
            background: "#2563eb",
            cursor: "nwse-resize",
          }}
        />
      )}
    </div>
  );
}
