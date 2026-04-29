import type { CartItem } from "./cart";

export type Order = {
  id: string;
  createdAt: number;
  items: CartItem[];
  total: number;
  method: "card" | "phonepe" | "cod";
  customer: { name: string; email: string; address: string; city: string; pincode: string };
  status: "Placed" | "Shipped" | "Delivered";
};

const KEY = "shopperz_orders";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  if (typeof window === "undefined") return;
  const all = getOrders();
  all.unshift(order);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function newOrderId() {
  return "SHP" + Math.floor(100000 + Math.random() * 900000);
}