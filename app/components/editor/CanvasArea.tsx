// app/components/editor/CanvasArea.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
  innerRef: React.RefObject<HTMLDivElement | null>;
  onBackgroundPointerDown?: (e: React.PointerEvent) => void;

  /** 既存互換（当面は受けるだけで使わない） */
  panelVisible?: boolean;
};

export default function CanvasArea({
  children,
  innerRef,
  onBackgroundPointerDown,
}: Props) {
  return (
    <main
      className={[
        // ✅ 親が flex のとき「残り領域」を担当できる
        "flex-1 min-w-0 min-h-0",

        // ✅ スクロールはここに集約（画面に収まらないときだけ）
        "overflow-y-auto overflow-x-hidden",

        // ✅ 余白（見た目）
        "px-3 sm:px-6 lg:px-10 py-6",
        "pb-24 xl:pb-0",

        // ✅ 中央寄せ
        "flex justify-center",
      ].join(" ")}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onBackgroundPointerDown?.(e);
      }}
    >
      {/* viewport（可変） */}
      <div className="w-full flex justify-center">
        {/* scaleの基準になる“入れ物”。親レイアウト次第で幅が変わる */}
        <div ref={innerRef} className="w-full min-w-0">
          {children}
        </div>
      </div>
    </main>
  );
}
