"use client";

import type { Block } from "@/shared/blocks";
import type { CardImage } from "@/shared/images";
import {
  Layers3,
  Type,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Trash2,
} from "lucide-react";

type MixedLayer = {
  kind: "block" | "image";
  id: string;
  z: number;
};

type Props = {
  mixedLayers: MixedLayer[];
  blocks: Block[];
  images: CardImage[];

  activeBlockId?: string;
  selectedImageId?: string | null;

  onSelectBlock?: (id: string) => void;
  onSelectImage?: (id: string | null) => void;

  onMoveLayerFront?: (layer: MixedLayer) => void;
  onMoveLayerBack?: (layer: MixedLayer) => void;
  onDeleteLayer?: (layer: MixedLayer) => void;
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
  onDeleteLayer,
}: Props) {
  // 前面を上にする
  const layers = [...mixedLayers].sort((a, b) => b.z - a.z);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-2xl border border-zinc-200 bg-white">
      <header className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3">
        <Layers3 className="h-4 w-4 text-zinc-700" />
        <div className="text-sm font-semibold text-zinc-800">レイヤー</div>
        <div className="ml-auto text-xs text-zinc-400">{layers.length}件</div>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {layers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">
            レイヤーがありません
          </div>
        ) : (
          layers.map((layer, index) => {
            let title = "レイヤー";
            let meta = "";
            let icon = <Type className="h-4 w-4" />;

            if (layer.kind === "image") {
              const img = images.find((i) => i.id === layer.id);
              const imageNumber = images.findIndex((i) => i.id === layer.id);

              title = `画像 ${imageNumber >= 0 ? imageNumber + 1 : index + 1}`;
              icon = <ImageIcon className="h-4 w-4" />;

              if (img) {
                meta = `${Math.round(img.w)} × ${Math.round(img.h)}`;
              }
            } else {
              const block = blocks.find((b) => b.id === layer.id);
              title = getBlockLabel(block);

              if (block?.type === "text") {
                meta = `${block.fontSize}px`;
              }
            }

            const isSelected =
              (layer.kind === "block" && activeBlockId === layer.id) ||
              (layer.kind === "image" && selectedImageId === layer.id);

            return (
              <div
                key={layer.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (layer.kind === "block") {
                    onSelectBlock?.(layer.id);
                    onSelectImage?.(null);
                  } else {
                    onSelectImage?.(layer.id);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();

                    if (layer.kind === "block") {
                      onSelectBlock?.(layer.id);
                      onSelectImage?.(null);
                    } else {
                      onSelectImage?.(layer.id);
                    }
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
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                      isSelected
                        ? "border-blue-200 bg-white text-blue-700"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600",
                    ].join(" ")}
                  >
                    {icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-zinc-800">
                      {title}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                      <span>{layer.kind === "image" ? "画像" : "文字"}</span>

                      {meta && (
                        <>
                          <span className="text-zinc-300">•</span>
                          <span>{meta}</span>
                        </>
                      )}

                      <span className="text-zinc-300">•</span>
                      <span>z:{layer.z}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayerFront?.(layer);
                      }}
                      className="rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-50"
                      aria-label="前面へ"
                      title="前面へ"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayerBack?.(layer);
                      }}
                      className="rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-50"
                      aria-label="背面へ"
                      title="背面へ"
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
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
