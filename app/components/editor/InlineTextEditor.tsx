// app/components/editor/InlineTextEditor.tsx
"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type Props = {
  text: string;

  // 文字スタイル取得用（span が理想）
  targetEl: HTMLElement | null;

  // 位置・サイズ取得用（ブロックdiv が理想）
  rectEl?: HTMLElement | null;

  // ✅ 表示側の transform: scale に合わせる
  scale: number;

  onChangeText: (next: string) => void;
  onCommit: () => void;
  onCancel: () => void;
};

type TextStyle = {
  fontFamily: string;
  fontSize: string; // "24px"
  fontWeight: string;
  fontStyle: string;
  fontVariant: string;
  lineHeight: string; // "36px" or "normal"
  letterSpacing: string;
  textAlign: React.CSSProperties["textAlign"];
  color: string;
  textTransform: string;
  textDecoration: string;
  textIndent: string;
  whiteSpace: React.CSSProperties["whiteSpace"];
};

function readComputedTextStyle(el: HTMLElement): TextStyle {
  const cs = window.getComputedStyle(el);
  return {
    fontFamily: cs.fontFamily,
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    fontStyle: cs.fontStyle,
    fontVariant: cs.fontVariant,
    lineHeight: cs.lineHeight,
    letterSpacing: cs.letterSpacing,
    textAlign: (cs.textAlign as React.CSSProperties["textAlign"]) ?? "left",
    color: cs.color,
    textTransform: cs.textTransform,
    textDecoration: cs.textDecorationLine,
    textIndent: cs.textIndent,
    whiteSpace: (cs.whiteSpace as React.CSSProperties["whiteSpace"]) ?? "pre-wrap",
  };
}

function scalePx(value: string, scale: number): string {
  // "24px" -> 24*scale + "px"
  const m = value.match(/^(-?\d+(?:\.\d+)?)px$/);
  if (!m) return value; // "normal" などはそのまま
  const n = Number(m[1]);
  if (Number.isNaN(n)) return value;
  return `${n * scale}px`;
}

export default function InlineTextEditor({
  text,
  targetEl,
  rectEl,
  scale,
  onChangeText,
  onCommit,
  onCancel,
}: Props) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [textStyle, setTextStyle] = useState<TextStyle | null>(null);

  const ref = useRef<HTMLTextAreaElement | null>(null);
  const composingRef = useRef(false);

  // rect / computed style を更新
  useLayoutEffect(() => {
    if (!targetEl) return;

    const update = () => {
      const base = rectEl ?? targetEl;
      setRect(base.getBoundingClientRect());
      setTextStyle(readComputedTextStyle(targetEl));
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(rectEl ?? targetEl);

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [targetEl, rectEl]);

  // フォーカス & カーソル末尾
  useEffect(() => {
    if (!targetEl) return;
    const el = ref.current;
    if (!el) return;

    el.focus();
    const n = el.value.length;
    el.setSelectionRange(n, n);
  }, [targetEl]);

  // textarea 高さを内容に追従（スクロールバー殺す）
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(18, el.scrollHeight)}px`;
  }, [text, rect]);

  const scaled = useMemo(() => {
    if (!textStyle) return null;
    return {
      ...textStyle,
      fontSize: scalePx(textStyle.fontSize, scale),
      lineHeight: scalePx(textStyle.lineHeight, scale),
      letterSpacing: scalePx(textStyle.letterSpacing, scale),
      textIndent: scalePx(textStyle.textIndent, scale),
    };
  }, [textStyle, scale]);

  if (!rect || !scaled) return null;

  const PAD_X = 6;
  const PAD_Y = 4;

  return (
    <>
      {/* 外クリックで確定 */}
      <div
        className="fixed inset-0 z-9998"
        onPointerDown={(e) => {
          e.preventDefault();
          onCommit();
        }}
      />

      {/* 入力本体 */}
      <div
        className="fixed z-9999"
        style={{
          left: rect.left - 2,
          top: rect.top - 2,
          width: Math.max(rect.width + 4, 24),
          minHeight: Math.max(rect.height + 4, 18),
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

            // ✅ Enter は改行（デフォルト）
            // ✅ Ctrl/Cmd + Enter で確定
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              if (composingRef.current) return;
              e.preventDefault();
              onCommit();
              return;
            }
          }}
          className="w-full resize-none rounded-sm border border-pink-300/80 bg-transparent outline-none"
          style={{
            fontFamily: scaled.fontFamily,
            fontSize: scaled.fontSize,
            fontWeight: scaled.fontWeight,
            fontStyle: scaled.fontStyle,
            fontVariant: scaled.fontVariant,
            lineHeight: scaled.lineHeight,
            letterSpacing: scaled.letterSpacing,
            textAlign: scaled.textAlign,
            color: scaled.color,
            textTransform: scaled.textTransform,
            textDecoration: scaled.textDecoration,
            textIndent: scaled.textIndent,

            // ✅ 表示側に合わせる（ここ固定しないのがポイント）
            whiteSpace: scaled.whiteSpace,

            // textarea のスクロールバーを出さない
            overflow: "hidden",

            // 単語の溢れ対策（必要に応じて）
            wordBreak: "break-word",
            overflowWrap: "anywhere",

            boxSizing: "border-box",
            padding: `${PAD_Y}px ${PAD_X}px`,
            background: "transparent",
          }}
        />

        <div className="mt-1 select-none text-[10px] text-zinc-500">
          Enter: 改行 / Ctrl(or ⌘)+Enter: 確定 / Esc: キャンセル
        </div>
      </div>
    </>
  );
}
