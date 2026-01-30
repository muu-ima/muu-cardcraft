// app/components/panels/TextPanel.tsx
"use client";

import type { Block } from "@/shared/blocks";
import type { FontSizeDelta } from "@/shared/fonts";
import PanelSection from "@/app/components/panels/PanelSection";
import { Trash2 } from "lucide-react";

type Side = "front" | "back";

type TextPanelProps = {
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

  // ✅ 追加：削除用
  onDeleteBlock?: (id: string) => void;
};

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

export default function TextPanel(props: TextPanelProps) {
  const {
    side,
    onChangeSide,
    blocks,
    onAddBlock,
    onBumpFontSize,
    onChangeWidth,
    activeBlockId,
    onDeleteBlock, // ✅ ここで受け取る
  } = props;

  // この面のブロックだけ
  const normalBlocks = blocks.filter((b) => (b.side ? b.side === side : true));

  const activeBlock =
    activeBlockId != null
      ? (normalBlocks.find((b) => b.id === activeBlockId) ?? null)
      : null;

  const target = activeBlock ?? normalBlocks[0] ?? null;
  const widthValue = target?.width ?? 200;
  const fontSizeValue = target?.fontSize ?? 16;

  return (
    <div className="space-y-4">
      {/* 表/裏の切り替え */}
      <PanelSection title="編集する面" desc="表面 / 裏面 を切り替えます。">
        <SideToggle side={side} onChangeSide={onChangeSide} />
      </PanelSection>

      {/* テキスト一覧＋追加 */}
      <PanelSection
        title="テキスト"
        desc="内容の編集はキャンバス上で行います。ここではブロックの追加と削除、スタイルを調整します。"
      >
        <div className="space-y-3">
          <button
            type="button"
            onClick={onAddBlock}
            className="w-full rounded-lg border border-zinc-300 py-1.5 text-sm hover:bg-zinc-50"
          >
            ＋ テキストを追加
          </button>

          <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
            {normalBlocks.map((b, index) => {
              const isActive = b.id === activeBlockId;
              return (
                <div
                  key={b.id}
                  className={[
                    "rounded-lg border px-3 py-2 text-xs relative",
                    isActive
                      ? "border-pink-400 bg-pink-50/60"
                      : "border-zinc-200 bg-white",
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
                          className="rounded-full p-1 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
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
