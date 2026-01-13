// app/fonts.ts
import {
  Noto_Sans_JP,
  Noto_Serif_JP,
  Zen_Maru_Gothic,
  Parisienne,
  Dancing_Script,
  Lemon,
  Chicle,
  Potta_One,
} from "next/font/google";

export const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],          // ← ここを "japanese" → "latin"
  weight: ["400"],             // 必要なら ["400", "500", "700"] とかにしてOK
  variable: "--font-noto-sans-jp",
});

export const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-zen-maru-gothic",
});

export const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-noto-serif-jp",
});

export const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400",               // このフォントは1ウェイトだけでOK
  variable: "--font-parisienne",
});

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400"],             // 必要なら ["400", "500", "600", "700"] に増やせる
  variable: "--font-dancing-script",
});

export const lemon = Lemon({
  subsets: ["latin"],
  weight: ["400"],             // 必要なら ["400", "500", "600", "700"] に増やせる
  variable: "--font-lemon",
});

export const chicle = Chicle({
  subsets: ["latin"],
  weight: ["400"],             // 必要なら ["400", "500", "600", "700"] に増やせる
  variable: "--font-chicle",
});

export const potta_one = Potta_One({
  subsets: ["latin"],
  weight: ["400"],             // 必要なら ["400", "500", "600", "700"] に増やせる
  variable: "--font-potta_one",
});