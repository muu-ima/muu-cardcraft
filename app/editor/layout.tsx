import type { ReactNode } from "react";
import Link from "next/link";
import {
  notoSansJp,
  zenMaruGothic,
  notoSerifJp,
  parisienne,
  dancingScript,
  lemon,
  chicle,
  potta_one,
} from "@/app/fonts";

export default function EditorLayout({ children }: { children: ReactNode }) {
  // フォント用クラスをまとめておく
  const fontClasses = [
    notoSansJp.variable,
    zenMaruGothic.variable,
    notoSerifJp.variable,
    parisienne.variable,
    dancingScript.variable,
    lemon.variable,
    chicle.variable,
    potta_one.variable,
  ].join(" ");

  return (
    <div
      className={`${fontClasses}
        fixed inset-0 overflow-hidden
        flex flex-col`}
      style={{
        background:
          "radial-gradient(circle at top, #eef5fb 0%, #f7f3f8 40%, #ffffff 75%)",
      }}
    >
      <header
        className="
          h-14 shrink-0
          border-b border-black/5
          bg-white/70 backdrop-blur
        "
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold">
              <span className="text-pink-500">Cocco</span> CardCraft
            </Link>
            <span className="text-xs text-zinc-500">Editor</span>
          </div>

          <nav className="flex items-center gap-4 text-sm text-zinc-700">
            <Link href="/editor" className="hover:underline">
              エディタ
            </Link>
            <Link href="/snapshots" className="hover:underline">
              スナップショット一覧（予定）
            </Link>
          </nav>
        </div>
      </header>

      {/* ここが “残り全部” */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
