// hooks/card/useBlockDrag.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { CARD_BASE_W, CARD_BASE_H } from "@/shared/print";
import type { Block } from "@/shared/blocks";
import { SnapGuide, snapXY } from "@/hooks/card/useSnap";

type DragOptions = {
  disabled?: boolean;
  scale?: number;
};

type Args = {
  blocks: Block[];
  blocksRef: React.MutableRefObject<Block[]>;
  setRef: React.MutableRefObject<
    (next: Block[] | ((prev: Block[]) => Block[])) => void
  >;
  commitRef: React.MutableRefObject<
    (next: Block[] | ((prev: Block[]) => Block[])) => void
  >;

  // DOM
  cardRef: React.MutableRefObject<HTMLDivElement | null>;
  blockRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;

  // 編集中はドラッグさせない
  editingBlockId: string | null;
};

export function useBlockDrag(args: Args) {
  const {
    blocks,
    blocksRef,
    setRef,
    commitRef,
    cardRef,
    blockRefs,
    editingBlockId,
  } = args;

  const movedRef = useRef(false);
  const beforeDragRef = useRef<Block[] | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragTargetId, setDragTargetId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const dragScaleRef = useRef(1);
  const snapLockRef = useRef<{ x?: number; y?: number }>({});
  const [snapGuide, setSnapGuide] = useState<SnapGuide | null>(null);

  const handlePointerDown = (
    e: React.PointerEvent,
    id: string,
    options?: DragOptions,
  ) => {
    if (options?.disabled) return;
    if (editingBlockId) return;

    movedRef.current = false;
    beforeDragRef.current = blocks.map((b) => ({ ...b }));

    const scale = options?.scale ?? 1;
    dragScaleRef.current = scale;

    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();

    setDragTargetId(id);
    setIsDragging(true);

    const el = cardRef.current;
    if (!el) return;

    const cardRect = el.getBoundingClientRect();
    const block = blocks.find((b) => b.id === id);
    if (!block) return;

    const pointerX = (e.clientX - cardRect.left) / scale;
    const pointerY = (e.clientY - cardRect.top) / scale;

    setOffset({
      x: pointerX - block.x,
      y: pointerY - block.y,
    });
  };

  useEffect(() => {
    const BASE_W = CARD_BASE_W;
    const BASE_H = CARD_BASE_H;

    const handleMove = (e: PointerEvent) => {
      if (!isDragging || !dragTargetId || !cardRef.current) return;

      if (!movedRef.current) {
        if (beforeDragRef.current) commitRef.current(beforeDragRef.current);
        movedRef.current = true;
      }

      const scale = dragScaleRef.current;
      const cardRect = cardRef.current.getBoundingClientRect();
      const targetEl = blockRefs.current[dragTargetId];
      if (!targetEl) return;

      const textWidth = targetEl.getBoundingClientRect().width / scale;

      const pointerX = (e.clientX - cardRect.left) / scale;
      const pointerY = (e.clientY - cardRect.top) / scale;

      const rawX = pointerX - offset.x;
      const rawY = pointerY - offset.y;

      const maxX = BASE_W - textWidth;

      const targetBlock = blocksRef.current.find((b) => b.id === dragTargetId);
      const approxTextHeight = targetBlock?.fontSize ?? 20;
      const maxY = BASE_H - approxTextHeight;

      const newX = Math.max(0, Math.min(maxX, rawX));
      const newY = Math.max(0, Math.min(maxY, rawY));

      // 例：閾値
      const SNAP_IN = 10; // 近づいたら吸着
      const SNAP_OUT = 3; // これ以上離れたら解除

      let sx = newX;
      let sy = newY;

      // ★ まず「候補ライン」を作る（例：中央だけでもOK）
      const centerX = BASE_W / 2 - textWidth / 2;
      const centerY = BASE_H / 2 - approxTextHeight / 2;

      // ===== X方向 =====
      if (snapLockRef.current.x != null) {
        // いま吸着中 → 少し離れても維持
        if (Math.abs(sx - snapLockRef.current.x) > SNAP_OUT) {
          snapLockRef.current.x = undefined; // 解除
        } else {
          sx = snapLockRef.current.x; // 維持
        }
      }
      if (snapLockRef.current.x == null) {
        // 未吸着 → 近づいたら吸着開始
        if (Math.abs(sx - centerX) <= SNAP_IN) {
          snapLockRef.current.x = centerX;
          sx = centerX;
        }
      }

      // ===== Y方向 =====
      if (snapLockRef.current.y != null) {
        if (Math.abs(sy - snapLockRef.current.y) > SNAP_OUT) {
          snapLockRef.current.y = undefined;
        } else {
          sy = snapLockRef.current.y;
        }
      }
      if (snapLockRef.current.y == null) {
        if (Math.abs(sy - centerY) <= SNAP_IN) {
          snapLockRef.current.y = centerY;
          sy = centerY;
        }
      }

      // ★ここでスナップ！
      const snapped = snapXY({
        id: dragTargetId,
        x: sx,
        y: sy,
        w: textWidth,
        h: approxTextHeight,
        blocks: blocksRef.current,
        baseW: BASE_W,
        baseH: BASE_H,
      });

      if (snapped.guide) {
        setSnapGuide(snapped.guide);
        setTimeout(() => setSnapGuide(null), 150);
      }

      setRef.current((prev) =>
        prev.map((b) =>
          b.id === dragTargetId ? { ...b, x: snapped.x, y: snapped.y } : b,
        ),
      );
    };

    const handleUp = (e: PointerEvent) => {
      try {
        (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
      } catch {}

      setIsDragging(false);
      setDragTargetId(null);

      movedRef.current = false;
      beforeDragRef.current = null;
      snapLockRef.current = {};
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [
    isDragging,
    dragTargetId,
    offset,
    blocksRef,
    setRef,
    commitRef,
    cardRef,
    blockRefs,
  ]);

  return { handlePointerDown, snapGuide };
}
