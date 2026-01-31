"use client";

import React, { useRef, useState } from "react";
import ModalPreview from "@/app/components/ModalPreview";
import CardSurface from "@/app/components/CardSurface";
import ExportSurface from "@/app/components/ExportSurface";
import InlineTextEditor from "@/app/components/editor/InlineTextEditor";

import { useScaleToFit } from "@/hooks/useScaleToFit";
import { useCardBlocks } from "@/hooks/useCardBlocks";
import { useEditorLayout } from "@/hooks/useEditorLayout";
import { useCardEditorState } from "@/hooks/useCardEditorState";
import { type DesignKey } from "@/shared/design";
import type { TabKey } from "@/shared/editor";
import { CARD_FULL_DESIGNS } from "@/shared/cardDesigns";
import { CARD_BASE_W, CARD_BASE_H } from "@/shared/print";
import { CardEditorMobileLayout } from "@/app/editor/CardEditorMobileLayout";
import { CardEditorDesktopLayout } from "@/app/editor/CardEditorDesktopLayout";
import type {
  CardEditorMobileProps,
  EditorStateForLayout,
  EditorActionsForLayout,
} from "./CardEditor.types";

type Side = "front" | "back";

export default function CardEditor() {
  // =========================
  // 🧠 1. コア状態 & ロジック
  // =========================
  // const [editing, setEditing] = useState<EditingState>(null);
  const [design, setDesign] = useState<DesignKey>("mint");
  const exportRef = useRef<HTMLDivElement | null>(null);

  // ✅ CanvasArea 自体の ref（スクロール/レイアウト用）
  const canvasAreaRef = useRef<HTMLDivElement | null>(null);
  // scale（mobile / desktop）
  const { ref: scaleWrapRefMobile, scale: scaleMobile } = useScaleToFit(
    CARD_BASE_W,
    true,
  );

  const { ref: scaleWrapRefDesktop, scale: scaleDesktop } = useScaleToFit(
    CARD_BASE_W,
    true,
  );

  const {
    blocks: editableBlocks,
    addBlock,
    previewText,
    commitText,
    updateFont,
    updateTextStyle,
    bumpFontSize,
    handlePointerDown: dragPointerDown,
    cardRef,
    blockRefs,
    textSpanRefs,
    downloadImage,
    undo,
    redo,
    editingBlockId,
    startEditing,
    stopEditing,
    editingText,
    setEditingText,
    setBlockWidth,
    removeBlock,
    setTextColor,
  } = useCardBlocks();

  const editor = useCardEditorState({
    editableBlocks,
    design,
    setDesign,
    cardRef,
    blockRefs,
    previewText,
    commitText,
    updateTextStyle,
    bumpFontSize,
    dragPointerDown,
  });

  const { state, actions, selectors } = editor;
const editingId = editingBlockId ?? undefined;

const spanEl =
  editingId ? (textSpanRefs.current[editingId] ?? null) : null;

const blockEl =
  editingId ? (blockRefs.current[editingId] ?? null) : null;

  const { sheetTitle } = useEditorLayout({
    activeTab: state.activeTab,
    isPreview: state.isPreview,
  });

  // 追加（CardEditor 内）
  type SheetSnap = "collapsed" | "half" | "full";

  const [sheetSnap, setSheetSnap] = useState<SheetSnap>("collapsed");

  const closeSheet = () => {
    setSheetSnap("collapsed");
    actions.setActiveTab(null);
  };

  // ✅ “タブを開く”はイベントでやる（useEffectで同期しない）
  const openTab = (tab: TabKey) => {
    actions.onChangeTab(tab);
    setSheetSnap((s) => (s === "collapsed" ? "half" : s));
  };

  const getBlocksFor = (s: Side) =>
    s === "front" ? editableBlocks : CARD_FULL_DESIGNS[design].back.blocks;

  // いま編集してる面
  const currentBlocks = getBlocksFor(state.side);

  const centerWrapRef = useRef<HTMLDivElement | null>(null);
  // CardEditor 内
  const onAnyPointerDownCapture = (e: React.PointerEvent) => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const target = e.target as Node;

    // ✅ ツールバー上なら無視（=全解除しない）
    if (centerWrapRef.current?.contains(target)) return;

    // ✅ カード外を押した → 全解除
    if (!cardEl.contains(target)) {
      // ✅ インライン編集中なら：確定して編集終了（選択は維持）
      if (editingBlockId) {
        const b = currentBlocks.find((x) => x.id === editingBlockId);
        if (b && b.type === "text") commitText(editingBlockId, b.text);
        stopEditing();
        return;
      }

      actions.setActiveBlockId("");
      actions.setActiveTab(null);
    }
  };

  // CardEditor 内に追加
  const resetEditingState = (mode: "commit" | "cancel" = "commit") => {
    if (editingBlockId) {
      const b = currentBlocks.find((x) => x.id === editingBlockId);
      if (b && b.type === "text") {
        if (mode === "commit") commitText(editingBlockId, b.text);
        // cancel は “初期テキスト” をどこに持つか決めてから
      }
      stopEditing();
    }
    actions.setActiveBlockId("");
    actions.setActiveTab(null);
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
    if (editingBlockId) {
      e.preventDefault();
      e.stopPropagation();

      const cur = currentBlocks.find((x) => x.id === editingBlockId);
      if (cur && cur.type === "text") commitText(editingBlockId, cur.text);

      actions.setActiveBlockId(blockId);

      const next = currentBlocks.find((x) => x.id === blockId);
      if (next && next.type === "text") startEditing(blockId, next.text);
      else stopEditing();

      return;
    }

    // 通常時はこれまで通り
    actions.setActiveBlockId(blockId);
    dragPointerDown(e, blockId, opts);
  };

  const centerVisible = selectors.centerVisible;
  const centerToolbarValue = selectors.centerToolbarValue;

  // =========================
  // 📦  レイアウト用に詰め替え
  // =========================

  // ① レイアウト用 state
  const layoutState: EditorStateForLayout = {
    activeTab: state.activeTab,
    isPreview: state.isPreview,
    side: state.side,
    showGuides: state.showGuides,
    activeBlockId: state.activeBlockId,
  };

  // ② レイアウト用 actions
  const layoutActions: EditorActionsForLayout = {
    setActiveTab: actions.setActiveTab,
    setIsPreview: actions.setIsPreview,
    setSide: actions.setSide,
    togglePreview: actions.togglePreview,
    onChangeFontSize: actions.onChangeFontSize,
    onToggleBold: actions.onToggleBold,
    onChangeAlign: actions.onChangeAlign,
    setShowGuides: actions.setShowGuides,
    removeBlock,
  };

  // ③ Mobile レイアウトに渡す全部入り props
  const mobileProps: CardEditorMobileProps = {
    // ---- 状態 & アクション
    state: layoutState,
    actions: layoutActions,

    // ---- シート
    sheetTitle,
    sheetSnap,
    setSheetSnap,
    closeSheet,
    openTab,

    // ---- レイアウト / スケール
    canvasAreaRef,
    centerWrapRef,
    scaleWrapRefMobile,
    scaleMobile,

    // ---- blocks / デザイン
    getBlocksFor,
    editableBlocks,
    addBlock,
    onChangeText,
    onCommitText,
    updateFont,
    bumpFontSize,
    design,
    setDesign,
    onChangeWidth: handleChangeBlockWidth,
    setTextColor,

    // ---- export
    exportRef,
    downloadImage,

    // ---- ハンドラ / ツールバー
    onAnyPointerDownCapture,
    centerToolbarValue,
    centerVisible,
    handleBlockPointerDown,

    // ---- インライン編集
    startEditing,
    editingBlockId,
    editingText,
    setEditingText,
    stopEditing,
    cardRef,
    blockRefs,

    // ---- Undo / Redo
    undo,
    redo,
  };

  // return の直前
  console.log("CardEditor render", {
    editingBlockId,
    hasSpan: !!(editingBlockId && textSpanRefs.current[editingBlockId]),
    hasBlock: !!(editingBlockId && blockRefs.current[editingBlockId]),
  });

  // =========================
  // 🎨 2. レイアウト描画
  // =========================
  return (
    <div
      className="relative h-dvh w-full"
      style={{
        background:
          "linear-gradient(135deg, #eef3f8 0%, #f7eef2 55%, #eef4ff 100%)",
      }}
    >
      {/* ---------- Mobile (<768px) ---------- */}
      <div className="md:hidden">
        <CardEditorMobileLayout {...mobileProps} />
      </div>

      {/* ---------- Desktop / Tablet (>=768px) ---------- */}
      <div className="hidden md:block">
        <CardEditorDesktopLayout
          state={state}
          actions={layoutActions}
          openTab={openTab}
          canvasAreaRef={canvasAreaRef}
          centerWrapRef={centerWrapRef}
          scaleWrapRefDesktop={scaleWrapRefDesktop}
          scaleDesktop={scaleDesktop}
          getBlocksFor={getBlocksFor}
          editableBlocks={editableBlocks}
          addBlock={addBlock}
          onChangeText={onChangeText}
          onCommitText={onCommitText}
          updateFont={updateFont}
          bumpFontSize={bumpFontSize}
          onChangeWidth={handleChangeBlockWidth}
          design={design}
          setDesign={setDesign}
          exportRef={exportRef}
          downloadImage={downloadImage}
          onAnyPointerDownCapture={onAnyPointerDownCapture}
          centerToolbarValue={centerToolbarValue}
          centerVisible={centerVisible}
          handleBlockPointerDown={handleBlockPointerDown}
          startEditing={startEditing}
          editingBlockId={editingBlockId}
          editingText={editingText}
          setEditingText={setEditingText}
          stopEditing={stopEditing}
          cardRef={cardRef}
          blockRefs={blockRefs}
          undo={undo}
          redo={redo}
          setTextColor={setTextColor}
        />
      </div>
      {/* ---------- Preview / Export / Inline Editor ---------- */}
      {/* ここは「出力モデル」担当 */}
      {/* ModalPreview / ExportSurface / InlineTextEditor はそのまま */}
      <ModalPreview
        open={state.isPreview}
        onClose={() => actions.setIsPreview(false)}
        title="プレビュー"
      >
        {({ scale }) => (
          <div
            style={{ width: CARD_BASE_W * scale, height: CARD_BASE_H * scale }}
          >
            <div
              style={{
                width: CARD_BASE_W,
                height: CARD_BASE_H,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <CardSurface
                blocks={getBlocksFor(state.side)}
                design={design}
                w={CARD_BASE_W}
                h={CARD_BASE_H}
                interactive={false}
                activeBlockId={undefined}
                onSurfacePointerDown={() => {
                  resetEditingState("commit");
                }}
                className="shadow-lg"
              />
            </div>
          </div>
        )}
      </ModalPreview>
      <ExportSurface
        ref={exportRef}
        blocks={getBlocksFor(state.side)}
        design={design}
      />

      {!state.isPreview && editingBlockId && (
        <InlineTextEditor
            scale={scaleDesktop} 
          targetEl={spanEl ?? blockEl}
          rectEl={blockEl ?? null}
          text={
            (currentBlocks.find(
              (b) => b.id === editingBlockId && b.type === "text",
            )?.text as string) ?? ""
          }
          onChangeText={(next) => previewText(editingBlockId, next)}
          onCommit={() => {
            const b = currentBlocks.find((x) => x.id === editingBlockId);
            if (b && b.type === "text") commitText(editingBlockId, b.text);
            stopEditing();
          }}
          onCancel={() => {
            // 初期値に戻すのを入れたいなら、useInlineEditingに initialText を持たせる
            stopEditing();
          }}
        />
      )}
    </div>
  );
}
