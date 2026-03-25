import type React from "react";
import type { Block } from "@/shared/blocks";
import type { CardImage } from "@/shared/images";
import type { MixedLayer } from "@/app/components/cardSurface/CardSurface.types";

export type RenderLayerArgs = {
  layer: MixedLayer;
  blocks: Block[];
  images: CardImage[];
  interactive: boolean;
  activeBlockId?: string;
  editingBlockId?: string | null;
  selectedImageId?: string | null;
  dragImageId?: string | null;
  blockRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  onSelectImage?: (id: string | null) => void;
  onImagePointerDown: (
    e: React.PointerEvent<HTMLDivElement>,
    img: CardImage,
  ) => void;
  onResizeImageStart?: (
    e: React.PointerEvent,
    image: { id: string; w: number; h: number },
  ) => void;
  onBlockPointerDown?: (
    e: React.PointerEvent<HTMLDivElement>,
    blockId: string,
  ) => void;
  onBlockClick: (block: Block) => void;
  onResizeBlockStart?: (
    e: React.PointerEvent,
    block: { id: string; width?: number },
  ) => void;
};
