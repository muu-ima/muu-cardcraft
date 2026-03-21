"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type Props = {
  text: string;
  targetEl: HTMLDivElement | null;
  width: number;
  onChangeText: (next: string) => void;
  onCommit: () => void;
  onCancel: () => void;
};

export default function InlineTextEditor({
  text,
  targetEl,
  width,
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

    const n = el.value.length;
    el.setSelectionRange(n, n);
  }, [targetEl]);

  if (!rect) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9998]"
        onPointerDown={(e) => {
          e.preventDefault();
          onCommit();
        }}
      />

      <div
        className="fixed z-[9999]"
        style={{
          left: rect.left,
          top: rect.top,
          width,
          minHeight: rect.height,
        }}
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
          className="w-full resize-none rounded-md border border-pink-300 bg-white/95 p-0 outline-none"
          style={{
            minHeight: rect.height,
            font: "inherit",
            color: "inherit",
            letterSpacing: "inherit",
            lineHeight: "inherit",
            textAlign: "inherit",
            background: "transparent",
            boxSizing: "border-box",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        />
      </div>
    </>
  );
}
