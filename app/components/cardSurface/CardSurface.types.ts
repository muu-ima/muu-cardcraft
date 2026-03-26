import type React from "react";
import type { CSSProperties, RefObject } from "react";
import type { Block } from "@/shared/blocks";
import type { CardImage } from "@/shared/images";
import type { DesignKey } from "@/shared/design";
import type { Side } from "@/app/editor/CardEditor.types";

export type MixedLayer = {
  kind: "block" | "image";
  id: string;
  z: number;
};

export type SnapGuide = {
  type: "centerX" | "centerY" | "left" | "top";
  pos: number;
} | null;

export type CardSurfaceProps = {
  blocks: Block[];
  images?: CardImage[];
  mixedLayers: MixedLayer[];

  onMoveImage?: (id: string, x: number, y: number) => void;
  design: DesignKey;
  side: Side;
  w: number;
  h: number;

  snapGuide?: SnapGuide;

  /** 編集可能か (ドラッグ有無) */
  interactive?: boolean;
  editingBlockId?: string | null;

  /** ブロック押下（選択/ドラッグ開始） */
  onBlockPointerDown?: (
    e: React.PointerEvent<HTMLDivElement>,
    blockId: string,
  ) => void;

  /** 同じブロックを再タップで編集開始 */
  onStartInlineEdit?: (blockId: string) => void;

  /** 外クリック（選択解除など） */
  onSurfacePointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;

  /** 選択中ブロック */
  activeBlockId?: string;

  /** editor / export 用 ref */
  cardRef?: RefObject<HTMLDivElement | null>;
  blockRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>;

  /** class / style 拡張 */
  className?: string;
  style?: CSSProperties;

  /** resizeImage */
  selectedImageId?: string | null;
  onSelectImage?: (id: string | null) => void;
  onResizeImageStart?: (
    e: React.PointerEvent,
    image: { id: string; w: number; h: number },
  ) => void;

  onResizeBlockStart?: (
    e: React.PointerEvent,
    block: { id: string; width?: number },
  ) => void;
};
