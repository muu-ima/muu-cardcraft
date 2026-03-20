// app/shared/selection.ts
export type SelectableKind = "block" | "image";

export type SelectedItem =
  | { kind: "block"; id: string }
  | { kind: "image"; id: string }
  | null;

export function isBlockSelected(
  selected: SelectedItem,
): selected is { kind: "block"; id: string } {
  return selected?.kind === "block";
}

export function isImageSelected(
  selected: SelectedItem,
): selected is { kind: "image"; id: string } {
  return selected?.kind === "image";
}

export function isSelectedItem(
  selected: SelectedItem,
  kind: SelectableKind,
  id: string,
) {
  return selected?.kind === kind && selected.id === id;
}
