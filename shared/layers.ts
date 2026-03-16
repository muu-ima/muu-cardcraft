// shared/layers.ts

export type LayerItem = {
  id: string;
  z: number;
};

export function normalizeLayers<T extends LayerItem>(items: T[]): T[] {
  return [...items]
    .sort((a, b) => (a.z ?? 0) - (b.z ?? 0))
    .map((item, index) => ({
      ...item,
      z: index + 1,
    }));
}

// 配列の現在順をそのまま z=1,2,3... に振り直す
function reindexLayers<T extends LayerItem>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    z: index + 1,
  }));
}

export function moveToFront<T extends LayerItem>(
  items: T[],
  targetId: string,
): T[] {
  const normalized = normalizeLayers(items);
  const target = normalized.find((item) => item.id === targetId);
  if (!target) return normalized;

  const withoutTarget = normalized.filter((item) => item.id !== targetId);
  return reindexLayers([...withoutTarget, target]);
}

export function moveToBack<T extends LayerItem>(
  items: T[],
  targetId: string,
): T[] {
  const normalized = normalizeLayers(items);
  const target = normalized.find((item) => item.id === targetId);
  if (!target) return normalized;

  const withoutTarget = normalized.filter((item) => item.id !== targetId);
  return reindexLayers([target, ...withoutTarget]);
}

export function moveForwardOne<T extends LayerItem>(
  items: T[],
  targetId: string,
): T[] {
  const normalized = normalizeLayers(items);
  const index = normalized.findIndex((item) => item.id === targetId);
  if (index === -1 || index === normalized.length - 1) return normalized;

  const next = [...normalized];
  [next[index], next[index + 1]] = [next[index + 1], next[index]];

  return reindexLayers(next);
}

export function moveBackwardOne<T extends LayerItem>(
  items: T[],
  targetId: string,
): T[] {
  const normalized = normalizeLayers(items);
  const index = normalized.findIndex((item) => item.id === targetId);
  if (index <= 0) return normalized;

  const next = [...normalized];
  [next[index - 1], next[index]] = [next[index], next[index - 1]];

  return reindexLayers(next);
}
