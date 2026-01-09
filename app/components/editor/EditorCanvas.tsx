// app/components/editor/EditorCanvas.tsx
"use client";

import React, { useLayoutEffect, useRef } from "react";
import CardSurface from "@/app/components/CardSurface";
import PrintGuides from "@/app/components/editor/PrintGuides";
import type { Block } from "@/shared/blocks";
import type { DesignKey } from "@/shared/design";
import { CARD_BASE_W, CARD_BASE_H } from "@/shared/print";

type Props = {
  blocks: Block[];
  design: DesignKey;
  scale: number;
  activeBlockId?: string;
  isPreview: boolean;
  showGuides: boolean;

  onPointerDown?: (
    e: React.PointerEvent,
    id: string,
    opts: { scale: number }
  ) => void;
  /** 同じブロックを再タップで編集開始 */
  onStartInlineEdit?: (blockId: string) => void;

  // refs
  cardRef: React.RefObject<HTMLDivElement | null>;
  blockRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;

  // outside click etc
  onSurfacePointerDown?: () => void;

  // inline editing
  editingBlockId?: string | null;
  onStopEditing?: () => void;
  onPreviewText?: (id: string, text: string) => void;
  onCommitText?: (id: string, text: string) => void;
  editingText?: string;
  onChangeEditingText?: (text: string) => void;
};

export default function EditorCanvas({
  blocks,
  design,
  scale,
  isPreview,
  showGuides,
  onPointerDown,
  onStartInlineEdit,
  activeBlockId,
  cardRef,
  blockRefs,
  onSurfacePointerDown,
  editingBlockId,
  onStopEditing,
  onCommitText,
  editingText,
  onChangeEditingText,
}: Props) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  useLayoutEffect(() => {
    if (isPreview) return;

    const ta = taRef.current;
    if (!ta) return;

    if (!editingBlockId) {
      // 編集終了時：サイズ指定を外す（任意）
      ta.style.width = "";
      ta.style.height = "";
      return;
    }

    const b = blocks.find((x) => x.id === editingBlockId);
    if (!b || b.type !== "text") return;

    const el = blockRefs.current[b.id];
    if (!el) return;

    const r = el.getBoundingClientRect();

    const w = r.width / scale;
    const h = r.height / scale;

    ta.style.width = `${Math.max(20, w)}px`;
    ta.style.height = `${Math.max(20, h)}px`;
  }, [isPreview, editingBlockId, blocks, scale, blockRefs]);

  return (
    <section className="flex flex-col items-center gap-3">
      <div className="w-full flex justify-center">
        <div
          className="relative mx-auto"
          style={{
            width: CARD_BASE_W * scale,
            height: CARD_BASE_H * scale,
          }}
        >
          {/* ✅ scaleする箱（ここが Card + textarea の共通親） */}
          <div
            ref={cardRef} // ✅ ここに付けるのが重要
            className={[
              "relative",
              isPreview ? "overflow-hidden" : "overflow-visible",
            ].join(" ")}
            style={{
              width: CARD_BASE_W,
              height: CARD_BASE_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <CardSurface
              blocks={blocks}
              design={design}
              w={CARD_BASE_W}
              h={CARD_BASE_H}
              interactive={!isPreview}
              onSurfacePointerDown={() => onSurfacePointerDown?.()}
              onBlockPointerDown={(e, id) => onPointerDown?.(e, id, { scale })}
              onStartInlineEdit={onStartInlineEdit}
              activeBlockId={editingBlockId ? undefined : activeBlockId}
              editingBlockId={editingBlockId} // ✅ 二重文字防止
              blockRefs={blockRefs}
              className={isPreview ? "shadow-lg" : ""}
            />

            {/* ✅ Inline editor overlay（CardSurface と同じ scale 階層） */}
            {!isPreview &&
              editingBlockId &&
              (() => {
                const b = blocks.find((x) => x.id === editingBlockId);
                if (!b || b.type !== "text") return null;

                function fontFamilyFromKey(fontKey: string) {
                  switch (fontKey) {
                    case "serif":
                      return `"Noto Serif JP", serif`;
                    case "maru":
                      return `"Zen Maru Gothic", sans-serif`;
                    default:
                      return `"Noto Sans JP", system-ui, sans-serif`;
                  }
                }

                return (
                  <textarea
                    key={b.id}
                    autoFocus
                    value={editingText ?? ""}
                    onPointerDown={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      onChangeEditingText?.(e.currentTarget.value)
                    }
                    onBlur={() => {
                      onCommitText?.(b.id, editingText ?? "");
                      onStopEditing?.();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onCommitText?.(b.id, editingText ?? "");
                        onStopEditing?.();
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        onStopEditing?.();
                      }
                    }}
                    style={{
                      position: "absolute",
                      left: b.x,
                      top: b.y,
                      width: b.width ?? "auto",
                      fontSize: `${b.fontSize}px`,
                      fontWeight: b.fontWeight,
                      fontFamily: fontFamilyFromKey(b.fontKey),
                      textAlign: b.align ?? "left",
                      padding: "2px 6px",
                      lineHeight: 1.2,

                      background: "transparent",
                      borderRadius: 6,
                      border: "1px solid rgba(236, 72, 153, 0.45)",

                      outline: "none",
                      resize: "none",
                      zIndex: 50,
                    }}
                  />
                );
              })()}
          </div>

          {showGuides && (
            <PrintGuides
              scale={scale}
              cardW={CARD_BASE_W}
              cardH={CARD_BASE_H}
            />
          )}
        </div>
      </div>
      {!isPreview && (
        <p className="w-full max-w-[480px] text-xs text-zinc-500">
          ※プレビュー時はドラッグできません。編集モードで配置を調整してください。
        </p>
      )}
    </section>
  );
}
