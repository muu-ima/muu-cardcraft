"use client";

type Props = {
  zoomLabel?: string;
  onZoomIn?: () => void;
  onResetZoom?: () => void;
};

export default function CanvasFooter({
  zoomLabel = "100%",
  onZoomIn,
  onResetZoom,
}: Props) {
  return (
    <footer className="h-16 shrink-0 border-t border-white/40 bg-white/60 backdrop-blur">
      <div className="mx-auto flex h-full max-w-md items-center justify-center gap-3 px-4">
        <button
          type="button"
          onClick={onResetZoom}
          className="rounded-full border border-zinc-200 bg-white/85 px-4 py-2 text-sm text-zinc-700 shadow-sm transition hover:bg-white"
        >
          リセット
        </button>

        <div className="min-w-[76px] rounded-full border border-zinc-200 bg-white/85 px-4 py-2 text-center text-sm font-medium text-zinc-700 shadow-sm">
          {zoomLabel}
        </div>

        <button
          type="button"
          onClick={onZoomIn}
          className="rounded-full border border-zinc-300 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-white"
          aria-label="拡大"
        >
          ＋
        </button>
      </div>
    </footer>
  );
}
