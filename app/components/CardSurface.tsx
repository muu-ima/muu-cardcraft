// app/components/CardSurface.tsx
"use client";

import React, { useRef } from "react";
import type { CSSProperties, RefObject } from "react";
import type { Block } from "@/shared/blocks";
import type { CardImage } from "@/shared/images";
import type { DesignKey } from "@/shared/design";
import { CARD_FULL_DESIGNS } from "@/shared/cardDesigns";
import { FONT_DEFINITIONS } from "@/shared/fonts";

type CardSurfaceProps = {
  blocks: Block[];
  images?: CardImage[];
  design: DesignKey;

  w: number;
  h: number;

  snapGuide?: {
    type: "centerX" | "centerY" | "left" | "top";
    pos: number;
  } | null;

  /** 編集可能か (ドラッグ有無) */
  interactive?: boolean;

  editingBlockId?: string | null;

  /** ブロック押下（選択/ドラッグ開始） */
  onBlockPointerDown?: (
    e: React.PointerEvent<HTMLDivElement>,
    blockId: string,
  ) => void;

  /** 同じブロックを再タップで編集開始 */
  onStartInlineEdit?: (blockId: string) => void;

  /** 外クリック（選択解除など） */
  onSurfacePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;

  /** 選択中ブロック */
  activeBlockId?: string;

  /** editor / export 用 ref */
  cardRef?: RefObject<HTMLDivElement | null>;
  blockRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>;

  /** class / style 拡張 */
  className?: string;
  style?: CSSProperties;
};

function getCardStyle(design: DesignKey): CSSProperties {
  // どれか必ず存在するキー（自分の環境に合わせて）
  const fallbackKey: DesignKey = "mint"; // ← 実際に存在するキー名にする

  const full = CARD_FULL_DESIGNS[design] ?? CARD_FULL_DESIGNS[fallbackKey];
  const bg = full.bg;

  if (!bg.image) return { backgroundColor: bg.color };

  return {
    backgroundImage: `url(${bg.image})`,
    backgroundSize: bg.mode === "contain" ? "contain" : "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: bg.color ?? "#ffffff",
  };
}

export default function CardSurface({
  blocks,
  images = [],
  design,
  w,
  h,
  editingBlockId,
  interactive = false,
  onBlockPointerDown,
  onStartInlineEdit,
  onSurfacePointerDown,
  activeBlockId,
  cardRef,
  blockRefs,
  className,
  snapGuide,
  style,
}: CardSurfaceProps) {
  const lastClickedBlockIdRef = useRef<string | null>(null);

  const handleBlockClick = (block: Block) => {
    if (!interactive) return;
    if (!onStartInlineEdit) return;
    if (block.type !== "text") return;

    const last = lastClickedBlockIdRef.current;

    if (last === block.id && editingBlockId !== block.id) {
      // ✅ 同じブロックを 2 回連続でクリック → 編集開始
      onStartInlineEdit(block.id);
      lastClickedBlockIdRef.current = null; // 1回使ったらリセットしておく
    } else {
      // ✅ 1回目クリック（または別ブロックに切り替え）
      lastClickedBlockIdRef.current = block.id;
    }
  };

  console.log("[CardSurface] images", images);

  return (
    <div
      ref={cardRef}
      onPointerDown={(e) => {
        if (!interactive) return;

        // ✅ ルートで外クリック判定（ブロック以外を押した）
        const target = e.target as HTMLElement;
        const hitBlock = target.closest("[data-block-id]");
        if (!hitBlock) onSurfacePointerDown?.(e);
      }}
      style={{
        width: w,
        height: h,
        position: "relative",
        ...getCardStyle(design),
        ...style,
        touchAction: "none",
      }}
      className={`rounded-xl border shadow-md ${className ?? ""}`}
    >
      {/* 画像レイヤー */}
      {images.map((img: CardImage) => (
        <div
          key={img.id}
          style={{
            position: "absolute",
            left: img.x,
            top: img.y,
            width: img.w,
            height: img.h,
            transform: `rotate(${img.rotate ?? 0}deg)`,
            transformOrigin: "center",
            pointerEvents: "none",
          }}
        >
          <img
            src={img.url}
            alt=""
            draggable={false}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              userSelect: "none",
            }}
          />
        </div>
      ))}
      {blocks.map((block) => {
        const showSelection =
          interactive &&
          activeBlockId === block.id &&
          editingBlockId !== block.id;

        const textColor =
          block.type === "text" ? (block.color ?? "#111827") : undefined;

        return (
          <div
            key={block.id}
            data-block-id={block.id}
            onPointerDown={(e) => {
              if (!interactive) return;
              e.stopPropagation(); // ✅ 外クリック判定に伝播させない
              onBlockPointerDown?.(e, block.id); // ✅ フォーカス/ドラッグ開始
            }}
            onClick={() => handleBlockClick(block)}
            style={{
              position: "absolute",
              top: block.y,
              left: block.x,
              width: block.width ?? "auto",
              textAlign: block.align ?? "left",
              cursor: interactive ? "move" : "default",
              // ✅ padding は外側から外す（リングのズレ原因）
              padding: 0,
              color: textColor,
            }}
            // 「ブロック幅」を示す枠をここ（外側）に出す
            className={[
              "relative select-none",
              showSelection
                ? "ring-2 ring-sky-400/80 ring-offset-2 ring-offset-white rounded-md"
                : "",
            ].join(" ")}
          >
            {/* ✅ リング/実寸/計測は inner に寄せる */}
            <div
              ref={(el) => {
                if (blockRefs) blockRefs.current[block.id] = el; // ✅ 幅計測もここ
              }}
              className={["inline-block rounded px-1 py-0.5"].join(" ")}
              style={{
                fontSize: `${block.fontSize}px`,
                fontWeight: block.fontWeight,
                fontFamily:
                  FONT_DEFINITIONS[block.fontKey]?.css ??
                  FONT_DEFINITIONS.sans.css,
                whiteSpace: "pre",
                width: "max-content",
                maxWidth: "none",
                overflowWrap: "normal",
                wordBreak: "normal",
              }}
            >
              {block.type === "text" &&
                (editingBlockId === block.id ? null : block.text)}
            </div>
            {/* 🆕 幅ラベル（showSelection 中だけ表示） */}
            {showSelection && typeof block.width === "number" && (
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
          </div>
        );
      })}
      {/* ===== Snap Guide Line ===== */}
      {snapGuide && (
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            background: "rgba(0,0,0,0.4)",
            zIndex: 50,

            ...(snapGuide.type === "centerX" || snapGuide.type === "left"
              ? {
                  left: snapGuide.pos,
                  top: 0,
                  width: 1,
                  height: "100%",
                }
              : {
                  top: snapGuide.pos,
                  left: 0,
                  height: 1,
                  width: "100%",
                }),
          }}
        />
      )}
    </div>
  );
}
