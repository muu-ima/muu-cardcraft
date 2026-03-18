// app/components/LayerPanel.tsx
"use client";

import { useMemo } from "react";
import type { Block } from "@/shared/blocks";
import type { CardImage } from "@/shared/images";
import type { MixedLayerItem } from "@/shared/layers";
import {
  Layers3,
  Type,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Trash2,
} from "lucide-react";

type Props = {
  mixedLayers: MixedLayerItem[];
  blocks: Block[];
  images: CardImage[];

  activeBlockId?: string;
  selectedImageId?: string | null;

  onSelectBlock?: (id: string) => void;
  onSelectImage?: (id: string | null) => void;

  onMoveLayerFront?: (layer: MixedLayerItem) => void;
  onMoveLayerBack?: (layer: MixedLayerItem) => void;
  onMoveLayerForward?: (layer: MixedLayerItem) => void;
  onMoveLayerBackward?: (layer: MixedLayerItem) => void;
  onDeleteLayer?: (layer: MixedLayerItem) => void;
};

function getBlockLabel(block?: Block) {
  if (!block) return "テキスト";

  if (block.type === "text") {
    const text = block.text.trim();

    if (text.length > 0) {
      return text.slice(0, 20);
    }
  }

  return "テキスト";
}

export default function LayerPanel({
  mixedLayers,
  blocks,
  images,
  activeBlockId,
  selectedImageId,
  onSelectBlock,
  onSelectImage,
  onMoveLayerFront,
  onMoveLayerBack,
  onMoveLayerForward,
  onMoveLayerBackward,
  onDeleteLayer,
}: Props) {
  const layers = useMemo(
    () => [...mixedLayers].sort((a, b) => b.z - a.z),
    [mixedLayers],
  );

  const blockMap = useMemo(
    () => new Map(blocks.map((block) => [block.id, block])),
    [blocks],
  );

  const imageMap = useMemo(
    () => new Map(images.map((image) => [image.id, image])),
    [images],
  );

  const imageIndexMap = useMemo(
    () => new Map(images.map((image, index) => [image.id, index + 1])),
    [images],
  );

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <header className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3">
        <Layers3 className="h-4 w-4 text-zinc-700" />
        <div className="text-sm font-semibold text-zinc-800">レイヤー</div>
        <div className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
          {layers.length}
        </div>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {layers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
            レイヤーがありません
          </div>
        ) : (
          layers.map((layer) => {
            let title = "レイヤー";
            let meta = "";
            let kindLabel = "文字";
            let icon = <Type className="h-4 w-4" />;

            if (layer.kind === "image") {
              const image = imageMap.get(layer.id);
              const imageNumber = imageIndexMap.get(layer.id);

              title = `画像 ${imageNumber ?? "-"}`;
              kindLabel = "画像";
              icon = <ImageIcon className="h-4 w-4" />;

              if (image) {
                meta = `${Math.round(image.w)} × ${Math.round(image.h)}`;
              }
            } else {
              const block = blockMap.get(layer.id);
              title = getBlockLabel(block);

              if (block?.type === "text") {
                meta = `${block.fontSize}px`;
              }
            }

            const isSelected =
              (layer.kind === "block" && activeBlockId === layer.id) ||
              (layer.kind === "image" && selectedImageId === layer.id);

            const isTop = layer.z === mixedLayers.length;
            const isBottom = layer.z === 1;

            const handleSelect = () => {
              if (layer.kind === "block") {
                onSelectBlock?.(layer.id);
                onSelectImage?.(null);
              } else {
                onSelectBlock?.("");
                onSelectImage?.(layer.id);
              }
            };
            return (
              <div
                key={layer.id}
                role="button"
                tabIndex={0}
                onClick={handleSelect}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect();
                  }
                }}
                className={[
                  "group w-full rounded-2xl border px-3 py-3 text-left transition",
                  "shadow-sm",
                  isSelected
                    ? "border-blue-300 bg-blue-50 ring-1 ring-blue-200"
                    : "border-zinc-200 bg-white hover:bg-zinc-50",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                      isSelected
                        ? "border-blue-200 bg-white text-blue-700"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600",
                    ].join(" ")}
                  >
                    {icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 break-all text-sm font-medium leading-5 text-zinc-800">
                      {title}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span>{kindLabel}</span>

                      {meta && (
                        <>
                          <span className="text-zinc-300">•</span>
                          <span>{meta}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayerFront?.(layer);
                    }}
                    disabled={isTop}
                    className={[
                      "rounded-lg border bg-white p-2",
                      isTop
                        ? "cursor-not-allowed border-zinc-100 text-zinc-300"
                        : "border-zinc-200 text-zinc-600 hover:bg-zinc-50",
                    ].join(" ")}
                    aria-label="最前面へ"
                    title="最前面へ"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayerForward?.(layer);
                    }}
                    disabled={isTop}
                    className={[
                      "rounded-lg border bg-white px-2 py-2 text-[11px] font-semibold",
                      isTop
                        ? "cursor-not-allowed border-zinc-100 text-zinc-300"
                        : "border-zinc-200 text-zinc-600 hover:bg-zinc-50",
                    ].join(" ")}
                    aria-label="一段前へ"
                    title="一段前へ"
                  >
                    +1
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayerBackward?.(layer);
                    }}
                    disabled={isBottom}
                    className={[
                      "rounded-lg border bg-white px-2 py-2 text-[11px] font-semibold",
                      isBottom
                        ? "cursor-not-allowed border-zinc-100 text-zinc-300"
                        : "border-zinc-200 text-zinc-600 hover:bg-zinc-50",
                    ].join(" ")}
                    aria-label="一段後ろへ"
                    title="一段後ろへ"
                  >
                    -1
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayerBack?.(layer);
                    }}
                    disabled={isBottom}
                    className={[
                      "rounded-lg border bg-white p-2",
                      isBottom
                        ? "cursor-not-allowed border-zinc-100 text-zinc-300"
                        : "border-zinc-200 text-zinc-600 hover:bg-zinc-50",
                    ].join(" ")}
                    aria-label="最背面へ"
                    title="最背面へ"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer?.(layer);
                    }}
                    className="rounded-lg border border-red-200 bg-white p-2 text-red-500 hover:bg-red-50"
                    aria-label="削除"
                    title="削除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
