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
    editableBlocks,
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

  const isPanelOpen = state.activeTab !== null;

  return (
    <div className="flex w-full h-[calc(100dvh-56px)]">
      {/* 左：縦ツール */}
      <aside className="w-14 shrink-0 border-r bg-white/70 backdrop-blur h-full min-h-0">
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
        <aside className="w-[416px] shrink-0 border-r bg-white">
          <ToolPanel
            variant="desktop"
            open={true}
            onClose={() => actions.setActiveTab(null)}
            activeTab={state.activeTab}
            activeBlockId={state.activeBlockId}
            side={state.side}
            isPreview={state.isPreview}
            onChangeSide={actions.setSide}
            blocks={getBlocksFor(state.side)}
            onAddBlock={addBlock}
            onAddBrailleBlock={addBrailleBlock}
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
              />
            </div>

            <div className="flex w-full justify-center">
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
                  onBlockDoubleClick={(id) => {
                    const b = editableBlocks.find((block) => block.id === id);
                    if (!b || b.type !== "text") return;
                    startEditing(id, b.text);
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
