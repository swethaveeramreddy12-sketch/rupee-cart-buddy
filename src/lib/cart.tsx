import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "./products";

export type CartItem = Product & { qty: number };

type CartCtx = {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (b: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add = (p: Product) =>
    setItems((cur) => {
      const ex = cur.find((i) => i.id === p.id);
      if (ex) return cur.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...cur, { ...p, qty: 1 }];
    });
  const remove = (id: string) => setItems((c) => c.filter((i) => i.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count, open, setOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}