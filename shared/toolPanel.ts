// @/shared/toolPanel.ts
import type { Block } from "@/shared/blocks";
import type { TabKey } from "@/shared/editor";
import type { DesignKey } from "@/shared/design";
import type { FontKey, FontSizeDelta } from "@/shared/fonts";
import type { CardImage } from "@/shared/images";
import type { UploadImageAsset } from "@/hooks/card/useUploadImage";

export type Side = "front" | "back";

export type ToolPanelBaseProps = {
  open: boolean;
  onClose: () => void;
  activeTab: TabKey | null;
  variant?: "desktop" | "sheet";
};

export type TextPanelSectionProps = {
  side: Side;
  onChangeSide: (side: Side) => void;
  blocks: Block[];
  activeBlockId: string;
  onAddBlock: () => void;
  isPreview: boolean;
  onChangeText: (id: string, value: string) => void;
  onCommitText: (id: string, value: string) => void;
  onBumpFontSize?: (id: string, delta: FontSizeDelta) => void;
  onChangeWidth?: (id: string, width: number) => void;
  onDeleteBlock?: (id: string) => void;
};

export type FontPanelSectionProps = {
  blocks: Block[];
  activeBlockId: string;
  onChangeFont: (id: string, fontKey: FontKey) => void;
  onChangeColor: (id: string, color: string) => void;
  onPreviewColor: (id: string, color: string) => void;
};

export type ImagePanelSectionProps = {
  code: string;
  onUploadedImage: (asset: UploadImageAsset) => void;
  images: CardImage[];
  currentImageCount: number;
  maxImageCount: number;
  onDeleteImage: (id: string) => void;
  selectedImageId: string | null;
  onBringSelectedImageToFront: () => void;
  onSendSelectedImageToBack: () => void;
};

export type MixedLayer = {
  kind: "block" | "image";
  id: string;
  z: number;
};

export type LayerPanelSectionProps = {
  mixedLayers: MixedLayer[];
  blocks: Block[];
  images: CardImage[];
  activeBlockId: string;
  selectedImageId: string | null;
  onSelectBlock: (id: string) => void;
  onSelectImage: (id: string | null) => void;
};

export type DesignPanelSectionProps = {
  design: DesignKey;
  onChangeDesign: (design: DesignKey) => void;
};

export type ExportPanelSectionProps = {
  onDownload: (format: "png" | "jpeg") => void;
};

export type ToolPanelProps = ToolPanelBaseProps & {
  textPanel: TextPanelSectionProps;
  fontPanel: FontPanelSectionProps;
  imagePanel: ImagePanelSectionProps;
  layerPanel: LayerPanelSectionProps;
  designPanel: DesignPanelSectionProps;
  exportPanel: ExportPanelSectionProps;
};
