"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

type Options = { max?: number };

export function useHistoryState<T>(initial: T, opts: Options = {}) {
  const max = opts.max ?? 50;

  // ✅ present は普通に state
  const [present, setPresent] = useState<T>(() => clone(initial));

  // ✅ presentRef は “最新値参照” 用
  const presentRef = useRef<T>(present);
  useEffect(() => {
    presentRef.current = present;
  }, [present]);

  // ✅ 過去/未来は ref（軽い）
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);

  // ✅ past/future 変化をUIへ反映させるための version
  const [, bump] = useReducer((n) => (n + 1) % 1_000_000, 0);

  const clear = useCallback((next?: T) => {
    pastRef.current = [];
    futureRef.current = [];
    if (next !== undefined) {
      const v = clone(next);
      presentRef.current = v;
      setPresent(v);
    }
    bump();
  }, []);

  // ✅ 履歴に積まない（preview用）
  const set = useCallback((next: T | ((prev: T) => T)) => {
    const prev = presentRef.current;
    const resolved =
      typeof next === "function" ? (next as (p: T) => T)(prev) : next;

    const v = clone(resolved);
    presentRef.current = v;
    setPresent(v);
    // bump不要（present更新で再描画される）
  }, []);

  // ✅ 履歴に積む（commit）
  const commit = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = presentRef.current;
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;

      // 変化がないなら何もしない（履歴汚さない）
      // ※ deep equal じゃなくても、同じ参照なら弾ける
      if (resolved === prev) return;

      pastRef.current = [...pastRef.current, clone(prev)].slice(-max);
      futureRef.current = [];

      const v = clone(resolved);
      presentRef.current = v;
      setPresent(v);

      bump(); // ✅ canUndo/canRedo 表示のため
    },
    [max],
  );

  const undo = useCallback(() => {
    const past = pastRef.current;
    if (past.length === 0) return;

    const prev = past[past.length - 1];
    pastRef.current = past.slice(0, -1);

    futureRef.current = [clone(presentRef.current), ...futureRef.current];

    const v = clone(prev);
    presentRef.current = v;
    setPresent(v);

    bump();
  }, []);

  const redo = useCallback(() => {
    const future = futureRef.current;
    if (future.length === 0) return;

    const next = future[0];
    futureRef.current = future.slice(1);

    pastRef.current = [...pastRef.current, clone(presentRef.current)].slice(
      -max,
    );

    const v = clone(next);
    presentRef.current = v;
    setPresent(v);

    bump();
  }, [max]);

  // ✅ canUndo/canRedo を version(bump)で更新させる
  const api = useMemo(
    () => ({
      present,
      set,
      commit,
      undo,
      redo,
      clear,
      canUndo: pastRef.current.length > 0,
      canRedo: futureRef.current.length > 0,
      _debug: {
        get pastSize() {
          return pastRef.current.length;
        },
        get futureSize() {
          return futureRef.current.length;
        },
      },
    }),
    // presentが変わるだけでも更新されるけど、
    // undo/redo可否は bump のタイミングで更新されるようにしてる
    [present, set, commit, undo, redo, clear],
  );

  return api;
}

function clone<T>(v: T): T {
  if (typeof structuredClone === "function") return structuredClone(v);
  return JSON.parse(JSON.stringify(v)) as T;
}
