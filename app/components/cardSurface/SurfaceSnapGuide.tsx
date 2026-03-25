import type { SnapGuide } from "@/app/components/cardSurface/CardSurface.types";

type Props = {
  snapGuide?: SnapGuide;
};

export function SurfaceSnapGuide({ snapGuide }: Props) {
  if (!snapGuide) return null;

  const isVertical = snapGuide.type === "centerX" || snapGuide.type === "left";

  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        background: "rgba(0,0,0,0.4)",
        zIndex: 50,
        ...(isVertical
          ? {
              left: snapGuide.pos,
              top: 0,
              width: 1,
              height: "100%",
            }
          : {
              top: snapGuide.pos,
              left: 0,
              height: 1,
              width: "100%",
            }),
      }}
    />
  );
}
