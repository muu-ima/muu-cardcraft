// app/components/editor/EditorCanvas.tsx
"use client";

import React from "react";
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

  // inline editing（表示は CardEditor 側でやる）
  editingBlockId?: string | null;
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
}: Props) {
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
          {/* ✅ scaleする箱（CardSurface と同じ階層） */}
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
              onSurfacePointerDown={() => onSurfacePointerDown?.()}
              onBlockPointerDown={(e, id) => onPointerDown?.(e, id, { scale })}
              onStartInlineEdit={onStartInlineEdit}
              activeBlockId={editingBlockId ? undefined : activeBlockId}
              editingBlockId={editingBlockId} // ✅ 二重文字防止（CardSurface側で text を消す用）
              blockRefs={blockRefs}
              className={isPreview ? "shadow-lg" : ""}
            />
          </div>

          {showGuides && (
            <PrintGuides scale={scale} cardW={CARD_BASE_W} cardH={CARD_BASE_H} />
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
