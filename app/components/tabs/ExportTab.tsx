"use client";

import { useState } from "react";

type Props = {
  onDownload: (format: "png" | "jpeg") => void;
};

export default function ExportTab({ onDownload }: Props) {
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [quality, setQuality] = useState(0.92);

  return (
    <div className="space-y-4 pt-4">
      <p className="text-sm text-zinc-600">
        仕上がった名刺を画像として書き出します。
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFormat("png")}
          className={`rounded border px-3 py-2 text-sm ${
            format === "png"
              ? "border-blue-500 bg-blue-50"
              : "hover:bg-zinc-100"
          }`}
        >
          PNG
        </button>

        <button
          type="button"
          onClick={() => setFormat("jpeg")}
          className={`rounded border px-3 py-2 text-sm ${
            format === "jpeg"
              ? "border-blue-500 bg-blue-50"
              : "hover:bg-zinc-100"
          }`}
        >
          JPEG
        </button>
      </div>

      {format === "jpeg" && (
        <div className="space-y-1">
          <label className="text-sm text-zinc-700">JPEG 画質: {quality}</label>
          <input
            type="range"
            min={0.5}
            max={1}
            step={0.01}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => onDownload(format)}
        className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm text-white"
      >
        {format === "png" ? "PNG でダウンロード" : "JPEG でダウンロード"}
      </button>
    </div>
  );
}
