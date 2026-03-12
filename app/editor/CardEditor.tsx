"use client";

import React, { useRef, useState } from "react";
import ModalPreview from "@/app/components/ModalPreview";
import CardSurface from "@/app/components/CardSurface";
import ExportSurface from "@/app/components/ExportSurface";
import InlineTextEditor from "@/app/components/editor/InlineTextEditor";

import { useScaleToFit } from "@/hooks/useScaleToFit";
import { useCardBlocks } from "@/hooks/useCardBlocks";
import { useCardImages } from "@/hooks/card/useCardImages";
import type { UploadImageAsset } from "@/hooks/card/useUploadImage";
import { useEditorLayout } from "@/hooks/useEditorLayout";
import { useCardEditorState } from "@/hooks/useCardEditorState";
import { type DesignKey } from "@/shared/design";
import type { TabKey } from "@/shared/editor";
import { CARD_FULL_DESIGNS } from "@/shared/cardDesigns";
import { CARD_BASE_W, CARD_BASE_H } from "@/shared/print";
import { CardEditorMobileLayout } from "@/app/editor/CardEditorMobileLayout";
import { CardEditorDesktopLayout } from "@/app/editor/CardEditorDesktopLayout";
import type {
  EditorStateForLayout,
  EditorActionsForLayout,
  SheetSnap,
  Side,
} from "./CardEditor.types";
import type { CardEditorDesktopProps } from "./CardEditorDesktop.types";
import type { CardEditorMobileProps } from "./CardEditorMobile.types";

type Props = {
  code: string;
};

type EditingState = { id: string; initialText: string } | null;

export default function CardEditor({ code }: Props) {
  // =========================
  // 🧠 1. コア状態 & ロジック
  // =========================
  const [editing, setEditing] = useState<EditingState>(null);
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
    snapGuide,
    cardRef,
    blockRefs,
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
    previewTextColor,
  } = useCardBlocks();

  const {
    images,
    addFromUpload,
    getImagesFor,
    moveImage,
    removeImage,
    countImagesFor,
    maxImagesPerSide,
  } = useCardImages();

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

  const { sheetTitle } = useEditorLayout({
    activeTab: state.activeTab,
    isPreview: state.isPreview,
  });

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
      if (editing) {
        const b = currentBlocks.find((x) => x.id === editing.id);
        if (b && b.type === "text") commitText(editing.id, b.text);
        setEditing(null);

        // ✅ 編集中の“外クリック”は編集終了だけで止める（選択は維持）
        return;
      }

      actions.setActiveBlockId("");
      actions.setActiveTab(null);
    }
  };
  // CardEditor 内に追加
  const resetEditingState = (mode: "commit" | "cancel" = "commit") => {
    if (editing) {
      const b = currentBlocks.find((x) => x.id === editing.id);
      if (b && b.type === "text") {
        if (mode === "commit") commitText(editing.id, b.text);
        if (mode === "cancel") previewText(editing.id, editing.initialText);
      }
    }
    setEditing(null);
    actions.setActiveBlockId(""); // もしくは undefined にしたいなら state 型を変える
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
    if (editing) {
      e.preventDefault();
      e.stopPropagation();

      // ① 現在の編集中テキストを確定（previewTextで更新済みの b.text を commit）
      const cur = currentBlocks.find((x) => x.id === editing.id);
      if (cur && cur.type === "text") {
        commitText(editing.id, cur.text);
      }

      // ② クリックしたブロックへ選択移動
      actions.setActiveBlockId(blockId);

      // ③ クリック先が text なら編集を切り替える。違うなら編集終了
      const next = currentBlocks.find((x) => x.id === blockId);
      if (next && next.type === "text") {
        setEditing({ id: blockId, initialText: next.text });
      } else {
        setEditing(null);
      }
      return; // ✅ 編集中はドラッグ開始しない
    }

    // 通常時はこれまで通り
    actions.setActiveBlockId(blockId);
    dragPointerDown(e, blockId, opts);
  };

  const centerVisible = selectors.centerVisible;
  const centerToolbarValue = selectors.centerToolbarValue;

  // =========================
  // 📦 Layout Props
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

  // ③ Desktop レイアウトに渡す全部入り props
  const desktopProps: CardEditorDesktopProps = {
    code,
    state: layoutState,
    actions: layoutActions,
    openTab,
    canvasAreaRef,
    centerWrapRef,
    scaleWrapRefDesktop,
    scaleDesktop,
    getBlocksFor,
    getImagesFor,
    moveImage,
    editableBlocks,
    addBlock,
    onChangeText,
    onCommitText,
    updateFont,
    bumpFontSize,
    design,
    setDesign,
    exportRef,
    downloadImage,
    currentImageCount: countImagesFor(state.side),
    maxImageCount: maxImagesPerSide,
    onDeleteImage: removeImage,
    onUploadedImage,
    onAnyPointerDownCapture,
    centerToolbarValue,
    centerVisible,
    handleBlockPointerDown,
    startEditing,
    editingBlockId,
    editingText,
    setEditingText,
    stopEditing,
    snapGuide,
    cardRef,
    blockRefs,
    undo,
    redo,
    onChangeWidth: handleChangeBlockWidth,
    setTextColor,
    previewTextColor,
  };

  // ④ Mobile レイアウトに渡す全部入り props
  const mobileProps: CardEditorMobileProps = {
    code,
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
    getImagesFor,
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
    previewTextColor,
    onUploadedImage,
    moveImage,

    currentImageCount: countImagesFor(state.side),
    maxImageCount: maxImagesPerSide,
    onDeleteImage: removeImage,

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
    snapGuide,

    // ---- Undo / Redo
    undo,
    redo,
  };

  console.log("[CardEditor] side", state.side);
  console.log("[CardEditor] images", images);
  console.log("[CardEditor] filtered", getImagesFor(state.side));

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
        <CardEditorDesktopLayout {...desktopProps} />
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
                images={getImagesFor(state.side)}
                onMoveImage={moveImage}
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
        images={getImagesFor(state.side)}
        design={design}
      />
      {editing && (
        <InlineTextEditor
          targetEl={blockRefs.current[editing.id]}
          text={
            (currentBlocks.find((b) => b.id === editing.id && b.type === "text")
              ?.text as string) ?? ""
          }
          onChangeText={(next) => previewText(editing.id, next)}
          onCommit={() => {
            const b = currentBlocks.find((x) => x.id === editing.id);
            if (b && b.type === "text") commitText(editing.id, b.text);
            setEditing(null);
          }}
          onCancel={() => {
            previewText(editing.id, editing.initialText);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
