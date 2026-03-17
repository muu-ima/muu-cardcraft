// app/components/ExportSurface.tsx
"use client";

import { forwardRef } from "react";
import CardSurface from "@/app/components/CardSurface";
import type { Block } from "@/shared/blocks";
import type { DesignKey } from "@/shared/design";
import { CARD_BASE_W, CARD_BASE_H } from "@/shared/print";
import type { CardImage } from "@/shared/images";

type Props = {
  blocks: Block[];
  images?: CardImage[];
  design: DesignKey;
};

const ExportSurface = forwardRef<HTMLDivElement, Props>(function ExportSurface(
  { blocks, images = [], design },
  ref,
) {
  const mixedLayers = [
    ...images.map((img) => ({
      kind: "image" as const,
      id: img.id,
      z: img.z,
    })),
    ...blocks.map((block) => ({
      kind: "block" as const,
      id: block.id,
      z: block.z,
    })),
  ].sort((a, b) => a.z - b.z);

  return (
    <div
      style={{
        position: "fixed",
        left: -10000,
        top: 0,
        width: CARD_BASE_W,
        height: CARD_BASE_H,
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      {/* ref はこの div に付ける */}
      <div ref={ref} style={{ width: CARD_BASE_W, height: CARD_BASE_H }}>
        <CardSurface
          blocks={blocks}
          images={images}
          mixedLayers={mixedLayers}
          design={design}
          w={CARD_BASE_W}
          h={CARD_BASE_H}
          interactive={false}
        />
      </div>
    </div>
  );
});

export default ExportSurface;
