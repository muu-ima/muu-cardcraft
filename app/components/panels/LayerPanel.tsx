"use client";

import type { Block } from "@/shared/blocks";
import type { CardImage } from "@/shared/images";

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
};

export default function LayerPanel({
  mixedLayers,
  blocks,
  images,
  activeBlockId,
  selectedImageId,
  onSelectBlock,
  onSelectImage,
}: Props) {
  // 前面を上にする
  const layers = [...mixedLayers].sort((a, b) => b.z - a.z);

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-zinc-600">レイヤー</div>

      <div className="space-y-1">
        {layers.map((layer) => {
          let title = "レイヤー";
          let meta = "";

          if (layer.kind === "image") {
            const img = images.find((i) => i.id === layer.id);
            title = "画像";

            if (img) {
              meta = `${Math.round(img.w)} × ${Math.round(img.h)}`;
            }
          } else {
            const block = blocks.find((b) => b.id === layer.id);

            if (block?.type === "text") {
              title = block.text.trim().length > 0 ? block.text : "テキスト";
              meta = `${block.fontSize}px`;
            }
          }

          const isSelected =
            (layer.kind === "block" && activeBlockId === layer.id) ||
            (layer.kind === "image" && selectedImageId === layer.id);

          return (
            <button
              key={layer.id}
              onClick={() => {
                if (layer.kind === "block") {
                  onSelectBlock?.(layer.id);
                  onSelectImage?.(null);
                } else {
                  onSelectImage?.(layer.id);
                }
              }}
              className={[
                "w-full text-left rounded-md border px-3 py-2 text-sm",
                isSelected
                  ? "border-blue-400 bg-blue-50"
                  : "border-zinc-200 hover:bg-zinc-50",
              ].join(" ")}
            >
              <div className="font-medium text-zinc-700">{title}</div>

              {meta && <div className="text-xs text-zinc-500">{meta}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
