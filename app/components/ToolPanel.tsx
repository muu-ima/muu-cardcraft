// @/app/components/ToolPanel.tsx
"use client";

import TextPanel from "@/app/components/panels/TextPanel";
import FontPanel from "@/app/components/panels/FontPanel";
import ImagePanel from "@/app/components/panels/ImagePanel";
import DesignPanel from "@/app/components/panels/DesignPanel";
import LayerPanel from "@/app/components/panels/LayerPanel";
import ExportPanel from "@/app/components/panels/ExportPanel";
import type { ToolPanelProps } from "@/shared/toolPanel";

export default function ToolPanel({
  open,
  onClose,
  activeTab,
  variant = "desktop",
  textPanel,
  fontPanel,
  imagePanel,
  layerPanel,
  designPanel,
  exportPanel,
}: ToolPanelProps) {
  if (!open || !activeTab) return null;

  const showHeader = variant !== "sheet";

  const title =
    activeTab === "design"
      ? "デザイン"
      : activeTab === "text"
        ? "テキスト"
        : activeTab === "font"
          ? "フォント"
          : activeTab === "image"
            ? "画像"
            : activeTab === "layers"
              ? "レイヤー"
              : activeTab === "export"
                ? "書き出し"
                : "編集";

  return (
    <aside
      className={[
        "w-full min-h-0 flex flex-col",
        variant === "desktop" ? "h-full" : "h-full",
      ].join(" ")}
    >
      {showHeader && (
        <div className="hidden xl:block shrink-0 px-2 pt-2 pb-1">
          <div className="rounded-xl bg-white/70 backdrop-blur shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-sm font-semibold text-zinc-800">{title}</div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-2.5 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-900/5 hover:text-zinc-900"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={[
          "min-h-0 flex-1 overflow-y-auto",
          variant === "sheet" ? "h-full p-4" : "p-3 xl:p-4",
        ].join(" ")}
      >
        {activeTab === "text" && (
          <TextPanel
            blocks={textPanel.blocks}
            onAddBlock={textPanel.onAddBlock}
            isPreview={textPanel.isPreview}
            onChangeText={textPanel.onChangeText}
            onCommitText={textPanel.onCommitText}
            onBumpFontSize={textPanel.onBumpFontSize}
            onChangeWidth={textPanel.onChangeWidth}
            activeBlockId={textPanel.activeBlockId}
            onDeleteBlock={textPanel.onDeleteBlock}
          />
        )}

        {activeTab === "font" && (
          <FontPanel
            blocks={fontPanel.blocks}
            activeBlockId={fontPanel.activeBlockId}
            onChangeFont={fontPanel.onChangeFont}
            onChangeColor={fontPanel.onChangeColor}
            onPreviewColor={fontPanel.onPreviewColor}
          />
        )}

        {activeTab === "design" && (
          <DesignPanel
            design={designPanel.design}
            onChangeDesign={designPanel.onChangeDesign}
          />
        )}

        {activeTab === "image" && (
          <ImagePanel
            code={imagePanel.code}
            onUploaded={imagePanel.onUploadedImage}
            images={imagePanel.images}
            currentCount={imagePanel.currentImageCount}
            maxCount={imagePanel.maxImageCount}
            onDeleteImage={imagePanel.onDeleteImage}
          />
        )}

        {activeTab === "layers" && (
          <LayerPanel
            mixedLayers={layerPanel.mixedLayers}
            blocks={layerPanel.blocks}
            images={layerPanel.images}
            activeBlockId={layerPanel.activeBlockId}
            selectedImageId={layerPanel.selectedImageId}
            onSelectBlock={layerPanel.onSelectBlock}
            onSelectImage={layerPanel.onSelectImage}
            onMoveLayerFront={layerPanel.onMoveLayerFront}
            onMoveLayerBack={layerPanel.onMoveLayerBack}
            onMoveLayerForward={layerPanel.onMoveLayerForward}
            onMoveLayerBackward={layerPanel.onMoveLayerBackward}
            onDeleteLayer={layerPanel.onDeleteLayer}
          />
        )}

        {activeTab === "export" && (
          <ExportPanel onDownload={exportPanel.onDownload} />
        )}
      </div>
    </aside>
  );
}
