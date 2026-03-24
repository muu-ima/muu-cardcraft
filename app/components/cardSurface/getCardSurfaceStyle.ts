import type { CSSProperties } from "react";
import type { DesignKey } from "@/shared/design";
import { CARD_FULL_DESIGNS } from "@/shared/cardDesigns";

export function getCardSurfaceStyle(design: DesignKey): CSSProperties {
  const fallbackKey: DesignKey = "mint";
  const def = CARD_FULL_DESIGNS[design] ?? CARD_FULL_DESIGNS[fallbackKey];

  return def.bg.image
    ? {
        backgroundImage: `url(${def.bg.image})`,
        backgroundSize: def.bg.mode ?? "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: def.bg.color,
      }
    : {
        backgroundColor: def.bg.color,
      };
}
