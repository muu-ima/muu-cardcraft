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
  Image as ImageIcon,
  Layers,
  Trash2,
  Palette,
} from "lucide-react";
import {
  GhostButton,
  Segmented,
  MoreMenu,
  Divider,
} from "@/app/components/editor/ToolbarPrimitives";
import { useCenterToolbarState } from "@/app/components/editor/useCenterToolbarState";
import type { SelectedItem } from "@/shared/selection";

export type Align = "left" | "center" | "right";

export type CenterToolbarValue = {
  fontKey: FontKey;
  fontSize: number;
  bold: boolean;
  align: Align;
};

type Props = {
  /** テキスト選択中だけ値が入る */
  value: CenterToolbarValue | null;

  side: "front" | "back";
  onChangeSide: (side: "front" | "back") => void;

  showGuides: boolean;
  onToggleGuides: () => void;

  activeTab: TabKey | null;
  onOpenTab: (tab: TabKey) => void;

  onChangeFontSize: (next: number) => void;
  onToggleBold: () => void;
  onChangeAlign: (align: Align) => void;

  disabled?: boolean;
  className?: string;
  topPx?: number;
  visible?: boolean;
  sidePanelOpen: boolean;

  selectedItem: SelectedItem;
  onBringSelectedImageFront?: () => void;
  onSendSelectedImageToBack?: () => void;
  onDeleteSelectedImage?: () => void;
};

export default function CenterToolbar({
  value,
  activeTab,
  onOpenTab,
  onChangeFontSize,
  onToggleBold,
  onChangeAlign,

  side,
  onChangeSide,
  showGuides,
  onToggleGuides,

  disabled = false,
  className,
  visible = true,
  topPx = 76,
  sidePanelOpen,

  selectedItem,
  onBringSelectedImageFront = () => {},
  onSendSelectedImageToBack = () => {},
  onDeleteSelectedImage = () => {},
}: Props) {
  const {
    isFontOpen,
    isTextOpen,
    compact,
    showDefaultTools,
    showTextTools,
    showImageTools,
    textControlsDisabled,
    imageControlsDisabled,
  } = useCenterToolbarState({
    value,
    selectedItem,
    activeTab,
    side,
    sidePanelOpen,
    disabled,
  });

  const secondaryControls = (
    <>
      <Segmented
        value={side}
        options={[
          { value: "front", label: "表面" },
          { value: "back", label: "裏面" },
        ]}
        onChange={onChangeSide}
      />

      <GhostButton pressed={showGuides} onClick={onToggleGuides}>
        ガイド {showGuides ? "ON" : "OFF"}
      </GhostButton>
    </>
  );

  return (
    <div
      className={["z-40 flex justify-center h-15 w-full", className ?? ""].join(
        " ",
      )}
    >
      <div
        className={[
          "transition-opacity duration-150",
          visible ? "opacity-100" : "opacity-0",
          visible ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        <div
          className={[
            "ui-glass",
            "flex items-center gap-1 px-2 py-2 backdrop-blur",
            "rounded-2xl border border-white/45 bg-white/72 backdrop-blur-md",
            "shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]",
            "justify-between whitespace-nowrap",
            compact ? "max-w-[640px]" : "max-w-[820px]",
            value === null && !selectedItem ? "opacity-70" : "",
          ].join(" ")}
        >
          {showDefaultTools && (
            <>
              <GhostButton
                ariaLabel="画像追加を開く"
                disabled={disabled}
                onClick={() => onOpenTab("image")}
                title="画像追加"
              >
                <ImageIcon className="h-4 w-4" />
                <span>画像追加</span>
              </GhostButton>

              <GhostButton
                ariaLabel="デザインを開く"
                disabled={disabled}
                onClick={() => onOpenTab("design")}
                title="デザイン"
              >
                <Palette className="h-4 w-4" />
                <span>デザイン</span>
              </GhostButton>

              <Divider />
            </>
          )}
          {showTextTools && value && (
            <>
              <GhostButton
                pressed={isFontOpen}
                disabled={textControlsDisabled}
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
                disabled={textControlsDisabled}
                onClick={() =>
                  onChangeFontSize(clamp(value.fontSize - 1, 6, 200))
                }
              >
                <Minus className="h-4 w-4" />
              </GhostButton>

              <GhostButton
                pressed={isTextOpen}
                disabled={textControlsDisabled}
                onClick={() => onOpenTab("text")}
                className="min-w-14 justify-center"
                title="テキスト設定を開く"
              >
                <span className="tabular-nums">{value.fontSize}</span>
              </GhostButton>

              <GhostButton
                ariaLabel="文字サイズを上げる"
                disabled={textControlsDisabled}
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
                disabled={textControlsDisabled}
                onClick={onToggleBold}
              >
                <BoldIcon className="h-4 w-4" />
              </GhostButton>

              <div className="ml-1 flex items-center gap-1">
                <GhostButton
                  ariaLabel="左揃え"
                  pressed={value.align === "left"}
                  disabled={textControlsDisabled}
                  onClick={() => onChangeAlign("left")}
                >
                  <AlignLeft className="h-4 w-4" />
                </GhostButton>

                <GhostButton
                  ariaLabel="中央揃え"
                  pressed={value.align === "center"}
                  disabled={textControlsDisabled}
                  onClick={() => onChangeAlign("center")}
                >
                  <AlignCenter className="h-4 w-4" />
                </GhostButton>

                <GhostButton
                  ariaLabel="右揃え"
                  pressed={value.align === "right"}
                  disabled={textControlsDisabled}
                  onClick={() => onChangeAlign("right")}
                >
                  <AlignRight className="h-4 w-4" />
                </GhostButton>
              </div>
            </>
          )}

          {showImageTools && (
            <>
              <GhostButton
                ariaLabel="画像設定を開く"
                disabled={imageControlsDisabled}
                onClick={() => onOpenTab("image")}
                title="画像設定を開く"
              >
                <ImageIcon className="h-4 w-4" />
                <span>画像設定</span>
              </GhostButton>

              <Divider />

              <GhostButton
                ariaLabel="デザインを開く"
                disabled={imageControlsDisabled}
                onClick={() => onOpenTab("design")}
                title="デザイン設定を開く"
              >
                <Palette className="h-4 w-4" />
                <span>デザイン</span>
              </GhostButton>

              <GhostButton
                ariaLabel="画像を前面へ"
                disabled={imageControlsDisabled}
                onClick={onBringSelectedImageFront}
                title="前面へ"
              >
                <Layers className="h-4 w-4" />
                <span>前面へ</span>
              </GhostButton>

              <GhostButton
                ariaLabel="画像を背面へ"
                disabled={imageControlsDisabled}
                onClick={onSendSelectedImageToBack}
                title="背面へ"
              >
                <Layers className="h-4 w-4 rotate-180" />
                <span>背面へ</span>
              </GhostButton>

              <GhostButton
                ariaLabel="画像を削除"
                disabled={imageControlsDisabled}
                onClick={onDeleteSelectedImage}
                title="削除"
              >
                <Trash2 className="h-4 w-4" />
                <span>削除</span>
              </GhostButton>
            </>
          )}

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

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
