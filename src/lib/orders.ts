import type { CartItem } from "./cart";

export const TRACK_STEPS = [
  "Placed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;
export type TrackStep = (typeof TRACK_STEPS)[number];

export type Order = {
  id: string;
  createdAt: number;
  items: CartItem[];
  total: number;
  method: "card" | "phonepe" | "cod";
  customer: { name: string; email: string; address: string; city: string; pincode: string };
  status: TrackStep;
};

/**
 * Simulate progress: each step takes ~30 seconds in this demo so the user
 * can watch the tracker advance after placing an order.
 */
const STEP_MS = 30_000;

export function currentStepIndex(order: Order): number {
  const elapsed = Date.now() - order.createdAt;
  const idx = Math.min(TRACK_STEPS.length - 1, Math.floor(elapsed / STEP_MS));
  return Math.max(0, idx);
}

export function progressPercent(order: Order): number {
  const idx = currentStepIndex(order);
  return Math.round((idx / (TRACK_STEPS.length - 1)) * 100);
}

export function etaLabel(order: Order): string {
  const idx = currentStepIndex(order);
  if (idx >= TRACK_STEPS.length - 1) return "Delivered";
  const nextAt = order.createdAt + (idx + 1) * STEP_MS;
  const ms = nextAt - Date.now();
  if (ms <= 0) return "Updating…";
  const s = Math.ceil(ms / 1000);
  if (s < 60) return `Next update in ${s}s`;
  return `Next update in ${Math.ceil(s / 60)}m`;
}

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