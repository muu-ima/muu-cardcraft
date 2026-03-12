"use client";

import type React from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";

import type { UploadImageAsset } from "@/hooks/card/useUploadImage";
import type { TabKey } from "@/shared/editor";
import type { SheetSnap, Side } from "../CardEditor.types";
import type { EditorBlock, TextBlock } from "@/shared/editorBlocks";

type EditingState = { id: string; initialText: string } | null;

function isTextBlock(block: EditorBlock | undefined): block is TextBlock {
  return !!block && block.type === "text";
}

type UseCardEditorHandlersParams = {
  state: {
    side: Side;
  };
  actions: {
    onChangeTab: (tab: TabKey) => void;
    setActiveTab: (tab: TabKey | null) => void;
    setActiveBlockId: (id: string) => void;
  };
  editing: EditingState;
  setEditing: Dispatch<SetStateAction<EditingState>>;
  currentBlocks: EditorBlock[];
  commitText: (id: string, value: string) => void;
  previewText: (id: string, value: string) => void;
  setBlockWidth: (id: string, width: number) => void;
  dragPointerDown: (
    e: React.PointerEvent<Element>,
    blockId: string,
    opts: { scale: number },
  ) => void;
  addFromUpload: (args: { assetId: string; url: string; side: Side }) => {
    ok: boolean;
    image?: unknown;
  };
  setSheetSnap: Dispatch<SetStateAction<SheetSnap>>;
  cardRef: RefObject<HTMLDivElement | null>;
  centerWrapRef: RefObject<HTMLDivElement | null>;
};

export function useCardEditorHandlers({
  state,
  actions,
  editing,
  setEditing,
  currentBlocks,
  commitText,
  previewText,
  setBlockWidth,
  dragPointerDown,
  addFromUpload,
  setSheetSnap,
  cardRef,
  centerWrapRef,
}: UseCardEditorHandlersParams) {
  // ✅ ImagePanel から来た upload 結果を、画像ステートに反映する
  const onUploadedImage = (asset: UploadImageAsset) => {
    console.log("[onUploadedImage] asset", asset);
    console.log("[onUploadedImage] side before add", state.side);

    const result = addFromUpload({
      assetId: asset.id,
      url: asset.signedUrl,
      side: state.side,
    });

    if (!result.ok) {
      console.warn("この面には画像を最大3枚まで追加できます");
      return;
    }

    console.log("[onUploadedImage] added", result.image);
  };

  // ✅ “タブを開く”はイベントでやる（useEffectで同期しない）
  const openTab = (tab: TabKey) => {
    actions.onChangeTab(tab);
    setSheetSnap((s) => (s === "collapsed" ? "half" : s));
  };

  const closeSheet = () => {
    setSheetSnap("collapsed");
    actions.setActiveTab(null);
  };

  const resetEditingState = (mode: "commit" | "cancel" = "commit") => {
    if (editing) {
      const b = currentBlocks.find((x) => x.id === editing.id);
      if (isTextBlock(b)) {
        if (mode === "commit") commitText(editing.id, b.text);
        if (mode === "cancel") previewText(editing.id, editing.initialText);
      }
    }

    setEditing(null);
    actions.setActiveBlockId("");
    actions.setActiveTab(null);
  };

  const onAnyPointerDownCapture = (e: React.PointerEvent) => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const target = e.target as Node;

    // ✅ ツールバー上なら無視（=全解除しない）
    if (centerWrapRef.current?.contains(target)) return;

    // ✅ カード外を押した → 全解除
    if (!cardEl.contains(target)) {
      if (editing) {
        const b = currentBlocks.find((x) => x.id === editing.id);
        if (isTextBlock(b)) {
          commitText(editing.id, b.text);
        }
        setEditing(null);

        // ✅ 編集中の“外クリック”は編集終了だけで止める（選択は維持）
        return;
      }

      actions.setActiveBlockId("");
      actions.setActiveTab(null);
    }
  };

  const onChangeText = (id: string, value: string) => {
    if (state.side !== "front") return;
    previewText(id, value);
  };

  const onCommitText = (id: string, value: string) => {
    if (state.side !== "front") return;
    commitText(id, value);
  };

  const handleChangeBlockWidth = (id: string, width: number) => {
    setBlockWidth(id, width);
  };

  const handleBlockPointerDown = (
    e: React.PointerEvent<Element>,
    blockId: string,
    opts: { scale: number },
  ) => {
    // ✅ 編集中でも「切り替え」は許可する
    if (editing) {
      e.preventDefault();
      e.stopPropagation();

      // ① 現在の編集中テキストを確定
      const cur = currentBlocks.find((x) => x.id === editing.id);
      if (isTextBlock(cur)) {
        commitText(editing.id, cur.text);
      }

      // ② クリックしたブロックへ選択移動
      actions.setActiveBlockId(blockId);

      // ③ クリック先が text なら編集を切り替える。違うなら編集終了
      const next = currentBlocks.find((x) => x.id === blockId);
      if (isTextBlock(next)) {
        setEditing({ id: blockId, initialText: next.text });
      } else {
        setEditing(null);
      }

      return;
    }

    // 通常時はこれまで通り
    actions.setActiveBlockId(blockId);
    dragPointerDown(e, blockId, opts);
  };

  return {
    onUploadedImage,
    openTab,
    closeSheet,
    resetEditingState,
    onAnyPointerDownCapture,
    onChangeText,
    onCommitText,
    handleChangeBlockWidth,
    handleBlockPointerDown,
  };
}
