"use client";

import Image from "next/image";
import type { DesignKey } from "@/shared/design";

type DesignOption = {
  key: DesignKey;
  label: string;
  bgColor?: string;
  image?: string;
  mode?: "cover" | "contain";
};

type Props = {
  value: DesignKey;
  designs: DesignOption[];
  onChange: (next: DesignKey) => void;
  variant?: "default" | "swatch";
};

export default function DesignTab({
  value,
  designs,
  onChange,
  variant = "default",
}: Props) {
  const isSwatch = variant === "swatch";

  return (
    <div className="space-y-3 pt-4 text-sm">
      <p>カードの背景デザインを選択してください。</p>

      <div className={isSwatch ? "grid grid-cols-6 gap-2" : "grid gap-2"}>
        {designs.map((d) => {
          if (isSwatch) {
            const active = value === d.key;

            return (
              <button
                key={d.key}
                type="button"
                onClick={() => onChange(d.key)}
                className="relative flex h-8 w-8 items-center justify-center"
                aria-label={d.label}
                title={d.label}
              >
                <span
                  className="h-7 w-7 rounded-full border border-zinc-300"
                  style={{ backgroundColor: d.bgColor ?? "#ffffff" }}
                />
                {active && (
                  <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-pink-500" />
                )}
              </button>
            );
          }

          const active = value === d.key;

          return (
            <button
              key={d.key}
              type="button"
              onClick={() => onChange(d.key)}
              className={[
                "flex items-center gap-3 rounded border px-3 py-2 text-left transition",
                active
                  ? "border-blue-500 bg-blue-50"
                  : "border-zinc-200 hover:bg-zinc-100",
              ].join(" ")}
            >
              {d.image ? (
                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-50">
                  <Image
                    src={d.image}
                    alt={d.label}
                    fill
                    className={
                      d.mode === "contain" ? "object-contain" : "object-cover"
                    }
                    sizes="80px"
                  />
                </div>
              ) : d.bgColor ? (
                <span
                  className="h-4 w-4 shrink-0 rounded border border-zinc-300"
                  style={{ backgroundColor: d.bgColor }}
                />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded border border-zinc-300 bg-white" />
              )}

              <span>{d.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
