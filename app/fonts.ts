// app/fonts.ts
import {
  Noto_Sans_JP,
  Noto_Serif_JP,
  Zen_Maru_Gothic,
  Zen_Kaku_Gothic_New,
  M_PLUS_1p,
  Shippori_Mincho,
  Kosugi_Maru,
  Yusei_Magic,
  Parisienne,
  Dancing_Script,
  Lemon,
  Chicle,
  Potta_One,
} from "next/font/google";

export const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"], // ← ここを "japanese" → "latin"
  weight: ["400"], // 必要なら ["400", "500", "700"] とかにしてOK
  variable: "--font-noto-sans-jp",
});

export const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-zen-maru-gothic",
});
export const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-zen-kaku-gothic-new",
});

export const mPlus1p = M_PLUS_1p({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-m-plus-1p",
});

export const shipporiMincho = Shippori_Mincho({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-shippori-mincho",
});

export const kosugiMaru = Kosugi_Maru({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-kosugi-maru",
});

export const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-noto-serif-jp",
});

export const parisienne = Parisienne({
  subsets: ["latin"],
  weight: "400", // このフォントは1ウェイトだけでOK
  variable: "--font-parisienne",
});

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400"], // 必要なら ["400", "500", "600", "700"] に増やせる
  variable: "--font-dancing-script",
});

export const lemon = Lemon({
  subsets: ["latin"],
  weight: ["400"], // 必要なら ["400", "500", "600", "700"] に増やせる
  variable: "--font-lemon",
});

export const chicle = Chicle({
  subsets: ["latin"],
  weight: ["400"], // 必要なら ["400", "500", "600", "700"] に増やせる
  variable: "--font-chicle",
});

export const potta_one = Potta_One({
  subsets: ["latin"],
  weight: ["400"], // 必要なら ["400", "500", "600", "700"] に増やせる
  variable: "--font-potta_one",
});

export const yuseiMagic = Yusei_Magic({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-yusei-magic",
});
