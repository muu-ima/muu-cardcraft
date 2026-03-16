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
    // ✅ xl以上だけ「左固定パネル」、xl未満は「普通のコンテンツ」
    <aside
      className={[
        "w-full",
        "xl:fixed xl:left-14 xl:top-14 xl:z-30",
        "xl:h-[calc(100vh-56px)] xl:w-[360px]",
        "xl:bg-white/70 xl:backdrop-blur",
        "xl:shadow-[1px_0_0_rgba(0,0,0,0.06)]",
      ].join(" ")}
    >
      {/* ✅ 見出し：BottomSheetでも上に残る */}
      <div
        className={[
          "hidden xl:block", // ← これだけで解決
          "sticky top-0 z-10 mb-3",
          "bg-white/70 backdrop-blur",
          "rounded-xl px-3 py-2",
        ].join(" ")}
      >
        {/* ✅ showHeader のときだけ描画する */}
        {showHeader && (
          <div
            className="sticky top-0 z-10 px-4 py-3 xl:px-3 xl:py-2
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
        )}
      </div>

      {/* ✅ 本文：Desktopはパネル内スクロール、MobileはBottomSheet側でスクロール */}
      <div
        className={[
          "overflow-y-auto p-4",
          variant === "desktop" ? "h-[calc(100%-41px)]" : "h-full",
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
            selectedImageId={imagePanel.selectedImageId}
            onBringSelectedImageToFront={imagePanel.onBringSelectedImageToFront}
            onSendSelectedImageToBack={imagePanel.onSendSelectedImageToBack}
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
          />
        )}
        {activeTab === "export" && (
          <ExportPanel onDownload={exportPanel.onDownload} />
        )}
      </div>
    </aside>
  );
}
