// shared/editorBlocks.ts
import type { FontKey as FontKeyFromFonts } from "./fonts";

export type FontKey = FontKeyFromFonts;
export type Align = "left" | "center" | "right";

export type BaseBlock = {
  id: string;
  type: "text" | "image"; // 将来増える前提（いま image なくてもOK）
};

export type TextBlock = BaseBlock & {
  type: "text";
  text: string;

  // useCardBlocks が持ってるキーに合わせる
  fontKey: FontKey;
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  align?: Align;
};

export type ImageBlock = BaseBlock & {
  type: "image";
  // いま無いなら最低限で置くだけでもOK（後で拡張）
  src: string;
  width: number;
  height: number;
};

export type EditorBlock = TextBlock | ImageBlock;
