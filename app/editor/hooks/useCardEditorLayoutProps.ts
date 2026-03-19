"use client";

import type {
  EditorStateForLayout,
  EditorActionsForLayout,
  Side,
} from "../CardEditor.types";
import type { CardEditorDesktopProps } from "../CardEditorDesktop.types";
import type { CardEditorMobileProps } from "../CardEditorMobile.types";
import type { TabKey } from "@/shared/editor";
import type { DesignKey } from "@/shared/design";
import type { MixedLayerItem } from "@/shared/layers";

type UseCardEditorLayoutPropsParams = {
  code: string;

  state: {
    activeTab: TabKey | null;
    isPreview: boolean;
    side: Side;
    showGuides: boolean;
    activeBlockId: string;
  };

  actions: {
    setActiveTab: EditorActionsForLayout["setActiveTab"];
    setIsPreview: EditorActionsForLayout["setIsPreview"];
    setSide: EditorActionsForLayout["setSide"];
    togglePreview: EditorActionsForLayout["togglePreview"];
    onChangeFontSize: EditorActionsForLayout["onChangeFontSize"];
    onToggleBold: EditorActionsForLayout["onToggleBold"];
    onChangeAlign: EditorActionsForLayout["onChangeAlign"];
    setShowGuides: EditorActionsForLayout["setShowGuides"];
  };

  openTab: CardEditorDesktopProps["openTab"];
  closeSheet: CardEditorMobileProps["closeSheet"];

  sheetTitle: CardEditorMobileProps["sheetTitle"];
  sheetSnap: CardEditorMobileProps["sheetSnap"];
  setSheetSnap: CardEditorMobileProps["setSheetSnap"];

  canvasAreaRef: CardEditorDesktopProps["canvasAreaRef"];
  centerWrapRef: CardEditorDesktopProps["centerWrapRef"];
  scaleWrapRefDesktop: CardEditorDesktopProps["scaleWrapRefDesktop"];
  scaleWrapRefMobile: CardEditorMobileProps["scaleWrapRefMobile"];
  scaleDesktop: CardEditorDesktopProps["scaleDesktop"];
  scaleMobile: CardEditorMobileProps["scaleMobile"];

  getBlocksFor: CardEditorDesktopProps["getBlocksFor"];
  getImagesFor: CardEditorDesktopProps["getImagesFor"];
  moveImage: CardEditorDesktopProps["moveImage"];
  resizeImage: CardEditorDesktopProps["resizeImage"];

  editableBlocks: CardEditorDesktopProps["editableBlocks"];
  addBlock: CardEditorDesktopProps["addBlock"];
  onChangeText: CardEditorDesktopProps["onChangeText"];
  onCommitText: CardEditorDesktopProps["onCommitText"];
  updateFont: CardEditorDesktopProps["updateFont"];
  bumpFontSize: CardEditorDesktopProps["bumpFontSize"];
  design: DesignKey;
  setDesign: CardEditorDesktopProps["setDesign"];
  onChangeWidth: CardEditorDesktopProps["onChangeWidth"];
  setTextColor: CardEditorDesktopProps["setTextColor"];
  previewTextColor: CardEditorDesktopProps["previewTextColor"];
  onUploadedImage: CardEditorDesktopProps["onUploadedImage"];

  currentImageCount: CardEditorDesktopProps["currentImageCount"];
  maxImageCount: CardEditorDesktopProps["maxImageCount"];
  onDeleteImage: CardEditorDesktopProps["onDeleteImage"];

  exportRef: CardEditorDesktopProps["exportRef"];
  downloadImage: CardEditorDesktopProps["downloadImage"];

  onAnyPointerDownCapture: CardEditorDesktopProps["onAnyPointerDownCapture"];
  centerToolbarValue: CardEditorDesktopProps["centerToolbarValue"];
  centerVisible: CardEditorDesktopProps["centerVisible"];
  handleBlockPointerDown: CardEditorDesktopProps["handleBlockPointerDown"];

  startEditing: CardEditorDesktopProps["startEditing"];
  editingBlockId: CardEditorDesktopProps["editingBlockId"];
  editingText: CardEditorDesktopProps["editingText"];
  setEditingText: CardEditorDesktopProps["setEditingText"];
  stopEditing: CardEditorDesktopProps["stopEditing"];
  snapGuide: CardEditorDesktopProps["snapGuide"];
  cardRef: CardEditorDesktopProps["cardRef"];
  blockRefs: CardEditorDesktopProps["blockRefs"];

  undo: CardEditorDesktopProps["undo"];
  redo: CardEditorDesktopProps["redo"];

  removeBlock: EditorActionsForLayout["removeBlock"];
  selectedImageId: string | null;
  setSelectedImageId: (id: string | null) => void;
  onBringSelectedImageToFront: () => void;
  onSendSelectedImageToBack: () => void;

  setActiveBlockId: (id: string) => void;

  onMoveLayerFront: (layer: MixedLayerItem) => void;
  onMoveLayerBack: (layer: MixedLayerItem) => void;
  onMoveLayerForward: (layer: MixedLayerItem) => void;
  onMoveLayerBackward: (layer: MixedLayerItem) => void;
  onDeleteLayer: (layer: MixedLayerItem) => void;
  mixedLayers: MixedLayerItem[];
};

