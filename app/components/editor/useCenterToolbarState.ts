"use client";

import { useMemo } from "react";
import { useIsNarrowScreen } from "@/hooks/useIsNarrowScreen";
import type { TabKey } from "@/shared/editor";
import type { CenterToolbarValue } from "./CenterToolbar";
import type { SelectedItem } from "@/shared/selection";

type SelectionType = "none" | "text" | "image";

type Args = {
  value: CenterToolbarValue | null;
  selectedItem: SelectedItem;
  activeTab: TabKey | null;
  side: "front" | "back";
  sidePanelOpen: boolean;
  disabled?: boolean;
};

export function useCenterToolbarState({
  value,
  selectedItem,
  activeTab,
  side,
  sidePanelOpen,
  disabled = false,
}: Args) {
  const isNarrow = useIsNarrowScreen(1280);

  const selectionType: SelectionType = useMemo(() => {
    if (selectedItem?.kind === "image") return "image";
    if (selectedItem?.kind === "block") return "text";
    return "none";
  }, [selectedItem, value]);

  const showDefaultTools = selectionType === "none";
  const isFontOpen = activeTab === "font";
  const isTextOpen = activeTab === "text";
  const compact = sidePanelOpen && isNarrow;

  const showCommonTools = true;
  const showTextTools = selectionType === "text" && side === "front";
  const showImageTools = selectionType === "image";

  const textControlsDisabled = disabled || side !== "front";
  const imageControlsDisabled = disabled;
  const commonControlsDisabled = false;

  return {
    selectionType,
    isFontOpen,
    isTextOpen,
    compact,

    showDefaultTools,
    showCommonTools,
    showTextTools,
    showImageTools,
    textControlsDisabled,
    imageControlsDisabled,
    commonControlsDisabled,
  };
}
