import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, ShoppingBag } from "lucide-react";
import { getOrders, type Order } from "@/lib/orders";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — ShoPperZ" },
      { name: "description", content: "View your orders and account activity." },
    ],
  }),
});

function methodLabel(m: Order["method"]) {
  return m === "cod" ? "Cash on Delivery" : m === "phonepe" ? "PhonePe / UPI" : "Card";
}

function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => setOrders(getOrders()), []);

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const itemsBought = orders.reduce((s, o) => s + o.items.reduce((q, i) => q + i.qty, 0), 0);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
      <p className="mb-8 text-sm text-gray-600">Your recent orders with ShoPperZ.</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500">Orders</p>
          <p className="mt-1 text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500">Items Bought</p>
          <p className="mt-1 text-2xl font-bold">{itemsBought}</p>
        </div>
        <div className="rounded-lg border bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500">Total Spent</p>
          <p className="mt-1 text-2xl font-bold">{formatINR(totalSpent)}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-gray-50 p-10 text-center">
          <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <p className="font-semibold">No orders yet</p>
          <p className="mt-1 text-sm text-gray-600">Place your first order to see it here.</p>
          <Link to="/" className="mt-4 inline-block rounded bg-black px-6 py-2 text-sm font-bold text-white">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-lg border bg-white p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-mono text-sm font-bold">{o.id}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(o.createdAt).toLocaleString()} • {methodLabel(o.method)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {o.status}
                  </span>
                  <p className="text-lg font-bold">{formatINR(o.total)}</p>
                </div>
              </div>
              <ul className="divide-y border-t">
                {o.items.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 py-2">
                    <img src={i.image} alt={i.name} className="h-12 w-12 rounded object-cover" />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold">{i.name}</p>
                      <p className="text-xs text-gray-500">Qty {i.qty}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatINR(i.price * i.qty)}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}