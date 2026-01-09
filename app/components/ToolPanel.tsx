// @/app/components/ToolPanel.tsx
"use client";

import type { Block } from "@/shared/blocks";
import type { TabKey } from "@/shared/editor";
import type { DesignKey } from "@/shared/design";
import type { FontKey } from "@/shared/fonts";

import TextPanel from "@/app/components/panels/TextPanel";
import BraillePanel from "@/app/components/panels/BraillePanel";
import FontPanel from "@/app/components/panels/FontPanel";
import DesignPanel from "@/app/components/panels/DedignPanel";
import ExportPanel from "@/app/components/panels/ExportPanel";
import type { FontSizeDelta } from "@/shared/fonts";

type Side = "front" | "back";

type Props = {
  open: boolean;
  onClose: () => void;
  activeTab: TabKey | null;
  activeBlockId: string;
  onAddBlock: () => void;
  variant?: "desktop" | "sheet";

  side: Side;
  onChangeSide: (side: Side) => void;

  blocks: Block[];
  isPreview: boolean;
  onChangeText: (id: string, value: string) => void;
  onCommitText: (id: string, value: string) => void;
  onBumpFontSize?: (id: string, delta: FontSizeDelta) => void;
  onAddBrailleBlock: () => void;
  onChangeFont: (id: string, fontKey: FontKey) => void;

  design: DesignKey;
  onChangeDesign: (design: DesignKey) => void;

  fontFamily: string;
  onDownload: (
    format: "png" | "jpeg",
    design: DesignKey,
    options?: { quality?: number; pixelRatio?: number; fontFamily?: string }
  ) => void;
  onChangeWidth?: (id: string, width: number) => void;
};

export default function ToolPanel({
  open,
  onClose,
  activeTab,
  activeBlockId,
  side,
  onChangeSide,
  blocks,
  onAddBlock,
  isPreview,
  onChangeText,
  onChangeFont,
  onCommitText,
  onBumpFontSize,
  onAddBrailleBlock,
  design,
  onChangeDesign,
  onDownload,
  variant = "desktop",
  onChangeWidth,
}: Props) {
  // ✅ open と activeTab を一致させる（事故防止）
  if (!open || !activeTab) return null;

  const showHeader = variant !== "sheet"; // ✅ sheet の時はヘッダー無し

  const title =
    activeTab === "design"
      ? "デザイン"
      : activeTab === "text"
      ? "テキスト"
      : activeTab === "braille"
      ? "点字"
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
      <div className="sticky top-0 z-10 -mx-4 mb-3 bg-white/90 px-4 lg:py-3 backdrop-blur xl:mx-0 xl:mb-0 xl:bg-transparent xl:px-3 xl:py-2">
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
        {" "}
        {activeTab === "text" && (
          <TextPanel
            side={side}
            onChangeSide={onChangeSide}
            blocks={blocks}
            onAddBlock={onAddBlock}
            isPreview={isPreview}
            onChangeText={onChangeText}
            onCommitText={onCommitText}
            onBumpFontSize={onBumpFontSize}
            onChangeWidth={onChangeWidth}
            activeBlockId={activeBlockId}
          />
        )}
        {activeTab === "braille" && (
          <BraillePanel
            blocks={blocks}
            onChangeText={onChangeText}
            onCommitText={onCommitText}
            onAddBrailleBlock={onAddBrailleBlock}
          />
        )}
        {activeTab === "font" && (
          <FontPanel
            blocks={blocks}
            activeBlockId={activeBlockId}
            onChangeFont={onChangeFont}
          />
        )}
        {activeTab === "design" && (
          <DesignPanel design={design} onChangeDesign={onChangeDesign} />
        )}
        {activeTab === "export" && (
          <ExportPanel design={design} onDownload={onDownload} />
        )}
      </div>
    </aside>
  );
}
