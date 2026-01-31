// app/components/editor/InlineTextEditor.tsx
"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type Props = {
  text: string;
  targetEl: HTMLElement | null;

  onChangeText: (next: string) => void;
  onCommit: () => void;
  onCancel: () => void;
};

export default function InlineTextEditor({
  text,
  targetEl,
  onChangeText,
  onCommit,
  onCancel,
}: Props) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const composingRef = useRef(false);

  function getTightTextRect(targetEl: HTMLElement): DOMRect {
    const range = document.createRange();
    range.selectNodeContents(targetEl);

    const rects = Array.from(range.getClientRects());
    // 文字が空 or rect取れない時は要素rectにフォールバック
    if (rects.length === 0) return targetEl.getBoundingClientRect();

    // 複数行のときは union（全部を包む）
    let left = rects[0].left;
    let top = rects[0].top;
    let right = rects[0].right;
    let bottom = rects[0].bottom;

    for (const r of rects) {
      left = Math.min(left, r.left);
      top = Math.min(top, r.top);
      right = Math.max(right, r.right);
      bottom = Math.max(bottom, r.bottom);
    }

    // DOMRect互換っぽく返す
    return new DOMRect(left, top, right - left, bottom - top);
  }

  useLayoutEffect(() => {
    if (!targetEl) return;

    const update = () => setRect(getTightTextRect(targetEl));
    update();

    const ro = new ResizeObserver(update);
    ro.observe(targetEl);

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [targetEl]);

  useEffect(() => {
    if (!targetEl) return;

    const el = ref.current;
    if (!el) return;

    el.focus();

    // カーソルを末尾に
    const n = el.value.length;
    el.setSelectionRange(n, n);
  }, [targetEl]);

  if (!rect) return null;

  return (
    <>
      {/* ✅ 画面全体オーバーレイ：外クリックで commit */}
      <div
        className="fixed inset-0 z-9998"
        onPointerDown={(e) => {
          // ここに来た＝テキスト外をクリック
          e.preventDefault();
          onCommit(); // cancelにしたいなら onCancel()
        }}
      />

      {/* ✅ テキスト入力本体：オーバーレイより前面 */}
      <div
        className="fixed z-9999"
        style={{
          left: rect.left - 2,
          top: rect.top - 2,
          width: Math.max(rect.width + 4, 24),
          height: Math.max(rect.height + 4, 18),
        }}
        // ✅ ここを押してもオーバーレイに伝播させない
        onPointerDown={(e) => e.stopPropagation()}
      >
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          onCompositionStart={() => (composingRef.current = true)}
          onCompositionEnd={() => (composingRef.current = false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              onCancel();
              return;
            }
            if (e.key === "Enter" && !e.shiftKey) {
              if (composingRef.current) return;
              e.preventDefault();
              onCommit();
            }
          }}
          className="h-full w-full resize-none rounded-sm border border-pink-300/80 bg-transparent px-1 py-0.5 outline-none"
          style={{
            font: "inherit",
            color: "inherit",
            letterSpacing: "inherit",
            lineHeight: "inherit",
            textAlign: "inherit",
          }}
        />
      </div>
    </>
  );
}
