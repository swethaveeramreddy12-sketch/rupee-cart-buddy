import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Package, ShoppingBag, LayoutDashboard, Receipt, User, Home, LogOut } from "lucide-react";
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
  const [section, setSection] = useState<"overview" | "orders" | "profile">("overview");
  useEffect(() => setOrders(getOrders()), []);

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const itemsBought = orders.reduce((s, o) => s + o.items.reduce((q, i) => q + i.qty, 0), 0);
  const latest = useMemo(() => orders[0], [orders]);

  const navItems = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "orders" as const, label: "Orders", icon: Receipt },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8">
      <aside className="sticky top-20 hidden h-fit w-60 shrink-0 rounded-lg border bg-white p-4 md:block">
        <div className="mb-4 px-2">
          <p className="text-xs uppercase tracking-wider text-gray-500">My Account</p>
          <p className="mt-1 font-bold">Welcome back</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((n) => {
            const Icon = n.icon;
            const active = section === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </button>
            );
          })}
          <Link
            to="/"
            className="mt-4 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <Home className="h-4 w-4" />
            Back to Shop
          </Link>
          <button
            onClick={() => alert("Demo only — no real session.")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
          {navItems.map((n) => {
            const active = section === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold ${
                  active ? "bg-black text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                {n.label}
              </button>
            );
          })}
        </div>

        {section === "overview" && (
          <>
            <h1 className="mb-2 text-3xl font-bold">Overview</h1>
            <p className="mb-6 text-sm text-gray-600">Your recent activity with ShoPperZ.</p>
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
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
            {latest ? (
              <div className="rounded-lg border bg-white p-5">
                <p className="mb-3 text-sm font-semibold text-gray-500">Latest Order</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-mono text-sm font-bold">{latest.id}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(latest.createdAt).toLocaleString()} • {methodLabel(latest.method)}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold">{formatINR(latest.total)}</p>
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}

        {section === "orders" && (
          <>
            <h1 className="mb-2 text-3xl font-bold">Orders</h1>
            <p className="mb-6 text-sm text-gray-600">Full order history.</p>
            {orders.length === 0 ? (
              <EmptyState />
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
          </>
        )}

        {section === "profile" && (
          <>
            <h1 className="mb-2 text-3xl font-bold">Profile</h1>
            <p className="mb-6 text-sm text-gray-600">Saved from your most recent order.</p>
            {latest ? (
              <div className="grid gap-3 rounded-lg border bg-white p-6 sm:grid-cols-2">
                <Field label="Name" value={latest.customer.name} />
                <Field label="Email" value={latest.customer.email} />
                <Field label="Address" value={latest.customer.address} />
                <Field label="City" value={latest.customer.city} />
                <Field label="PIN" value={latest.customer.pincode} />
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-1 font-medium">{value || "—"}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed bg-gray-50 p-10 text-center">
      <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-400" />
      <p className="font-semibold">Nothing here yet</p>
      <p className="mt-1 text-sm text-gray-600">Place your first order to populate this dashboard.</p>
      <Link to="/" className="mt-4 inline-block rounded bg-black px-6 py-2 text-sm font-bold text-white">
        Start Shopping
      </Link>
    </div>
  );
}