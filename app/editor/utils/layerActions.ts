import type { Block } from "@/shared/blocks";
import type { CardImage, Side } from "@/shared/images";
import {
  buildMixedLayers,
  applyLayerOrderToBlocksAndImages,
  moveToFront,
  moveToBack,
  moveForwardOne,
  moveBackwardOne,
} from "@/shared/layers";

export type LayerMoveAction = "front" | "back" | "forward" | "backward";

export function reorderMixedLayers(params: {
  targetId: string;
  action: LayerMoveAction;
  currentBlocks: Block[];
  currentImages: CardImage[];
  side: Side;
}) {
  const { targetId, action, currentBlocks, currentImages, side } = params;

  const sideBlocks = currentBlocks.filter((b) => b.side === side);
  const otherBlocks = currentBlocks.filter((b) => b.side !== side);

  const sideImages = currentImages.filter((img) => img.side === side);
  const otherImages = currentImages.filter((img) => img.side !== side);

  const mixedLayers = buildMixedLayers(sideBlocks, sideImages);

  let nextLayers = mixedLayers;

  switch (action) {
    case "front":
      nextLayers = moveToFront(mixedLayers, targetId);
      break;
    case "back":
      nextLayers = moveToBack(mixedLayers, targetId);
      break;
    case "forward":
      nextLayers = moveForwardOne(mixedLayers, targetId);
      break;
    case "backward":
      nextLayers = moveBackwardOne(mixedLayers, targetId);
      break;
  }

  const reordered = applyLayerOrderToBlocksAndImages(
    sideBlocks,
    sideImages,
    nextLayers,
  );

  return {
    blocks: [...otherBlocks, ...reordered.blocks],
    images: [...otherImages, ...reordered.images],
  };
}

export function getSelectedLayerTarget(params: {
  activeBlockId?: string;
  selectedImageId?: string | null;
}) {
  const { activeBlockId, selectedImageId } = params;

  if (selectedImageId) {
    return { kind: "image" as const, id: selectedImageId };
  }

  if (activeBlockId) {
    return { kind: "block" as const, id: activeBlockId };
  }

  return null;
}

export function removeLayerAndReorder(params: {
  targetId: string;
  kind: "block" | "image";
  currentBlocks: Block[];
  currentImages: CardImage[];
  side: Side;
}) {
  const { targetId, kind, currentBlocks, currentImages, side } = params;

  const sideBlocks = currentBlocks.filter((b) => b.side === side);
  const otherBlocks = currentBlocks.filter((b) => b.side !== side);

  const sideImages = currentImages.filter((img) => img.side === side);
  const otherImages = currentImages.filter((img) => img.side !== side);

  const nextSideBlocks =
    kind === "block" ? sideBlocks.filter((b) => b.id !== targetId) : sideBlocks;

  const nextSideImages =
    kind === "image"
      ? sideImages.filter((img) => img.id !== targetId)
      : sideImages;

  const reordered = applyLayerOrderToBlocksAndImages(
    nextSideBlocks,
    nextSideImages,
    buildMixedLayers(nextSideBlocks, nextSideImages),
  );

  return {
    blocks: [...otherBlocks, ...reordered.blocks],
    images: [...otherImages, ...reordered.images],
  };
}
