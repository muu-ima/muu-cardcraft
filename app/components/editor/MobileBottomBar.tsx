// app/components/editor/MobileBottomBar.tsx
"use client";

import React from "react";
import type { TabKey } from "@/shared/editor";
import {
  Type,
  TextCursor,
  Image as ImageIcon,
  Download,
  Grid3X3,
} from "lucide-react";

function MobileBottomBarItem({
  tab,
  label,
  Icon,
  activeTab,
  onChangeTab,
}: {
  tab: TabKey;
  label: string;
  Icon: React.ElementType;
  activeTab: TabKey | null;
  onChangeTab: (tab: TabKey) => void;
}) {
  const active = activeTab === tab;

  return (
    <button
      type="button"
      onClick={() => onChangeTab(tab)}
      className={[
        "snap-start flex shrink-0 flex-col items-center justify-center gap-1 px-4 py-2 min-w-20",
        active ? "text-blue-700" : "text-zinc-600",
      ].join(" ")}
    >
      {/* ここが “アイコン枠” */}
      <span
        className={[
          "flex h-7 w-7 items-center justify-center rounded-md",
          active ? "bg-blue-600/15" : "bg-zinc-900/5",
        ].join(" ")}
      >
        <Icon size={16} strokeWidth={1.75} />
      </span>

      <span
        className={[
          "text-[11px] leading-none",
          active &&
            "after:block after:h-0.5 after:w-3 after:mx-auto after:rounded-full after:bg-blue-600",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}

export default function MobileBottomBar({
  activeTab,
  onChangeTab,
}: {
  activeTab: TabKey | null;
  onChangeTab: (tab: TabKey) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 xl:hidden">
      <div className="border-t bg-white/90 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-[520px] overflow-x-auto  snap-x snap-mandatory scrollbar-none">
          <div className="flex h-14 flex-nowrap gap-1 pr-2">
            <MobileBottomBarItem
              tab="text"
              label="テキスト"
              Icon={Type}
              activeTab={activeTab}
              onChangeTab={onChangeTab}
            />
            <MobileBottomBarItem
              tab="braille"
              label="点字"
              Icon={Grid3X3}
              activeTab={activeTab}
              onChangeTab={onChangeTab}
            />
            <MobileBottomBarItem
              tab="font"
              label="フォント"
              Icon={TextCursor}
              activeTab={activeTab}
              onChangeTab={onChangeTab}
            />
            <MobileBottomBarItem
              tab="design"
              label="デザイン"
              Icon={ImageIcon}
              activeTab={activeTab}
              onChangeTab={onChangeTab}
            />
            <MobileBottomBarItem
              tab="export"
              label="書き出し"
              Icon={Download}
              activeTab={activeTab}
              onChangeTab={onChangeTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
