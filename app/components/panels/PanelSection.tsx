// app/components/panels/PanelSection.tsx
"use client";

export default function PanelSection({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border border-white/30 bg-white/12 backdrop-blur-sm p-4
    shadow-[0_1px_0_rgba(0,0,0,0.03),0_8px_18px_rgba(0,0,0,0.03)]"
    >
      <div className="mb-3">
        <p className="text-sm font-medium text-zinc-900">{title}</p>
        {desc && <p className="mt-1 text-xs text-zinc-500">{desc}</p>}
      </div>
      {children}
    </section>
  );
}
