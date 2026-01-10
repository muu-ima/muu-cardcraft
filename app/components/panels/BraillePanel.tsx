// app/components/panels/BraillePanel.tsx
"use client";

import { useMemo, useState } from "react";
import type { Block } from "@/shared/blocks";
import PanelSection from "@/app/components/panels/PanelSection";
import { toBraille } from "@/shared/braille";

type Props = {
  blocks: Block[];
  onChangeText: (id: string, value: string) => void;
  onCommitText: (id: string, value: string) => void;
  onAddBrailleBlock: () => void;
};

export default function BraillePanel({
  blocks,
  onChangeText,
  onCommitText,
  onAddBrailleBlock,
}: Props) {
  // ✅ 点字ブロックだけ抽出（isBraille === true）
  const brailleBlocks = useMemo(
    () => blocks.filter((b) => b.isBraille),
    [blocks],
  );

  // ✅ ブロックごとの「かな入力」をローカルで管理
  const [kanaById, setKanaById] = useState<Record<string, string>>({});

  const handleChangeBraille = (id: string, value: string) => {
    setKanaById((prev) => ({ ...prev, [id]: value }));
    // ⚠ ここでは親を更新しない（キーボード安定用）
  };

  const handleCommitBraille = (id: string) => {
    const kana = kanaById[id] ?? "";
    const converted = toBraille(kana);

    // ✅ 確定時だけキャンバス側のテキストを更新
    onChangeText(id, converted);
    onCommitText(id, converted);
  };

  return (
    <div className="space-y-4">
      <PanelSection
        title="点字テキスト"
        desc="かなで入力すると、このパネル下部に点字プレビューが表示され、確定するとキャンバス上に反映されます。"
      >
        <div className="space-y-3">
          {brailleBlocks.length === 0 && (
            <button
              type="button"
              onClick={onAddBrailleBlock}
              className="w-full rounded-lg bg-pink-500 py-2 text-sm font-medium text-white hover:bg-pink-600"
            >
              ＋ 点字ブロックを追加
            </button>
          )}

          {brailleBlocks.map((block) => {
            const kana = kanaById[block.id] ?? "";
            const preview = toBraille(kana);

            return (
              <div
                key={block.id}
                className="space-y-2 rounded-lg border border-zinc-200 bg-white p-2"
              >
                <textarea
                  className="w-full rounded-md border border-zinc-200 bg-white p-2 text-sm"
                  rows={2}
                  value={kana}
                  onChange={(e) => handleChangeBraille(block.id, e.target.value)}
                  placeholder="例: やまだ たろう / でざいなー"
                />

                {/* ✅ パネル内での点字プレビュー */}
                <p className="min-h-6 text-xs text-zinc-500">
                  プレビュー: <span className="font-braille">{preview}</span>
                </p>

                <button
                  type="button"
                  onClick={() => handleCommitBraille(block.id)}
                  className="w-full rounded-lg bg-zinc-900 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
                >
                  この行の点字を確定
                </button>
              </div>
            );
          })}
        </div>
      </PanelSection>
    </div>
  );
}
