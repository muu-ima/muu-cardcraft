"use client";

import { useMemo, useRef, useState } from "react";
import type { Align, EditorBlock, TextBlock } from "@/shared/editorBlocks";
import type { TabKey } from "@/shared/editor";
import type { DesignKey } from "@/shared/design";
import { CARD_FULL_DESIGNS } from "@/shared/cardDesigns";
import type { FontSizeDelta } from "@/shared/fonts"; // ★ 追加
import type { SelectedItem } from "@/shared/selection";

type Side = "front" | "back";
type EditingState = { id: string; initialText: string } | null;

export function useCardEditorState(args: {
  editableBlocks: EditorBlock[];
  design: DesignKey;
  setDesign: (v: DesignKey) => void;

  cardRef: React.RefObject<HTMLElement | null>;
  blockRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;

  previewText: (id: string, value: string) => void;
  commitText: (id: string, value: string) => void;

  updateTextStyle: (id: string, patch: Partial<TextBlock>) => void;

  // 🔽 ここを number → FontSizeDelta に変更
  bumpFontSize: (id: string, delta: FontSizeDelta) => void;

  dragPointerDown: (
    e: React.PointerEvent<Element>,
    id: string,
    opts: { scale: number },
  ) => void;

  activeBlockId: string;
  setActiveBlockId: (id: string) => void;
  selectedItem: SelectedItem;
}) {
  const {
    editableBlocks,
    design,
    cardRef,
    blockRefs,
    previewText,
    commitText,
    updateTextStyle,
    bumpFontSize,
    dragPointerDown,
    activeBlockId,
    setActiveBlockId,
    selectedItem,
  } = args;

  // --- UI state ---
  const [side, setSide] = useState<Side>("front");
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const DISABLED_TABS_ON_BACK: TabKey[] = [
    "text",
    "font",
    "design",
    "image",
    "layers",
  ];

  const isBlockedTabOnBack = (tab: TabKey | null) => {
    if (tab == null) return false;
    return side === "back" && DISABLED_TABS_ON_BACK.includes(tab);
  };

  // --- selection/editing ---
  const [editing, setEditing] = useState<EditingState>(null);

  // --- refs ---
  const exportRef = useRef<HTMLDivElement | null>(null);
  const centerWrapRef = useRef<HTMLDivElement | null>(null);

  // --- selectors ---
  const getBlocksFor = (s: Side): EditorBlock[] =>
    s === "front"
      ? editableBlocks
      : (CARD_FULL_DESIGNS[design].back.blocks as EditorBlock[]);

  const currentBlocks = getBlocksFor(side);

  const findTextBlock = (id: string): TextBlock | undefined =>
    currentBlocks.find((b): b is TextBlock => b.id === id && b.type === "text");

  const active = useMemo(
    () =>
      editableBlocks.find(
        (b): b is TextBlock => b.id === activeBlockId && b.type === "text",
      ),
    [editableBlocks, activeBlockId],
  );

  const centerVisible = !isPreview;

  const centerToolbarValue = active
    ? {
        fontKey: active.fontKey,
        fontSize: active.fontSize ?? 16,
        bold: active.fontWeight === "bold",
        align: (active.align ?? "left") as Align,
      }
    : null;

  // --- actions ---
  const onChangeTab = (tab: TabKey) => {
    if (
      side === "back" &&
      ["text", "font", "design", "image", "layers"].includes(tab)
    ) {
      return;
    }

    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  const resetEditingState = (mode: "commit" | "cancel" = "commit") => {
    if (editing) {
      const b = findTextBlock(editing.id);
      if (b) {
        if (mode === "commit") commitText(editing.id, b.text);
        if (mode === "cancel") previewText(editing.id, editing.initialText);
      }
    }
    setEditing(null);
    setActiveBlockId("");
    setActiveTab(null);
  };

  const togglePreview = () => {
    setIsPreview((v) => {
      const next = !v;
      if (next) resetEditingState("commit");
      return next;
    });
  };

  const onAnyPointerDownCapture = (e: React.PointerEvent) => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const target = e.target as Node;

    // toolbar上は無視
    if (centerWrapRef.current?.contains(target)) return;

    // カード外クリック
    if (!cardEl.contains(target)) {
      if (editing) {
        const b = findTextBlock(editing.id);
        if (b) commitText(editing.id, b.text);
        setEditing(null);
        return;
      }

      setActiveBlockId("");
      setActiveTab(null);
    }
  };

  const handleBlockPointerDown = (
    e: React.PointerEvent<Element>,
    blockId: string,
    opts: { scale: number },
  ) => {
    if (editing) {
      e.preventDefault();
      e.stopPropagation();

      const cur = findTextBlock(editing.id);
      if (cur) commitText(editing.id, cur.text);

      setActiveBlockId(blockId);

      const next = findTextBlock(blockId);
      if (next) setEditing({ id: blockId, initialText: next.text });
      else setEditing(null);

      return;
    }

    setActiveBlockId(blockId);
    dragPointerDown(e, blockId, opts);
  };

  const onChangeText = (id: string, value: string) => {
    if (side !== "front") return;
    previewText(id, value);
  };

  const onCommitText = (id: string, value: string) => {
    if (side !== "front") return;
    commitText(id, value);
  };

  const onChangeSide = (nextSide: Side) => {
    setSide(nextSide);

    if (
      nextSide === "back" &&
      activeTab &&
      ["text", "font", "design", "image", "layers"].includes(activeTab)
    ) {
      setActiveTab(null);
    }
  };

  return {
    state: {
      side,
      activeTab,
      isPreview,
      showGuides,
      activeBlockId,
      editing,
    },
    actions: {
      setSide: onChangeSide,
      setActiveTab,
      setIsPreview,
      setShowGuides,
      setActiveBlockId,
      setEditing,

      onChangeTab,
      resetEditingState,
      togglePreview,
      onAnyPointerDownCapture,
      handleBlockPointerDown,
      onChangeText,
      onCommitText,

      onToggleBold: () => {
        if (!active) return;
        updateTextStyle(activeBlockId, {
          fontWeight: active.fontWeight === "bold" ? "normal" : "bold",
        });
      },

      // 🔽 ここを FontSizeDelta 前提で変換する
      onChangeFontSize: (next: number) => {
        if (!centerToolbarValue) return;
        if (!Number.isFinite(next)) {
          console.log("[onChangeFontSize] invalid next", { next });
          return;
        }

        const current = centerToolbarValue.fontSize;
        const diff = next - current;
        if (diff === 0) return;

        const delta: FontSizeDelta = diff > 0 ? 1 : -1;

        bumpFontSize(activeBlockId, delta);
      },

      onChangeAlign: (align: Align) => {
        updateTextStyle(activeBlockId, { align });
      },
    },
    refs: {
      exportRef,
      centerWrapRef,
      blockRefs,
    },
    selectors: {
      getBlocksFor,
      currentBlocks,
      active,
      centerVisible,
      centerToolbarValue,
    },
  };
}
