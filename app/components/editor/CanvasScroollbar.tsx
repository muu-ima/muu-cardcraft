"use client";

type Props = {
  visible: boolean;
  trackWidth: number;
  thumbWidth: number;
  thumbLeft: number;
};

export default function CanvasScrollbar({
  visible,
  trackWidth,
  thumbWidth,
  thumbLeft,
}: Props) {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute bottom-6 left-1/2 z-40 -translate-x-1/2"
      style={{ width: trackWidth }}
    >
      <div className="h-2 rounded-full bg-black/20 shadow-sm">
        <div
          className="h-2 rounded-full bg-black/60 transition-[width,transform]"
          style={{
            width: `${thumbWidth}px`,
            transform: `translateX(${thumbLeft}px)`,
          }}
        />
      </div>
    </div>
  );
}
