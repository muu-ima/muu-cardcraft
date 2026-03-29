// app/editor/CardEditorDesktopLayout.tsx
"use client";

import Toolbar from "@/app/components/Toolbar";
import CanvasArea from "@/app/components/editor/CanvasArea";
import CenterToolbar from "@/app/components/editor/CenterToolbar";
import EditorCanvas from "@/app/components/editor/EditorCanvas";
import ToolPanel from "@/app/components/ToolPanel";
import CanvasScrollbar from "@/app/components/editor/CanvasScrollbar";
import CanvasFooter from "@/app/components/editor/CanvasFooter";
import type { CardEditorDesktopProps } from "./CardEditorDesktop.types";
import clsx from "clsx"; // 使ってなかったら追加（なくても三項演算子で書ける）
import { useEffect, useState } from "react";
import { CARD_BASE_H, CARD_BASE_W } from "@/shared/print";

export function CardEditorDesktopLayout(props: CardEditorDesktopProps) {
  const {
    code,
    state,
    actions,
    openTab,
    canvasAreaRef,
    centerWrapRef,
    scaleWrapRefDesktop,
    scaleDesktop,
    zoomLabel,
    onZoomIn,
    onResetZoom,
    getBlocksFor,
    getImagesFor,
    moveImage,
    mixedLayers,
    resizeImage,
    setBlockWidth,
    addBlock: onAddBlock,
    onUploadedImage,
    onChangeText,
    onCommitText,
    previewTextColor: onPreviewColor,
    updateFont: onChangeFont,
    bumpFontSize: onBumpFontSize,
    design,
    setDesign: onChangeDesign,
    exportRef,
    downloadImage: onDownload,
    currentImageCount,
    maxImageCount,
    onDeleteImage,
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
    onChangeWidth,
    setTextColor: onChangeColor,
    selectedItem,
    onSelectImage,
    onBringSelectedImageToFront,
    onSendSelectedImageToBack,
    setActiveBlockId,
    onMoveLayerFront,
    onMoveLayerBack,
    onMoveLayerForward,
    onMoveLayerBackward,
    onDeleteLayer,
  } = props;

  const isPanelOpen = state.activeTab !== null;

  const blocksForSide = getBlocksFor(state.side);

  const selectedImageId =
    selectedItem?.kind === "image" ? selectedItem.id : null;
  const handleDeleteBlock = (id: string) => {
    actions.removeBlock(id);
  };

  const [canvasScrollState, setCanvasScrollState] = useState({
    left: 0,
    top: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
  });

  const hasHorizontalScroll =
    canvasScrollState.scrollWidth - canvasScrollState.clientWidth > 1;

  const desktopCanvasLaneWidth = Math.round(CARD_BASE_W * scaleDesktop) + 96;
  const desktopCanvasLaneMinHeight =
    Math.round(CARD_BASE_H * scaleDesktop) + 280;

  const shouldPinCanvasLeft = isPanelOpen || scaleDesktop > 1;

  useEffect(() => {
    const el = canvasAreaRef.current;
    if (!el) return;

    const logSizes = () => {
      console.log("[CanvasArea]", {
        clientWidth: el.clientWidth,
        clientHeight: el.clientHeight,
        scrollWidth: el.scrollWidth,
        scrollHeight: el.scrollHeight,
      });
    };

    logSizes();
    window.addEventListener("resize", logSizes);
    return () => window.removeEventListener("resize", logSizes);
  }, [canvasAreaRef, scaleDesktop, isPanelOpen, state.side]);

  return (
    <div className="flex w-full h-[calc(100dvh-56px)] bg-transparent">
      {" "}
      {/* 左：縦ツール */}
      <aside className="w-[56px] xl:w-[76px] shrink-0 border-r border-black/5 backdrop-blur-md h-full min-h-0">
        {" "}
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
            "xl:w-[416px]",
          )}
        >
          <ToolPanel
            variant="desktop"
            open={isPanelOpen}
            onClose={() => actions.setActiveTab(null)}
            activeTab={state.activeTab}
            textPanel={{
              blocks: blocksForSide,
              activeBlockId: state.activeBlockId,
              onAddBlock,
              isPreview: state.isPreview,
              onChangeText,
              onCommitText,
              onBumpFontSize,
              onChangeWidth,
              onDeleteBlock: handleDeleteBlock,
            }}
            fontPanel={{
              blocks: blocksForSide,
              activeBlockId: state.activeBlockId,
              onChangeFont,
              onChangeColor,
              onPreviewColor,
            }}
            imagePanel={{
              code,
              onUploadedImage,
              images: getImagesFor(state.side),
              currentImageCount,
              maxImageCount,
              onDeleteImage,
            }}
            designPanel={{
              design,
              onChangeDesign,
            }}
            layerPanel={{
              mixedLayers,
              blocks: getBlocksFor(state.side),
              images: getImagesFor(state.side),
              activeBlockId: state.activeBlockId,
              selectedImageId,
              onSelectBlock: setActiveBlockId,
              onSelectImage,
              onMoveLayerFront,
              onMoveLayerBack,
              onMoveLayerForward,
              onMoveLayerBackward,
              onDeleteLayer,
            }}
            exportPanel={{
              onDownload: (format: "png" | "jpeg") => {
                const target = exportRef.current;
                if (!target) return;
                onDownload(format, target);
              },
            }}
          />
        </aside>
      )}
      {/* 右：キャンバス領域 */}
      <main className="relative flex-1 min-w-0 min-h-0 lg:px-8">
        {/* CenterToolbar は常時表示 */}
        <div
          ref={centerWrapRef}
          className="pointer-events-none absolute top-4 left-1/2 z-50 w-full -translate-x-1/2"
        >
          <div className="pointer-events-auto flex justify-center">
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
              selectedItem={selectedItem}
              onBringSelectedImageFront={onBringSelectedImageToFront}
              onSendSelectedImageToBack={onSendSelectedImageToBack}
              onDeleteSelectedImage={() => {
                if (selectedImageId) onDeleteImage(selectedImageId);
              }}
              onToggleGuides={() => actions.setShowGuides((v) => !v)}
              disabled={state.isPreview || state.side !== "front"}
              visible={centerVisible}
              sidePanelOpen={isPanelOpen}
            />
          </div>
        </div>
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex flex-1 min-h-0 flex-col">
            {" "}
            <CanvasArea innerRef={canvasAreaRef}>
              <div className="relative">
                <div className="min-h-full">
                  <div
                    className="min-h-full min-w-full"
                    style={{ minHeight: `${desktopCanvasLaneMinHeight}px` }}
                  >
                    <div className="flex min-h-full min-w-full w-max items-start justify-center pt-[56px] md:pt-[64px] lg:pt-[72px] px-6">
                      <div
                        ref={scaleWrapRefDesktop}
                        className="shrink-0"
                        style={{
                          width: `${desktopCanvasLaneWidth}px`,
                        }}
                      >
                        <EditorCanvas
                          blocks={getBlocksFor(state.side)}
                          images={getImagesFor(state.side)}
                          moveImage={moveImage}
                          resizeImage={resizeImage}
                          onChangeWidth={onChangeWidth}
                          mixedLayers={mixedLayers}
                          design={design}
                          side={state.side}
                          scale={scaleDesktop}
                          isPreview={state.isPreview}
                          showGuides={state.showGuides}
                          onPointerDown={
                            state.side === "front"
                              ? handleBlockPointerDown
                              : undefined
                          }
                          selectedImageId={selectedImageId}
                          onSelectImage={onSelectImage}
                          onStartInlineEdit={(blockId) => {
                            const block = blocksForSide.find(
                              (b) => b.id === blockId,
                            );
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
                          snapGuide={snapGuide}
                          cardRef={cardRef}
                          blockRefs={blockRefs}
                          onScrollStateChange={setCanvasScrollState}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CanvasArea>
          </div>

          <div className="mt-0 px-4">
            <div className="mx-auto w-full max-w-[720px]">
              <CanvasFooter
                zoomLabel={zoomLabel}
                onZoomIn={onZoomIn}
                onResetZoom={onResetZoom}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
