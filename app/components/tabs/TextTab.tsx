// app/components/tabs/TextTab.tsx
"use client";

import type { Block } from "@/shared/blocks";
import type { FontSizeDelta } from "@/shared/fonts";

type Props = {
  blocks: Block[];
  isPreview: boolean;
  onAddBlock: () => void;
  onChangeText?: (id: string, value: string) => void; // ← optionalに
  onCommitText?: (id: string, value: string) => void;
  canEdit?: boolean; // あってもいい（なくてもOK）
  onBumpFontSize?: (id: string, delta: FontSizeDelta) => void;
  onChangeWidth?: (id: string, width: number) => void;
  
  /** 👇 追加：選択中ブロック情報 */
  activeBlockId?: string | null;
  activeBlockWidth?: number | null;
};

export default function TextTab({
  blocks,
  isPreview,
  onAddBlock,
  onChangeText,
  onCommitText,
  onBumpFontSize,
}: Props) {
  return (
    <div className="space-y-4 pt-2">
      {/* 追加ボタン */}
      <button
        onClick={onAddBlock}
        className="w-full rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
      >
        ＋ テキストを追加
      </button>
      {blocks.map((block, index) => (
        <div key={block.id}>
          <label className="text-sm text-zinc-700 dark:text-zinc-200">
            テキスト{index + 1}
          </label>
          <textarea
            value={block.text}
            onChange={(e) => onChangeText?.(block.id, e.target.value)}
            onBlur={(e) => onCommitText?.(block.id, e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                onCommitText?.(
                  block.id,
                  (e.target as HTMLTextAreaElement).value
                );
              }
            }}
            disabled={isPreview}
            rows={3}
            className="mt-1 w-full resize-y rounded border px-3 py-2 text-sm dark:bg-neutral-800 dark:text-zinc-50"
          />
          <button
            type="button"
            disabled={isPreview || !onBumpFontSize}
            onClick={() => onBumpFontSize?.(block.id, -1)}
          >
            −
          </button>

          <div>{block.fontSize}</div>

          <button
            type="button"
            disabled={isPreview || !onBumpFontSize}
            onClick={() => onBumpFontSize?.(block.id, +1)}
          >
            ＋
          </button>
        </div>
      ))}
    </div>
  );
}
