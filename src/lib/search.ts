import { create } from "zustand";

type SearchState = {
  query: string;
  setQuery: (q: string) => void;
};

// Tiny store without external deps
let _query = "";
const listeners = new Set<() => void>();

export function useSearchQuery() {
  const [, force] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    const fn = () => force();
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return {
    query: _query,
    setQuery: (q: string) => {
      _query = q;
      listeners.forEach((l) => l());
    },
  };
}

import { useEffect, useReducer } from "react";
export type { SearchState };
// Note: zustand import above is unused; harmless tree-shake.
export { create };