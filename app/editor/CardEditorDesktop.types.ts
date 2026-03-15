// app/editor/CardEditorDesktop.types.ts
import type { CenterToolbarValue } from "@/app/components/editor/CenterToolbar";
import type {
  RefObject,
  MutableRefObject,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { TabKey } from "@/shared/editor";
import type { DesignKey } from "@/shared/design";
import type { Block } from "@/shared/blocks";
import type { FontKey, FontSizeDelta } from "@/shared/fonts";
import type { SnapGuide } from "@/hooks/card/useSnap";
import type { UploadImageAsset } from "@/hooks/card/useUploadImage";
import type { CardImage } from "@/shared/images";
import type {
  EditorStateForLayout,
  EditorActionsForLayout,
  Side,
} from "./CardEditor.types";

export type CardEditorDesktopProps = {
  // 画像アップロード
  code: string;
  // ---- 状態 & アクション
  state: EditorStateForLayout;
  actions: EditorActionsForLayout;
  openTab: (tab: TabKey) => void;

  // ---- レイアウト / スケール
  canvasAreaRef: RefObject<HTMLDivElement | null>;
  centerWrapRef: RefObject<HTMLDivElement | null>;
  scaleWrapRefDesktop: RefObject<HTMLDivElement | null>;
  scaleDesktop: number;

  // ---- blocks / デザイン
  getBlocksFor: (side: Side) => Block[];
  getImagesFor: (side: "front" | "back") => CardImage[];
  editableBlocks: Block[];
  addBlock: () => void;
  onChangeText: (id: string, value: string) => void;
  onCommitText: (id: string, value: string) => void;
  updateFont: (id: string, fontKey: FontKey) => void;
  bumpFontSize: (id: string, delta: FontSizeDelta) => void;
  design: DesignKey;
  setDesign: (d: DesignKey) => void;
  setTextColor: (id: string, color: string) => void;
  previewTextColor: (id: string, color: string) => void;
  onUploadedImage: (asset: UploadImageAsset) => void;
  moveImage: (id: string, x: number, y: number) => void;
  resizeImage: (id: string, w: number, h: number) => void;
  currentImageCount: number;
  maxImageCount: number;
  onDeleteImage: (id: string) => void;
  selectedImageId: string | null;
  onSelectImage: (id: string | null) => void;
  onBringSelectedImageToFront: () => void;
  onSendSelectedImageToBack: () => void;

  // ---- export
  exportRef: RefObject<HTMLDivElement | null>;
  downloadImage: (format: "png" | "jpeg", target: HTMLDivElement) => void;

  // ---- ハンドラ / ツールバー
  onAnyPointerDownCapture: (e: ReactPointerEvent) => void;
  centerToolbarValue: CenterToolbarValue | null;
  centerVisible: boolean;
  handleBlockPointerDown: (
    e: ReactPointerEvent<Element>,
    blockId: string,
    opts: { scale: number },
  ) => void;
  onChangeWidth?: (id: string, width: number) => void;

  // ---- インライン編集
  startEditing: (id: string, text: string) => void;
  editingBlockId: string | null;
  editingText: string;
  setEditingText: (value: string) => void;
  stopEditing: () => void;

  // ---- canvas / refs / guides
  snapGuide: SnapGuide | null;
  cardRef: RefObject<HTMLDivElement | null>;
  blockRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;

  // ---- Undo / Redo
  undo: () => void;
  redo: () => void;
};
