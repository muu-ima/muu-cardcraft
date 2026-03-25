// shared/editorDraftStorage.ts
import type { Block } from "@/shared/blocks";
import type { DesignKey } from "@/shared/design";
import type { CardImage, Side } from "@/shared/images";

export type StoredEditorDraft = {
  version: 1;
  code: string;
  updatedAt: number;
  activeSide: Side;
  design: DesignKey;
  blocks: Block[];
  images: CardImage[];
  showGuides: boolean;
};

export function getEditorDraftKey(code: string) {
  return `cardcraft:draft:${code}`;
}

export function saveEditorDraft(draft: StoredEditorDraft) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(getEditorDraftKey(draft.code), JSON.stringify(draft));
  } catch (error) {
    console.error("[editorDraftStorage] save failed", error);
  }
}

export function loadEditorDraft(code: string): StoredEditorDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(getEditorDraftKey(code));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredEditorDraft;

    if (parsed?.version !== 1) return null;
    if (!parsed?.code) return null;

    return parsed;
  } catch (error) {
    console.error("[editorDraftStorage] load failed", error);
    return null;
  }
}

export function clearEditorDraft(code: string) {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(getEditorDraftKey(code));
  } catch (error) {
    console.error("[editorDraftStorage] clear failed", error);
  }
}
