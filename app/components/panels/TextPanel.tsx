// app/components/panels/TextPanel.tsx
"use client";

import type { Block } from "@/shared/blocks";
import type { FontSizeDelta } from "@/shared/fonts";
import TextTab from "@/app/components/tabs/TextTab";
import PanelSection from "@/app/components/panels/PanelSection";

type Side = "front" | "back";

function SideToggle({
  side,
  onChangeSide,
}: {
  side: Side;
  onChangeSide: (s: Side) => void;
}) {
  return (
    <div
      className="inline-flex rounded-xl bg-white/60 backdrop-blur p-1
      shadow-[0_1px_0_rgba(0,0,0,0.08)]"
    >
      <button
        type="button"
        onClick={() => onChangeSide("front")}
        className={[
          "px-3 py-1.5 text-sm rounded-lg transition",
          side === "front"
            ? "bg-pink-500/15 text-pink-700"
            : "text-zinc-600 hover:bg-zinc-900/5",
        ].join(" ")}
      >
        表面
      </button>
      <button
        type="button"
        onClick={() => onChangeSide("back")}
        className={[
          "px-3 py-1.5 text-sm rounded-lg transition",
          side === "back"
            ? "bg-pink-500/15 text-pink-700"
            : "text-zinc-600 hover:bg-zinc-900/5",
        ].join(" ")}
      >
        裏面
      </button>
    </div>
  );
}

export default function TextPanel({
  side,
  onChangeSide,
  blocks,
  onAddBlock,
  isPreview,
  onChangeText,
  onCommitText,
  onBumpFontSize,
  onChangeWidth,
  activeBlockId,
}: {
  side: Side;
  onChangeSide: (s: Side) => void;
  blocks: Block[];
  onAddBlock: () => void;
  isPreview: boolean;
  onChangeText: (id: string, value: string) => void;
  onCommitText: (id: string, value: string) => void;
  onBumpFontSize?: (id: string, delta: FontSizeDelta) => void;
  onChangeWidth?: (id: string, width: number) => void;
  activeBlockId?: string | null;
}) {
  // ✅ この面＆通常テキストだけを対象にする（点字ブロックは除外）
  const normalBlocks = blocks.filter(
  (b) => !b.isBraille && (b.side ? b.side === side : true)
);

  // ✅ 選択中ブロック（いなければ null）
  const activeBlock =
    activeBlockId != null
      ? normalBlocks.find((b) => b.id === activeBlockId) ?? null
      : null;

  // ✅ スライダーの対象ブロック
  // 1. 選択中がいればそれ
  // 2. いなければその面の先頭

  const target = activeBlock ?? normalBlocks[0] ?? null;
  const widthValue = target?.width ?? 200;

  return (
    <div className="space-y-4">
      <PanelSection title="編集する面" desc="表面 / 裏面 を切り替えます。">
        <SideToggle side={side} onChangeSide={onChangeSide} />
      </PanelSection>

      <PanelSection
        title="テキスト編集"
        desc="内容を入力してプレビューで確認できます。"
      >
        <TextTab
          blocks={normalBlocks}
          isPreview={isPreview}
          onAddBlock={onAddBlock}
          onChangeText={onChangeText}
          onCommitText={onCommitText}
          onBumpFontSize={onBumpFontSize}
          onChangeWidth={onChangeWidth}
        />

        {target && onChangeWidth && (
          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>テキスト幅</span>
              <span>{Math.round(widthValue)}px</span>
            </div>
            <input
              type="range"
              min={80}
              max={400}
              value={widthValue}
              onChange={(e) =>
                onChangeWidth(target.id, Number(e.target.value))
              }
              className="w-full"
            />
          </div>
        )}
      </PanelSection>
    </div>
  );
}
