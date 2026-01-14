//app/components/ediotr/ToolbarPrimitives.tsx
"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

export function Divider() {
  return <div className="mx-1 h-6 w-px bg-black/10" />;
}

type GhostButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
  ariaLabel?: string;
};

export function GhostButton({
  children,
  onClick,
  pressed,
  disabled,
  className,
  title,
  ariaLabel,
}: GhostButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={ariaLabel}
      aria-pressed={!!pressed}
      disabled={disabled}
      onClick={() => !disabled && onClick()}
      className={[
        "inline-flex h-8 items-center gap-1 rounded-full px-2 text-sm  font-medium leading-none",
        "select-none",
        "hover:bg-black/5 active:bg-black/10",
        pressed ? "bg-pink-50 ring-1 ring-inset ring-pink-200" : "",
        disabled ? "opacity-60 cursor-not-allowed" : "",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// 汎用セグメント（表面/裏面だけじゃなく再利用できる形）
type SegmentedProps<T extends string> = {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
};

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  disabled,
}: SegmentedProps<T>) {
 return (
   <div className="inline-flex h-8 items-center rounded-full bg-white border px-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => !disabled && onChange(opt.value)}
            className={[
              "inline-flex h-5 items-center rounded-full px-2 text-sm font-medium leading-none",
              active
                ? "bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-200"
                : "text-zinc-700 hover:bg-zinc-50",
              disabled ? "cursor-not-allowed opacity-70" : "",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// (…) 用の MoreMenu
type MoreMenuProps = {
  children: React.ReactNode;
};

export function MoreMenu({ children }: MoreMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-full 
        px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-900/5"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 rounded-2xl bg-white shadow-lg
          border border-zinc-200 z-50
          px-2 py-2 text-xs text-zinc-700
          flex flex-col gap-1"
        >
          {children}
        </div>
      )}
    </div>
  );
}