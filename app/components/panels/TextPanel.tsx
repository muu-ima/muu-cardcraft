// app/components/panels/TextPanel.tsx
"use client";

import type { Block } from "@/shared/blocks";
import type { FontSizeDelta } from "@/shared/fonts";
import PanelSection from "@/app/components/panels/PanelSection";
import { Trash2 } from "lucide-react";

type TextPanelProps = {
  blocks: Block[];
  onAddBlock: () => void;
  isPreview: boolean;
  onChangeText: (id: string, value: string) => void;
  onCommitText: (id: string, value: string) => void;
  onBumpFontSize?: (id: string, delta: FontSizeDelta) => void;
  onChangeWidth?: (id: string, width: number) => void;
  activeBlockId?: string | null;

  // ✅ 追加：削除用
  onDeleteBlock?: (id: string) => void;
};

export default function TextPanel(props: TextPanelProps) {
  const {
    blocks,
    onAddBlock,
    onBumpFontSize,
    onChangeWidth,
    activeBlockId,
    onDeleteBlock, // ✅ ここで受け取る
  } = props;

  // 親から現在面の blocks を受け取る前提
  const normalBlocks = blocks;

  const activeBlock =
    activeBlockId != null
      ? (normalBlocks.find((b) => b.id === activeBlockId) ?? null)
      : null;

  const target = activeBlock ?? normalBlocks[0] ?? null;
  const widthValue = target?.width ?? 200;
  const fontSizeValue = target?.fontSize ?? 16;

  return (
    <div className="space-y-4">
      {/* テキスト一覧＋追加 */}
      <PanelSection
        title="テキスト"
        desc="内容の編集はキャンバス上で行います。ここではブロックの追加と削除、スタイルを調整します。"
      >
        <div className="space-y-3">
          <button
            type="button"
            onClick={onAddBlock}
            className="w-full rounded-lg border border-zinc-300/70 bg-white/20 py-1.5 text-sm hover:bg-white/30 backdrop-blur-sm"
          >
            ＋ テキストを追加
          </button>

          <div className="space-y-2 pr-1">
            {normalBlocks.map((b, index) => {
              const isActive = b.id === activeBlockId;
              return (
                <div
                  key={b.id}
                  className={[
                    "rounded-lg border px-3 py-2 text-xs relative",
                    isActive
                      ? "border-pink-300 bg-white/35 backdrop-blur-sm"
                      : "border-zinc-200/70 bg-white/20 backdrop-blur-sm",
                  ].join(" ")}
                >
                  {/* ✅ 上部：タイトル＋フォントサイズ＋削除ボタン */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>{`テキスト${index + 1}`}</span>
                    <div className="flex items-center gap-1">
                      <span>{b.fontSize}px</span>
                      {onDeleteBlock && (
                        <button
                          type="button"
                          aria-label="テキストを削除"
                          onClick={() => {
                            const ok =
                              window.confirm(
                                "このテキストブロックを削除しますか？",
                              );
                            if (!ok) return;
                            onDeleteBlock(b.id);
                          }}
                          className="rounded-full p-1 hover:bg-white/40 text-zinc-400 hover:text-zinc-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* プレビュー */}
                  <p className="mt-1 text-sm line-clamp-2">
                    {b.text || "（未入力）"}
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    キャンバス上でダブルクリックして内容を編集できます。
                  </p>
                </div>
              );
            })}

            {normalBlocks.length === 0 && (
              <p className="text-xs text-zinc-400">
                まだテキストブロックがありません。「＋
                テキストを追加」から作成してください。
              </p>
            )}
          </div>
        </div>
      </PanelSection>

      {/* スタイル調整（フォントサイズ・幅） */}
      {target && (onBumpFontSize || onChangeWidth) && (
        <PanelSection
          title="選択中テキストのスタイル"
          desc="フォントサイズとテキスト幅を調整します。"
        >
          <div className="space-y-3">
            {onBumpFontSize && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>フォントサイズ</span>
                  <span>{fontSizeValue}px</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={36}
                  step={1}
                  value={fontSizeValue}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    const delta = next - fontSizeValue;
                    if (delta !== 0) {
                      onBumpFontSize(target.id, delta as FontSizeDelta);
                    }
                  }}
                  className="w-full"
                />
              </div>
            )}

            {onChangeWidth && (
              <div className="space-y-1">
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
          </div>
        </PanelSection>
      )}
    </div>
  );
}
