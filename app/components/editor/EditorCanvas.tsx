// app/components/editor/EditorCanvas.tsx
"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import CardSurface from "@/app/components/CardSurface";
import PrintGuides from "@/app/components/editor/PrintGuides";
import type { Block } from "@/shared/blocks";
import type { DesignKey } from "@/shared/design";
import { CARD_BASE_W, CARD_BASE_H } from "@/shared/print";
import { FONT_DEFINITIONS, type FontKey } from "@/shared/fonts";

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
    opts: { scale: number },
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
  console.log("[EditorCanvas render]", {
    isPreview,
    editingBlockId,
    editingText,
    scale,
  });

  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const justClosedRef = useRef(false);

  const closeInline = () => {
    if (justClosedRef.current) return;
    justClosedRef.current = true;

    const ta = taRef.current;
    ta?.blur(); // onBlur(commit+stop) 発火

    setTimeout(() => {
      justClosedRef.current = false;
    }, 0);
  };

  useLayoutEffect(() => {
    if (isPreview) return;

    const ta = taRef.current;
    console.log("[autosize] start", {
      editingBlockId,
      hasTa: !!ta,
      valueLen: (ta?.value ?? "").length,
    });
    if (!ta) return;
    if (!editingBlockId) return;

    // 一旦 1px にして測る（0px はやめる）
    ta.style.width = "1px";
    ta.style.height = "1px";

    // 重要：wrap off（Canva系 1行伸び）
    ta.wrap = "off";

    const sw = ta.scrollWidth;
    const sh = ta.scrollHeight;

    console.log("[autosize] measured", {
      sw,
      sh,
      cw: ta.clientWidth,
      ch: ta.clientHeight,
    });

    const padX = 12; // 2px 6px の左右合計
    const padY = 4;

    ta.style.width = `${Math.max(20, sw + padX)}px`;
    ta.style.height = `${Math.max(20, sh + padY)}px`;

    console.log("[autosize] applied", {
      width: ta.style.width,
      height: ta.style.height,
    });
  }, [isPreview, editingBlockId, editingText]);

  useEffect(() => {
    if (isPreview) return;
    if (!editingBlockId) return;

    const onDown = (ev: Event) => {
      const ta = taRef.current;
      if (!ta) return;

      const target = ev.target as Node | null;
      if (target && ta.contains(target)) return;

      closeInline();
    };

    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("touchstart", onDown, true);

    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("touchstart", onDown, true);
    };
  }, [isPreview, editingBlockId]);

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
            ref={cardRef}
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
              onSurfacePointerDown={() => {
                if (editingBlockId) {
                  closeInline();
                  // ✅ クリックで選択解除したいならこれも呼ぶ
                  onSurfacePointerDown?.();
                  return;
                }
                onSurfacePointerDown?.();
              }}
              onBlockPointerDown={(e, id) => {
                // 編集中ならまず閉じる
                if (editingBlockId) {
                  closeInline();
                  // ✅ そのまま「クリックしたブロックを選択」まで通す（Canva挙動）
                  onPointerDown?.(e, id, { scale });
                  return;
                }

                onPointerDown?.(e, id, { scale });
              }}
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

                return (
                  <textarea
                    ref={taRef}
                    key={b.id}
                    autoFocus
                    wrap="off"
                    rows={1}
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
                      if (e.key === "Escape") {
                        e.preventDefault();
                        onStopEditing?.();
                      }
                    }}
                    style={{
                      position: "absolute",
                      left: b.x,
                      top: b.y,
                      fontSize: `${b.fontSize}px`,
                      fontWeight: b.fontWeight,
                      fontFamily: fontFamilyFromKey(b.fontKey),
                      textAlign: b.align ?? "left",
                      padding: "2px 6px",
                      lineHeight: 1.2,

                      whiteSpace: "pre", // 折り返し無し（Canvaっぽい）
                      overflow: "hidden",
                      boxSizing: "border-box",

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
