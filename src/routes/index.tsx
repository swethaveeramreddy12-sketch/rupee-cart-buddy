import { createFileRoute } from "@tanstack/react-router";
import { products, formatINR } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ShoPperZ — Online Shopping in India" },
      { name: "description", content: "Shop electronics, fashion, home essentials and more at ShoPperZ. Best prices in INR with fast checkout." },
    ],
  }),
});

function Index() {
  const { add, setOpen } = useCart();
  const SIZES = ["S", "M", "L", "XL"];
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const getQty = (id: string) => qtys[id] ?? 1;
  const setQty = (id: string, q: number) =>
    setQtys((s) => ({ ...s, [id]: Math.max(1, Math.min(99, q)) }));
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-2 p-4 md:grid-cols-2">
        <img
          src="https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
          alt="Shopping"
          className="h-[420px] w-full rounded-lg object-cover"
        />
        <img
          src="https://images.pexels.com/photos/3962294/pexels-photo-3962294.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
          alt="50% off sale"
          className="h-[420px] w-full rounded-lg object-cover"
        />
      </section>

      <h1 className="mx-auto max-w-7xl px-6 pt-8 text-3xl font-bold tracking-tight">Our Products</h1>
      <p className="mx-auto max-w-7xl px-6 pb-6 text-gray-600">Shop the latest at unbeatable prices.</p>

      <section id="products" className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pb-16 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <article key={p.id} className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-lg">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
            </div>
            <div className="bg-[var(--brand)] py-2 text-center text-sm font-bold tracking-wider text-[var(--brand-foreground)]">
              {p.name}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              <div className="text-lg font-bold text-[var(--price)]">{formatINR(p.price)}</div>
              <p className="flex-1 text-xs text-gray-600">{p.description}</p>
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Size</div>
                <div className="flex flex-wrap gap-1">
                  {SIZES.map((s) => {
                    const active = (sizes[p.id] ?? "M") === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSizes((cur) => ({ ...cur, [p.id]: s }))}
                        className={`h-7 min-w-7 rounded border px-2 text-xs font-semibold transition ${
                          active
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-black"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Quantity</div>
                <div className="inline-flex items-center rounded border">
                  <button
                    type="button"
                    onClick={() => setQty(p.id, getQty(p.id) - 1)}
                    className="px-2 py-1 hover:bg-gray-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-semibold">{getQty(p.id)}</span>
                  <button
                    type="button"
                    onClick={() => setQty(p.id, getQty(p.id) + 1)}
                    className="px-2 py-1 hover:bg-gray-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  const size = sizes[p.id] ?? "M";
                  const variant = { ...p, id: `${p.id}-${size}`, name: `${p.name} (${size})` };
                  const n = getQty(p.id);
                  for (let i = 0; i < n; i++) add(variant);
                  setOpen(true);
                }}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded bg-black py-2 text-xs font-bold text-white transition hover:bg-gray-800"
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>
            </div>
          </article>
        ))}
      </section>

      <footer id="contact" className="bg-black py-10 text-center text-sm text-white/70">
        © {new Date().getFullYear()} ShoPperZ. All rights reserved.
      </footer>
    </main>
  );
}
