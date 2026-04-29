import { createFileRoute } from "@tanstack/react-router";
import { products, formatINR } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ShoppingCart, Search as SearchIcon } from "lucide-react";
import { useSearchQuery } from "@/lib/search";

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
  const { query, setQuery } = useSearchQuery();
  const q = query.trim().toLowerCase();
  // Always show every product. If user searches, matches come first.
  const matches = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    : [];
  const rest = q ? products.filter((p) => !matches.includes(p)) : products;
  const filtered = [...matches, ...rest];
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

      <h1 className="mx-auto max-w-7xl px-6 pt-8 text-3xl font-bold tracking-tight">
        {q ? `Results for "${query}"` : "Our Products"}
      </h1>
      <p className="mx-auto max-w-7xl px-6 pb-4 text-gray-600">
        {q
          ? `${matches.length} match${matches.length === 1 ? "" : "es"} — showing all products below`
          : "Shop the latest at unbeatable prices."}
      </p>

      {/* Mobile search */}
      <div className="mx-auto mb-4 flex max-w-7xl items-center gap-2 rounded border bg-white px-3 py-2 md:hidden mx-4">
        <SearchIcon className="h-4 w-4 opacity-60" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="flex-1 bg-transparent text-sm outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-xs text-gray-500">clear</button>
        )}
      </div>

      <section id="products" className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pb-16 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
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
              <button
                onClick={() => { add(p); setOpen(true); }}
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
