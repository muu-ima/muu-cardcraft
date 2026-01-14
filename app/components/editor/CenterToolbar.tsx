"use client";

import type { TabKey } from "@/shared/editor";
import { FontKey } from "@/shared/fonts";
import {
  ChevronDown,
  Minus,
  Plus,
  Bold as BoldIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { useIsNarrowScreen } from "@/hooks/useIsNarrowScreen";
import {
  GhostButton,
  Segmented,
  MoreMenu,
  Divider,
} from "@/app/components/editor/ToolbarPrimitives";

export type Align = "left" | "center" | "right";

export type CenterToolbarValue = {
  fontKey: FontKey;
  fontSize: number;
  bold: boolean;
  align: Align;
};

type Props = {
  /** テキスト選択中だけ表示（nullなら非表示） */
  value: CenterToolbarValue | null;

  // ✅ 追加（Canvas状態）
  side: "front" | "back";
  onChangeSide: (side: "front" | "back") => void;

  showGuides: boolean;
  onToggleGuides: () => void;

  /** どのパネルが開いてるか（ハイライト用） */
  activeTab: TabKey | null;

  /** ツールバー操作で左パネルを開く */
  onOpenTab: (tab: TabKey) => void;

  /** クイック操作 */
  onChangeFontSize: (next: number) => void;
  onToggleBold: () => void;
  onChangeAlign: (align: Align) => void;

  /** プレビュー中など */
  disabled?: boolean;

  /** 固定位置の微調整など */
  className?: string;

  /** ヘッダー高さに合わせた top（デフォ 76px） */
  topPx?: number;

  /** 表示するか（透明にするだけで高さは確保） */
  visible?: boolean;
  sidePanelOpen: boolean;
};

export default function CenterToolbar({
  value,
  activeTab,
  onOpenTab,
  onChangeFontSize,
  onToggleBold,
  onChangeAlign,

  // ✅ 追加（表/裏・ガイド）
  side,
  onChangeSide,
  showGuides,
  onToggleGuides,

  disabled = false,
  className,
  visible = true,
  topPx = 76,
  sidePanelOpen,
}: Props) {
  const isFontOpen = activeTab === "font";
  const isTextOpen = activeTab === "text";
  const isNarrow = useIsNarrowScreen(1280); // xl 未満で true
  const compact = sidePanelOpen && isNarrow;

  // ✅ 右側に出したい「表裏トグル＋ガイド」をまとめておく
  const secondaryControls = (
    <>
      <Segmented
        disabled={disabled}
        value={side}
        options={[
          { value: "front", label: "表面" },
          { value: "back", label: "裏面" },
        ]}
        onChange={onChangeSide}
      />

      <GhostButton
        disabled={disabled}
        pressed={showGuides}
        onClick={onToggleGuides}
      >
        ガイド {showGuides ? "ON" : "OFF"}
      </GhostButton>
    </>
  );

  return (
    // ① stickyの席（高さ固定）
    <div
      className={[
        "sticky z-40 flex justify-center h-15 w-full",
        className ?? "",
      ].join(" ")}
      style={{ top: topPx }}
    >
      {/* ② 透明化レイヤー */}
      <div
        className={[
          "transition-opacity duration-150",
          visible ? "opacity-100" : "opacity-0",
          visible ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        {/* ③ ツールバー本体（見た目はここ1回） */}
        <div
          className={[
            "flex items-center gap-1 rounded-2xl bg-white/85 px-2 py-2 backdrop-blur",
            "shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.12)]",
            "justify-between whitespace-nowrap",
            compact ? "max-w-[640px]" : "max-w-[820px]",
            value === null ? "opacity-70" : "",
          ].join(" ")}
        >
          {/* ✅ ① テキスト系 */}
          {value && (
            <>
              <GhostButton
                pressed={isFontOpen}
                disabled={disabled}
                onClick={() => onOpenTab("font")}
                className="max-w-[220px]"
                title="フォントを開く"
              >
                <span className="max-w-[200px] truncate font-medium text-sm">
                  {value.fontKey}
                </span>
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              </GhostButton>

              <Divider />

              <GhostButton
                ariaLabel="文字サイズを下げる"
                disabled={disabled}
                onClick={() =>
                  onChangeFontSize(clamp(value.fontSize - 1, 6, 200))
                }
              >
                <Minus className="h-4 w-4" />
              </GhostButton>

              <GhostButton
                pressed={isTextOpen}
                disabled={disabled}
                onClick={() => onOpenTab("text")}
                className="min-w-14 justify-center border"
                title="テキスト設定を開く"
              >
                <span className="tabular-nums">{value.fontSize}</span>
              </GhostButton>

              <GhostButton
                ariaLabel="文字サイズを上げる"
                disabled={disabled}
                onClick={() =>
                  onChangeFontSize(clamp(value.fontSize + 1, 6, 200))
                }
              >
                <Plus className="h-4 w-4" />
              </GhostButton>

              <Divider />

              <GhostButton
                ariaLabel="太字"
                pressed={value.bold}
                disabled={disabled}
                onClick={onToggleBold}
              >
                <BoldIcon className="h-4 w-4" />
              </GhostButton>

              <div className="ml-1 flex items-center gap-1">
                <GhostButton
                  ariaLabel="左揃え"
                  pressed={value.align === "left"}
                  disabled={disabled}
                  onClick={() => onChangeAlign("left")}
                >
                  <AlignLeft className="h-4 w-4" />
                </GhostButton>

                <GhostButton
                  ariaLabel="中央揃え"
                  pressed={value.align === "center"}
                  disabled={disabled}
                  onClick={() => onChangeAlign("center")}
                >
                  <AlignCenter className="h-4 w-4" />
                </GhostButton>

                <GhostButton
                  ariaLabel="右揃え"
                  pressed={value.align === "right"}
                  disabled={disabled}
                  onClick={() => onChangeAlign("right")}
                >
                  <AlignRight className="h-4 w-4" />
                </GhostButton>
              </div>
            </>
          )}

          {/* ✅ 右側：表裏 & ガイド → compactのときだけ More に入れる */}
          <div className="flex items-center gap-1">
            {compact ? (
              <MoreMenu>{secondaryControls}</MoreMenu>
            ) : (
              secondaryControls
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
