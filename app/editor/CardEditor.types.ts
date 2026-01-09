// app/editor/CardEditor.types.ts
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

// CenterToolbar 内で宣言している align と同じにしておく
export type Align = "left" | "center" | "right";

export type Side = "front" | "back";

export type EditorStateForLayout = {
  activeTab: TabKey | null;
  isPreview: boolean;
  side: Side;
  showGuides: boolean;
  activeBlockId: string;
};

export type EditorActionsForLayout = {
  setActiveTab: (tab: TabKey | null) => void;
  setIsPreview: (v: boolean) => void;
  setSide: (side: Side) => void;
  togglePreview: () => void;
  onChangeFontSize: (delta: number) => void;
  onToggleBold: () => void;
  onChangeAlign: (align: Align) => void;
  setShowGuides: (updater: (v: boolean) => boolean) => void;
};

export type SheetSnap = "collapsed" | "half" | "full";

export type CardEditorMobileProps = {
  // ---- 状態 & アクション
  state: EditorStateForLayout;
  actions: EditorActionsForLayout;

  // ---- シート
  sheetTitle: string;
  sheetSnap: SheetSnap;
  setSheetSnap: (snap: SheetSnap) => void;
  closeSheet: () => void;
  openTab: (tab: TabKey) => void;

  // ---- レイアウト / スケール
  canvasAreaRef: RefObject<HTMLDivElement | null>;
  centerWrapRef: RefObject<HTMLDivElement | null>;
  scaleWrapRefMobile: RefObject<HTMLDivElement | null>;
  scaleMobile: number;

  // ---- blocks / デザイン
  getBlocksFor: (side: Side) => Block[];
  editableBlocks: Block[];
  addBlock: () => void;
  addBrailleBlock: () => void;
  onChangeText: (id: string, value: string) => void;
  onCommitText: (id: string, value: string) => void;
  updateFont: (id: string, fontKey: FontKey) => void;
  bumpFontSize: (id: string, delta: FontSizeDelta) => void;
  design: DesignKey;
  setDesign: (d: DesignKey) => void;

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
    opts: { scale: number }
  ) => void;

  // ---- インライン編集
  startEditing: (id: string, text: string) => void;
  editingBlockId: string | null;
  editingText: string;
  setEditingText: (value: string) => void;
  stopEditing: () => void;
  cardRef: RefObject<HTMLDivElement | null>;
  blockRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;

  // ---- Undo / Redo
  undo: () => void;
  redo: () => void;
};

export type CardEditorDesktopProps = {
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
  editableBlocks: Block[];
  addBlock: () => void;
  addBrailleBlock: () => void;
  onChangeText: (id: string, value: string) => void;
  onCommitText: (id: string, value: string) => void;
  updateFont: (id: string, fontKey: FontKey) => void;
  bumpFontSize: (id: string, delta: FontSizeDelta) => void;
  design: DesignKey;
  setDesign: (d: DesignKey) => void;

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
    opts: { scale: number }
  ) => void;
  onChangeWidth?: (id: string, width: number) => void;

  // ---- インライン編集
  startEditing: (id: string, text: string) => void;
  editingBlockId: string | null;
  editingText: string;
  setEditingText: (value: string) => void;
  stopEditing: () => void;
  cardRef: RefObject<HTMLDivElement | null>;
  blockRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;

  // ---- Undo / Redo
  undo: () => void;
  redo: () => void;
};
