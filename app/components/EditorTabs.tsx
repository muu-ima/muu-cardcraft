"use client";

import type { TabKey } from "@/shared/editor";
type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export default function EditorTabs({ activeTab, onChange }: Props) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: "text", label: "文字" },
    { key: "font", label: "フォント" },
    { key: "design", label: "カード背景" },
    { key: "export", label: "書き出し" },
  ];

  return (
    <div className="flex text-sm border-b">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 border-b-2 -mb-px ${
            activeTab === t.key
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-zinc-500 hover:text-zinc-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
