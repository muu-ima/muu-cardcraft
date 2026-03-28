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
    <div className="pointer-events-none flex justify-center">
      <div className="relative h-1.5" style={{ width: trackWidth }}>
        <div
          className="absolute left-0 top-0 h-1.5 rounded-full bg-black/45 transition-[width,transform]"
          style={{
            width: `${thumbWidth}px`,
            transform: `translateX(${thumbLeft}px)`,
          }}
        />
      </div>
    </div>
  );
}
