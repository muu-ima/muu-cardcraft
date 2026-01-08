// hooks/card/useBlockActions.ts
"use client";

import type { FontKey, FontSizeDelta } from "@/shared/fonts";
import type { Block } from "@/shared/blocks";
import { createRandomId } from "@/shared/randomId";

type TextStylePatch = Partial<{
  fontSize: number;
  fontWeight: "normal" | "bold";
  align: "left" | "center" | "right";
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
  };
}
