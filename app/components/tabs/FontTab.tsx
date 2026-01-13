"use client";

import { FONT_DEFINITIONS, type FontKey } from "@/shared/fonts";

type FontOption = {
  key: FontKey;
  label: string;
  css: string;
};

type Props = {
  value: FontKey;
  onChange: (font: FontKey) => void;
  fonts?: FontOption[];
};

export default function FontTab({ value, onChange, fonts }: Props) {
  const items: FontOption[] =
    fonts ??
    (Object.entries(FONT_DEFINITIONS).map(([key, def]) => ({
      key: key as FontKey,
      label: def.label,
      css: def.css,
    })) as FontOption[]);

  return (
    <div className="space-y-2">
      {items.map(({ key, label, css }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={[
            "w-full rounded-xl border px-3 py-2 text-left transition",
            value === key
              ? "border-pink-400 bg-pink-500/10"
              : "border-zinc-200 hover:bg-zinc-900/5",
          ].join(" ")}
          style={{ fontFamily: css }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
