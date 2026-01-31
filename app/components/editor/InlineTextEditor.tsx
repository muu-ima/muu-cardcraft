// app/components/editor/InlineTextEditor.tsx
"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type Props = {
  text: string;
  targetEl: HTMLDivElement | null;

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

  useLayoutEffect(() => {
    if (!targetEl) return;

    const update = () => setRect(targetEl.getBoundingClientRect());
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
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
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
        className="h-full w-full resize-none rounded-md border border-pink-300 bg-white/95 p-0 outline-none"
        style={{
          font: "inherit",
          color: "inherit",
          letterSpacing: "inherit",
          lineHeight: "inherit",
          textAlign: "inherit",
          background: "transparent",
        }}
      />
    </div>
  </>
);
}
