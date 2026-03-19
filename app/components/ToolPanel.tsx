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
  // ✅ open と activeTab を一致させる（事故防止）
  if (!open || !activeTab) return null;

  const showHeader = variant !== "sheet"; // ✅ sheet の時はヘッダー無し

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
        "w-full flex flex-col min-h-0",
        variant === "desktop" ? "h-[calc(100vh-56px)]" : "h-full",
        "xl:fixed xl:left-14 xl:top-14 xl:z-30",
        "xl:w-[360px]",
        "xl:bg-white/70 xl:backdrop-blur",
        "xl:shadow-[1px_0_0_rgba(0,0,0,0.06)]",
      ].join(" ")}
    >
      {showHeader && (
        <div
          className={[
            "hidden xl:block shrink-0",
            "bg-white/70 backdrop-blur",
            "rounded-xl px-3 py-2",
          ].join(" ")}
        >
          <div
            className="px-4 py-3 xl:px-3 xl:py-2
                       bg-white/60 backdrop-blur
                       shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-800">{title}</div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-900/5"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={[
          "flex-1 min-h-0 overflow-y-auto p-4",
          variant === "sheet" ? "h-full" : "",
        ].join(" ")}
      >
        {activeTab === "text" && (
          <TextPanel
            side={textPanel.side}
            onChangeSide={textPanel.onChangeSide}
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
