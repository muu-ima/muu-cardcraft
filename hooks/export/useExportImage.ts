"use client";

import { toJpeg, toPng } from "html-to-image";
import { CARD_BASE_W, CARD_BASE_H } from "@/shared/print";

export function useExportImage() {
  const downloadImage = async (
    format: "png" | "jpeg",
    exportEl: HTMLElement,
  ) => {
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      const dataUrl =
        format === "png"
          ? await toPng(exportEl, {
              width: CARD_BASE_W,
              height: CARD_BASE_H,
              pixelRatio: 2,
              cacheBust: true,
            })
          : await toJpeg(exportEl, {
              width: CARD_BASE_W,
              height: CARD_BASE_H,
              pixelRatio: 2,
              quality: 0.92,
              cacheBust: true,
            });

      const link = document.createElement("a");
      link.download = `card.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("[downloadImage failed]", error);

      if (error instanceof Event) {
        const target = error.target as HTMLImageElement | null;
        console.error("[image load failed src]", target?.src);
      }

      throw error;
    }
  };

  return { downloadImage };
}
