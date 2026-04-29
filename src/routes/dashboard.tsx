import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  IndianRupee, Package, ShoppingBag, Users, Trash2, TrendingUp,
} from "lucide-react";
import {
  getOrders, updateOrderStatus, deleteOrder, clearOrders, type Order,
} from "@/lib/orders";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — ShoPperZ" },
      { name: "description", content: "View orders, revenue, and shop performance." },
    ],
  }),
});

function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");

  const refresh = () => setOrders(getOrders());
  useEffect(() => { refresh(); }, []);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const itemsSold = orders.reduce((s, o) => s + o.items.reduce((n, i) => n + i.qty, 0), 0);
    const customers = new Set(orders.map((o) => o.customer.email.toLowerCase())).size;
    return { revenue, itemsSold, customers, count: orders.length };
  }, [orders]);

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; revenue: number; image: string }>();
    orders.forEach((o) => o.items.forEach((i) => {
      const cur = map.get(i.id) ?? { name: i.name, qty: 0, revenue: 0, image: i.image };
      cur.qty += i.qty;
      cur.revenue += i.price * i.qty;
      map.set(i.id, cur);
    }));
    return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const handleStatus = (id: string, status: Order["status"]) => {
    updateOrderStatus(id, status);
    refresh();
  };
  const handleDelete = (id: string) => {
    if (confirm("Delete this order?")) { deleteOrder(id); refresh(); }
  };
  const handleClear = () => {
    if (confirm("Clear ALL orders? This cannot be undone.")) { clearOrders(); refresh(); }
  };

  const methodLabel = (m: Order["method"]) =>
    m === "cod" ? "COD" : m === "phonepe" ? "PhonePe" : "Card";

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of orders, revenue and customers.</p>
        </div>
        {orders.length > 0 && (
          <button
            onClick={handleClear}
            className="rounded border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Clear all orders
          </button>
        )}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<IndianRupee className="h-5 w-5" />} label="Total Revenue" value={formatINR(stats.revenue)} />
        <StatCard icon={<ShoppingBag className="h-5 w-5" />} label="Orders" value={String(stats.count)} />
        <StatCard icon={<Package className="h-5 w-5" />} label="Items Sold" value={String(stats.itemsSold)} />
        <StatCard icon={<Users className="h-5 w-5" />} label="Customers" value={String(stats.customers)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg border bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
            <h2 className="text-lg font-bold">Orders</h2>
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-xs font-semibold">
              {(["all", "pending", "shipped", "delivered"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-3 py-1 capitalize transition ${
                    filter === f ? "bg-white shadow" : "text-gray-600 hover:text-black"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-16 text-center text-sm text-gray-500">
              No orders yet. Place a test order from the shop to see it here.
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((o) => (
                <li key={o.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold">{o.id}</span>
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                          {methodLabel(o.method)}
                        </span>
                        <StatusBadge status={o.status} />
                      </div>
                      <p className="mt-1 text-sm text-gray-700">
                        {o.customer.name} • {o.customer.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {o.customer.city}, {o.customer.pincode} • {new Date(o.date).toLocaleString("en-IN")}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">
                        {o.items.map((i) => `${i.name}×${i.qty}`).join(", ")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-lg font-bold">{formatINR(o.total)}</p>
                      <div className="flex items-center gap-2">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatus(o.id, e.target.value as Order["status"])}
                          className="rounded border px-2 py-1 text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <button
                          onClick={() => handleDelete(o.id)}
                          className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="h-fit rounded-lg border bg-white p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <TrendingUp className="h-5 w-5" /> Top Products
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No sales yet.</p>
          ) : (
            <ul className="space-y-3">
              {topProducts.map((p) => (
                <li key={p.name} className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="h-10 w-10 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.qty} sold</p>
                  </div>
                  <p className="text-sm font-bold">{formatINR(p.revenue)}</p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="mb-2 flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles: Record<Order["status"], string> = {
    pending: "bg-amber-100 text-amber-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
  };
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
}