export function useCardEditorLayoutProps({
  code,
  state,
  actions,
  openTab,
  closeSheet,
  sheetTitle,
  sheetSnap,
  setSheetSnap,
  canvasAreaRef,
  centerWrapRef,
  scaleWrapRefDesktop,
  scaleWrapRefMobile,
  scaleDesktop,
  scaleMobile,
  getBlocksFor,
  getImagesFor,
  mixedLayers,
  moveImage,
  resizeImage,
  editableBlocks,
  addBlock,
  onChangeText,
  onCommitText,
  updateFont,
  bumpFontSize,
  design,
  setDesign,
  onChangeWidth,
  setTextColor,
  previewTextColor,
  onUploadedImage,
  currentImageCount,
  maxImageCount,
  onDeleteImage,
  exportRef,
  downloadImage,
  onAnyPointerDownCapture,
  centerToolbarValue,
  centerVisible,
  handleBlockPointerDown,
  startEditing,
  editingBlockId,
  editingText,
  setEditingText,
  stopEditing,
  snapGuide,
  cardRef,
  blockRefs,
  undo,
  redo,
  removeBlock,
  selectedImageId,
  setSelectedImageId,
  onBringSelectedImageToFront,
  onSendSelectedImageToBack,
  setActiveBlockId,
  onMoveLayerFront,
  onMoveLayerBack,
  onMoveLayerForward,
  onMoveLayerBackward,
  onDeleteLayer,
}: UseCardEditorLayoutPropsParams) {
  const layoutState: EditorStateForLayout = {
    activeTab: state.activeTab,
    isPreview: state.isPreview,
    side: state.side,
    showGuides: state.showGuides,
    activeBlockId: state.activeBlockId,
  };

  const layoutActions: EditorActionsForLayout = {
    setActiveTab: actions.setActiveTab,
    setIsPreview: actions.setIsPreview,
    setSide: actions.setSide,
    togglePreview: actions.togglePreview,
    onChangeFontSize: actions.onChangeFontSize,
    onToggleBold: actions.onToggleBold,
    onChangeAlign: actions.onChangeAlign,
    setShowGuides: actions.setShowGuides,
    removeBlock,
  };

  const desktopProps: CardEditorDesktopProps = {
    code,
    state: layoutState,
    actions: layoutActions,
    openTab,
    canvasAreaRef,
    centerWrapRef,
    scaleWrapRefDesktop,
    scaleDesktop,
    getBlocksFor,
    getImagesFor,
    moveImage,
    resizeImage,
    editableBlocks,
    addBlock,
    onChangeText,
    onCommitText,
    updateFont,
    bumpFontSize,
    design,
    setDesign,
    exportRef,
    downloadImage,
    currentImageCount,
    maxImageCount,
    onDeleteImage,
    onUploadedImage,
    onAnyPointerDownCapture,
    centerToolbarValue,
    centerVisible,
    handleBlockPointerDown,
    startEditing,
    editingBlockId,
    editingText,
    setEditingText,
    stopEditing,
    snapGuide,
    cardRef,
    blockRefs,
    undo,
    redo,
    onChangeWidth,
    setTextColor,
    previewTextColor,
    selectedImageId,
    onSelectImage: setSelectedImageId,
    onBringSelectedImageToFront,
    onSendSelectedImageToBack,
    mixedLayers,
    setActiveBlockId,
    onMoveLayerFront,
    onMoveLayerBack,
    onMoveLayerForward,
    onMoveLayerBackward,
    onDeleteLayer,
  };

  const mobileProps: CardEditorMobileProps = {
    code,
    state: layoutState,
    actions: layoutActions,
    sheetTitle,
    sheetSnap,
    setSheetSnap,
    closeSheet,
    openTab,
    canvasAreaRef,
    centerWrapRef,
    scaleWrapRefMobile,
    scaleMobile,
    getBlocksFor,
    getImagesFor,
    editableBlocks,
    addBlock,
    onChangeText,
    onCommitText,
    updateFont,
    bumpFontSize,
    design,
    setDesign,
    onChangeWidth,
    setTextColor,
    previewTextColor,
    onUploadedImage,
    moveImage,
    resizeImage,
    currentImageCount,
    maxImageCount,
    onDeleteImage,
    exportRef,
    downloadImage,
    onAnyPointerDownCapture,
    centerToolbarValue,
    centerVisible,
    handleBlockPointerDown,
    startEditing,
    editingBlockId,
    editingText,
    setEditingText,
    stopEditing,
    cardRef,
    blockRefs,
    snapGuide,
    undo,
    redo,
    selectedImageId,
    onSelectImage: setSelectedImageId,
    onBringSelectedImageToFront,
    onSendSelectedImageToBack,
    mixedLayers,
    setActiveBlockId,
    onMoveLayerFront,
    onMoveLayerBack,
    onMoveLayerForward,
    onMoveLayerBackward,
    onDeleteLayer,
  };

  return {
    desktopProps,
    mobileProps,
  };
}
