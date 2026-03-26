// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CardCraft - 名刺エディタ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className="min-h-screen overflow-hidden text-gray-900"
        style={{
          background: `
              radial-gradient(circle at 50% 38%, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0) 34%),
              linear-gradient(
                180deg,
                #e6f2ff 0%,
                #eaf1ff 24%,
                #edf0ff 52%,
                #eef0ff 76%,
                #e7ecfb 100%
              )
            `,
        }}
      >
        {" "}
        {/* 共通ヘッダー */}
        <header
          className="w-full border-b border-white/25"
          style={{
            background: `
              linear-gradient(
                90deg,
                rgba(103, 146, 235, 0.95) 0%,
                rgba(140, 178, 245, 0.9) 42%,
                rgba(188, 214, 255, 0.82) 100%
              )
            `,
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 24px rgba(90, 130, 220, 0.12)",
          }}
        >
          {" "}
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="font-bold">
              <span className="text-pink-500">Pastel</span> Link
            </div>
            <nav className="flex gap-4 text-sm">
              <Link href="/snapshots">スナップショット一覧（予定）</Link>
              <Link href="/editor">エディタ</Link>
            </nav>
          </div>
        </header>
        {/* コンテンツ：ここは全幅にする */}
        <main className="w-full rounded-xl shadow-sm">{children}</main>
        {/* 共通フッター */}
        <footer className="w-full  mt-8">
          <div className="max-w-5xl mx-auto px-4 py-3 text-xs text-center text-gray-500">
            © {new Date().getFullYear()} Cocco Neil. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
