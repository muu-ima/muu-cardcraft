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
      radial-gradient(circle at 50% 42%, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0) 36%),
      linear-gradient(180deg, #f9e8ef 0%, #f7f0f6 50%, #edf4ff 100%)
    `,
        }}
      >
        {" "}
        {/* 共通ヘッダー */}
        <header
          className="w-full border-b border-black/5"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
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
