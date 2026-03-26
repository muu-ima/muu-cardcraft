import type { CSSProperties } from "react";
import type { DesignKey } from "@/shared/design";
import type { Side } from "@/app/editor/CardEditor.types";
import { CARD_FULL_DESIGNS } from "@/shared/cardDesigns";

export function getCardSurfaceStyle(
  design: DesignKey,
  side: Side,
): CSSProperties {
  const fallbackKey: DesignKey = "mint";
  const def = CARD_FULL_DESIGNS[design] ?? CARD_FULL_DESIGNS[fallbackKey];
  const bg = side === "front" ? def.frontBg : def.backBg;

  return bg.image
    ? {
        backgroundImage: `url(${bg.image})`,
        backgroundSize: bg.mode ?? "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: bg.color,
      }
    : {
        backgroundColor: bg.color,
      };
}
