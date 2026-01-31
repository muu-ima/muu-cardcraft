// app/editor/CardEditorDesktopLayout.tsx
"use client";

import Toolbar from "@/app/components/Toolbar";
import CanvasArea from "@/app/components/editor/CanvasArea";
import CenterToolbar from "@/app/components/editor/CenterToolbar";
import EditorCanvas from "@/app/components/editor/EditorCanvas";
import ToolPanel from "@/app/components/ToolPanel";
import type { CardEditorDesktopProps } from "./CardEditor.types";
import clsx from "clsx"; // 使ってなかったら追加（なくても三項演算子で書ける）

export function CardEditorDesktopLayout(props: CardEditorDesktopProps) {
  const {
    state,
    actions,
    openTab,
    canvasAreaRef,
    centerWrapRef,
    scaleWrapRefDesktop,
    scaleDesktop,
    getBlocksFor,
    addBlock,
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
    setTextColor,
  } = props;

  const isPanelOpen = state.activeTab !== null;

  const blocksForSide = getBlocksFor(state.side);

  // 削除ハンドラ
  const handleDeleteBlock = (id: string) => {
    actions.removeBlock(id); // ← 実際に持ってる削除アクション名に合わせて
  };

  return (
    <div className="flex w-full h-[calc(100dvh-56px)]">
      {/* 左：縦ツール */}
      <aside
        className="w-14 shrink-0 
         shadow-[2px_0_20px_-8px_rgba(0,0,0,0.25)]
       bg-white/40 backdrop-blur h-full min-h-0"
      >
        <Toolbar
          activeTab={state.activeTab}
          isPreview={state.isPreview}
          onChange={openTab}
          onUndo={undo}
          onRedo={redo}
          onTogglePreview={actions.togglePreview}
        />
      </aside>

      {/* 左：詳細パネル */}
      {isPanelOpen && (
        <aside
          className={clsx(
            "shrink-0 shadow-[6px_0_20px_-6px_rgba(0,0,0,0.15)] rounded-2xl bg-white h-full min-h-0 transition-[width] duration-200",
            //  768~1023px (タブレット) :ちょい細め
            "md:w-[280px]",
            // 1024~1279px:普通のPC幅
            "lg:w-[320px]",
            // 1280px~:余裕があるときだけ 416px まで広げる
            "xl:w-[416px]"
          )}
        >
          <ToolPanel
            variant="desktop"
            open={isPanelOpen}
            onClose={() => actions.setActiveTab(null)}
            activeTab={state.activeTab}
            activeBlockId={state.activeBlockId}
            side={state.side}
            isPreview={state.isPreview}
            onChangeSide={actions.setSide}
            blocks={getBlocksFor(state.side)}
            onAddBlock={addBlock}
            onChangeText={onChangeText}
            onCommitText={onCommitText}
            onBumpFontSize={bumpFontSize}
            onChangeFont={updateFont}
            design={design}
            onChangeDesign={setDesign}
            fontFamily="default"
            onChangeWidth={onChangeWidth}
            onDownload={(format) => {
              if (!exportRef.current) return;
              downloadImage(format, exportRef.current);
            }}
            onDeleteBlock={handleDeleteBlock}
            onChangeColor={setTextColor}
          />
        </aside>
      )}

      {/* 右：キャンバス領域 */}
      <main className="flex-1 min-w-0 min-h-0">
        <CanvasArea innerRef={canvasAreaRef}>
          <div onPointerDownCapture={onAnyPointerDownCapture}>
            {/* CenterToolbar は常時表示 */}
            <div ref={centerWrapRef} className="relative z-50">
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
                sidePanelOpen={isPanelOpen}
              />
            </div>

            <div className="flex w-full justify-center mt-6 md:mt-20 lg:mt-30">
              {/* ✅ タブ開閉で max-width を変える箱 */}
              <div
                ref={scaleWrapRefDesktop}
                className={clsx(
                  "w-full min-w-0 px-3 transition-[max-width] duration-200",
                  isPanelOpen ? "max-w-[960px]" : "max-w-7xl"
                )}
              >
                <EditorCanvas
                  blocks={getBlocksFor(state.side)}
                  design={design}
                  scale={scaleDesktop}
                  isPreview={state.isPreview}
                  showGuides={state.showGuides}
                  onPointerDown={
                    state.side === "front" ? handleBlockPointerDown : undefined
                  }
                  onStartInlineEdit={(blockId) => {
                    const block = blocksForSide.find((b) => b.id === blockId);
                    if (!block || block.type !== "text") return;
                    // ✅ startEditing が (id, text) を受け取るのでここで変換
                    startEditing(block.id, block.text);
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
      </main>
    </div>
  );
}
