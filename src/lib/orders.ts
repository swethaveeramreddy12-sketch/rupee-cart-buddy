export type Order = {
  id: string;
  date: string; // ISO
  customer: { name: string; email: string; address: string; city: string; pincode: string };
  items: { id: string; name: string; price: number; qty: number; image: string }[];
  total: number;
  method: "card" | "phonepe" | "cod";
  status: "pending" | "shipped" | "delivered";
};

const KEY = "shopperz_orders";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(o: Order) {
  const all = getOrders();
  all.unshift(o);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function updateOrderStatus(id: string, status: Order["status"]) {
  const all = getOrders().map((o) => (o.id === id ? { ...o, status } : o));
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function deleteOrder(id: string) {
  const all = getOrders().filter((o) => o.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function clearOrders() {
  localStorage.removeItem(KEY);
}