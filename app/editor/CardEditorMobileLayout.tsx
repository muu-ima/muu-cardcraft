// app/editor/CardEditorMobileLayout.tsx
"use client";

import MobileHeader from "@/app/components/editor/MobileHeader";
import BottomSheet from "@/app/components/editor/BottomSheet";
import MobileBottomBar from "@/app/components/editor/MobileBottomBar";
import CanvasArea from "@/app/components/editor/CanvasArea";
import CenterToolbar from "@/app/components/editor/CenterToolbar";
import EditorCanvas from "@/app/components/editor/EditorCanvas";
import ToolPanel from "@/app/components/ToolPanel";
import { MobileTextEditorPanel } from "@/app/components/panels/MobileTextEditorPanel";
import type { CardEditorMobileProps } from "./CardEditor.types";

export function CardEditorMobileLayout(props: CardEditorMobileProps) {
  const {
    state,
    actions,
    sheetTitle,
    sheetSnap,
    setSheetSnap,
    closeSheet,
    openTab,
    canvasAreaRef,
    centerWrapRef,
    scaleWrapRefMobile,
    scaleMobile,
    getBlocksFor,
    addBlock,
    addBrailleBlock,
    onChangeText,
    onCommitText,
    updateFont,
    bumpFontSize,
    design,
    setDesign,
    exportRef,
    downloadImage,
    onAnyPointerDownCapture,
    centerToolbarValue,
    centerVisible,
    handleBlockPointerDown,
    startEditing,
    editingBlockId,
    editingText,
    setEditingText,
    stopEditing,
    cardRef,
    blockRefs,
    undo,
    redo,
    onChangeWidth,
  } = props;

  const blocksForSide = getBlocksFor(state.side);

  return (
    <div className="xl:hidden">
      {/* Mobile Header */}
      <MobileHeader
        isPreview={state.isPreview}
        onTogglePreview={actions.togglePreview}
        onUndo={undo}
        onRedo={redo}
        onHome={() => {
          actions.setActiveTab(null);
          actions.setIsPreview(false);
          actions.setSide("front");
        }}
        onChangeAlign={actions.onChangeAlign}
      />

      {/* BottomSheet */}
      <BottomSheet
        snap={sheetSnap}
        onChangeSnap={setSheetSnap}
        onClose={closeSheet}
        title={sheetTitle}
      >
        <ToolPanel
          variant="sheet"
          open={sheetSnap !== "collapsed"}
          onClose={closeSheet}
          activeTab={state.activeTab}
          activeBlockId={state.activeBlockId}
          side={state.side}
          onChangeSide={actions.setSide}
          blocks={blocksForSide}
          onAddBlock={addBlock}
          onAddBrailleBlock={addBrailleBlock}
          isPreview={state.isPreview}
          onChangeText={onChangeText}
          onCommitText={onCommitText}
          onChangeFont={updateFont}
          onBumpFontSize={bumpFontSize}
          onChangeWidth={onChangeWidth}
          design={design}
          onChangeDesign={setDesign}
          fontFamily="default"
          onDownload={(format) => {
            if (!exportRef.current) return;
            downloadImage(format, exportRef.current);
          }}
        />
      </BottomSheet>

      {/* Canvas (mobile/tablet) */}
      <div className="pt-14">
        <CanvasArea innerRef={canvasAreaRef}>
          <div onPointerDownCapture={onAnyPointerDownCapture}>
            {/* CenterToolbar: md以上で表示（モバイルは別UI運用） */}
            <div ref={centerWrapRef} className="hidden md:block relative z-50">
              <CenterToolbar
                value={centerToolbarValue}
                activeTab={state.activeTab}
                onOpenTab={openTab}
                onChangeFontSize={actions.onChangeFontSize}
                onToggleBold={actions.onToggleBold}
                onChangeAlign={actions.onChangeAlign}
                side={state.side}
                onChangeSide={actions.setSide}
                showGuides={state.showGuides}
                onToggleGuides={() => actions.setShowGuides((v) => !v)}
                disabled={state.isPreview || state.side !== "front"}
                visible={centerVisible}
              />
            </div>

            <div className="flex w-full justify-center">
              <div ref={scaleWrapRefMobile} className="w-full min-w-0 px-3">
                <EditorCanvas
                  blocks={getBlocksFor(state.side)}
                  design={design}
                  scale={scaleMobile}
                  isPreview={state.isPreview}
                  showGuides={state.showGuides}
                  onPointerDown={
                    state.side === "front" ? handleBlockPointerDown : undefined
                  }
                  onStartInlineEdit={(blockId) => {
                    const b = blocksForSide.find(
                      (block) => block.id === blockId
                    );
                    if (!b || b.type !== "text") return;
                    // ✅ (id, text) を取る startEditing に変換
                    startEditing(blockId, b.text);
                  }}
                  editingBlockId={editingBlockId}
                  editingText={editingText}
                  onChangeEditingText={setEditingText}
                  onStopEditing={stopEditing}
                  onCommitText={onCommitText}
                  activeBlockId={state.activeBlockId}
                  cardRef={cardRef}
                  blockRefs={blockRefs}
                />
              </div>
            </div>
          </div>
        </CanvasArea>
      </div>

      {/* ✅ モバイル用テキスト編集パネル（編集時だけ表示） */}
      {editingBlockId && (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <MobileTextEditorPanel
            key={editingBlockId} // ← ここが「解決策1」のポイント！
            blockId={editingBlockId}
            initialValue={editingText ?? ""} // いまの編集中テキスト
            title="テキスト編集"
            description="Enterで改行、✓完了で反映されます。"
            placeholder="テキストを入力"
            preview={undefined} // あとで点字プレビューにしてもOK
            onCommit={(id, value) => {
              onCommitText(id, value); // 既存のテキスト確定ロジックを呼ぶ
              stopEditing(); // 編集モード終了（パネルを閉じる）
            }}
          />
        </div>
      )}

      {/* Mobile bottom bar */}
      {!state.isPreview && (
        <MobileBottomBar activeTab={state.activeTab} onChangeTab={openTab} />
      )}
    </div>
  );
}
