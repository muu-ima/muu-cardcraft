// app/editor/CardEditorMobile.types.ts
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
  SheetSnap,
  Side,
} from "./CardEditor.types";
import type { MixedLayerItem } from "@/shared/layers";
import type { SelectedItem } from "@/shared/selection";

export type CardEditorMobileProps = {
  code: string;

  state: EditorStateForLayout;
  actions: EditorActionsForLayout;

  sheetTitle: string;
  sheetSnap: SheetSnap;
  setSheetSnap: (snap: SheetSnap) => void;
  closeSheet: () => void;
  openTab: (tab: TabKey) => void;

  canvasAreaRef: RefObject<HTMLDivElement | null>;
  centerWrapRef: RefObject<HTMLDivElement | null>;
  scaleWrapRefMobile: RefObject<HTMLDivElement | null>;
  scaleMobile: number;

  getBlocksFor: (side: Side) => Block[];
  getImagesFor: (side: Side) => CardImage[];
  mixedLayers: MixedLayerItem[];
  moveImage: (id: string, x: number, y: number) => void;
  resizeImage: (id: string, w: number, h: number) => void;
  currentImageCount: number;
  maxImageCount: number;
  onDeleteImage: (id: string) => void;

  editableBlocks: Block[];
  addBlock: () => void;
  onChangeText: (id: string, value: string) => void;
  onCommitText: (id: string, value: string) => void;
  updateFont: (id: string, fontKey: FontKey) => void;
  bumpFontSize: (id: string, delta: FontSizeDelta) => void;
  design: DesignKey;
  setDesign: (d: DesignKey) => void;
  onChangeWidth?: (id: string, width: number) => void;
  setTextColor: (id: string, color: string) => void;
  previewTextColor: (id: string, color: string) => void;
  onUploadedImage: (asset: UploadImageAsset) => void;
  selectedItem: SelectedItem;
  onSelectImage: (id: string | null) => void;
  onBringSelectedImageToFront: () => void;
  onSendSelectedImageToBack: () => void;
  setActiveBlockId: (id: string) => void;

  onMoveLayerFront: (layer: MixedLayerItem) => void;
  onMoveLayerBack: (layer: MixedLayerItem) => void;
  onMoveLayerForward: (layer: MixedLayerItem) => void;
  onMoveLayerBackward: (layer: MixedLayerItem) => void;
  onDeleteLayer: (layer: MixedLayerItem) => void;
  exportRef: RefObject<HTMLDivElement | null>;
  downloadImage: (format: "png" | "jpeg", target: HTMLDivElement) => void;

  onAnyPointerDownCapture: (e: ReactPointerEvent) => void;
  centerToolbarValue: CenterToolbarValue | null;
  centerVisible: boolean;
  handleBlockPointerDown: (
    e: ReactPointerEvent<Element>,
    blockId: string,
    opts: { scale: number },
  ) => void;

  startEditing: (id: string, text: string) => void;
  editingBlockId: string | null;
  editingText: string;
  setEditingText: (value: string) => void;
  stopEditing: () => void;

  snapGuide: SnapGuide | null;
  cardRef: RefObject<HTMLDivElement | null>;
  blockRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;

  undo: () => void;
  redo: () => void;
};
