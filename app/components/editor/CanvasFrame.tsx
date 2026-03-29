"use client";

import React from "react";
import PrintGuides from "@/app/components/editor/PrintGuides";

type Props = {
  cardRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
  cardW: number;
  cardH: number;
  isPreview: boolean;
  showGuides?: boolean;
  children: React.ReactNode;
  origin?: "top-left" | "center";
};

export default function CanvasFrame({
  cardRef,
  scale,
  cardW,
  cardH,
  isPreview,
  showGuides = false,
  children,
  origin = "top-left",
}: Props) {
  return (
    <section className="flex flex-col items-center gap-3">
      <div className="w-full flex justify-center">
        <div
          className="relative mx-auto"
          style={{
            width: cardW * scale,
            height: cardH * scale,
          }}
        >
          <div
            ref={cardRef}
            className={[
              "relative",
              isPreview ? "overflow-hidden" : "overflow-visible",
            ].join(" ")}
            style={{
              width: cardW,
              height: cardH,
              transform: `scale(${scale})`,
              transformOrigin:
                origin === "center" ? "center center" : "top left",
            }}
          >
            {children}
          </div>

          {showGuides && (
            <PrintGuides scale={scale} cardW={cardW} cardH={cardH} />
          )}
        </div>
      </div>

      {!isPreview && (
        <p className="w-full max-w-[480px] text-xs text-zinc-500">
          ※プレビュー時はドラッグできません。編集モードで配置を調整してください。
        </p>
      )}
    </section>
  );
}
