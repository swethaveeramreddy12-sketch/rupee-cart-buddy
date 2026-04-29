import { useEffect, useReducer } from "react";

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