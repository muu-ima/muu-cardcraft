// hooks/card/useBlockActions.ts
"use client";

import type { FontKey, FontSizeDelta } from "@/shared/fonts";
import type { Block } from "@/shared/blocks";
import { createRandomId } from "@/shared/randomId";


type TextStylePatch = Partial<{
  fontSize: number;
  fontWeight: "normal" | "bold";
  align: "left" | "center" | "right";
  width: number;
}>;

type HistoryApi = {
  set: (next: Block[] | ((prev: Block[]) => Block[])) => void;
  commit: (next: Block[] | ((prev: Block[]) => Block[])) => void;
  blocksRef: React.MutableRefObject<Block[]>;
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export function useBlockActions(history: HistoryApi) {
  const { set, commit, blocksRef } = history;

  // 入力中（軽い）
  const previewText = (id: string, text: string) => {
    set((prev) => prev.map((b) => (b.id === id ? { ...b, text } : b)));
  };


  /**
   * テキスト幅スライダー用
   * - left: 左端固定
   * - center: 中心固定
   * - right: 右端固定
   */
  const setBlockWidth = (id: string, width: number) => {
    // スライダーの範囲に合わせて clamp（必要ならあとで調整）
    const w = clamp(Math.round(width), 40, 480);

    set((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        if (b.type !== "text") return b;

        const prevWidth = b.width ?? w;

        // デフォルトは left 揃え（左端固定）
        let nextX = b.x;

        if (b.align === "center") {
          // 中心を維持
          const center = b.x + prevWidth / 2;
          nextX = center - w / 2;
        } else if (b.align === "right") {
          // 右端を維持
          const right = b.x + prevWidth;
          nextX = right - w;
        }

        return {
          ...b,
          width: w,
          x: nextX,
        };
      })
    );
  };

  // 確定（履歴）
  const commitText = (id: string, text: string) => {
    commit((prev) => {
      const cur = prev.find((b) => b.id === id);
      if (!cur || cur.text === text) return prev;
      return prev.map((b) => (b.id === id ? { ...b, text } : b));
    });
  };

  // フォント変更（履歴）
  const updateFont = (id: string, fontKey: FontKey) => {
    commit((prev) => prev.map((b) => (b.id === id ? { ...b, fontKey } : b)));
  };
  
  // テキストスタイル（軽い：ドラッグやトグル中に追従したいなら set）
  const updateTextStyle = (id: string, patch: TextStylePatch) => {
    set((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };


  // 新規追加（履歴）
  const addBlock = () => {
    commit((prev) => [
      ...prev,
      {
        id: createRandomId(),
        type: "text",
        text: "新しいテキスト",
        x: 100,
        y: 100,
        fontSize: 16,
        fontWeight: "normal",
        fontKey: "sans",
        side: "front",
      },
    ]);
  };

  // フォントサイズ（あなたの仕様：1クリック=1履歴）
  const updateFontSize = (id: string, fontSize: number) => {
    commit(blocksRef.current); // 操作直前の状態を積む

    const next = clamp(Math.round(fontSize), 8, 72);
    set((prev) =>
      prev.map((b) => (b.id === id ? { ...b, fontSize: next } : b))
    );
  };

  const bumpFontSize = (id: string, delta: FontSizeDelta) => {
    const cur = blocksRef.current.find((b) => b.id === id)?.fontSize ?? 16;
    updateFontSize(id, cur + delta);
  };

  return {
    previewText,
    commitText,
    updateFont,
    updateTextStyle,
    addBlock,
    updateFontSize,
    bumpFontSize,
    setBlockWidth,
 };
}
