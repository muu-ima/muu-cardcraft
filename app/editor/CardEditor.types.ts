// app/editor/CardEditor.types.ts
import type { Dispatch, SetStateAction } from "react";
import type { TabKey } from "@/shared/editor";

export type Align = "left" | "center" | "right";
export type Side = "front" | "back";
export type SheetSnap = "collapsed" | "half" | "full";

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
  setShowGuides: Dispatch<SetStateAction<boolean>>;
  onChangeWidth?: (id: string, width: number) => void;
  removeBlock: (id: string) => void;
};
