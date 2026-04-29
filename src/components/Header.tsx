import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, Search, LayoutDashboard } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useSearchQuery } from "@/lib/search";
import { products, formatINR, generateProductsForQuery, type Product } from "@/lib/products";
import { useEffect, useMemo, useRef, useState } from "react";

export function Header() {
  const { count, setOpen, add } = useCart();
  const { query, setQuery } = useSearchQuery();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setSuggestOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const q = query.trim().toLowerCase();
  const suggestions = useMemo<Product[]>(() => {
    if (!q) return [];
    const matches = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
    const generated = generateProductsForQuery(query, 6);
    return [...matches, ...generated].slice(0, 8);
  }, [q, query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setSuggestOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const goSearch = () => {
    if (path !== "/") navigate({ to: "/" });
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    setSuggestOpen(false);
  };

  const pick = (p: Product) => {
    add(p);
    setSuggestOpen(false);
    setOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-black text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="font-serif text-2xl tracking-wide italic">
          ShoPperZ
        </Link>
        <div ref={wrapRef} className="relative hidden flex-1 max-w-md md:block">
          <form
            onSubmit={(e) => { e.preventDefault(); goSearch(); }}
            className="flex items-center rounded bg-white px-3 py-1.5 text-black"
          >
            <input
              value={query}
              onFocus={() => setSuggestOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setSuggestOpen(true);
                if (path !== "/") navigate({ to: "/" });
              }}
              placeholder="Search products…"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="mr-2 text-xs text-gray-500 hover:text-black">
                clear
              </button>
            )}
            <button type="submit" aria-label="Search">
              <Search className="h-4 w-4 opacity-70" />
            </button>
          </form>

          {open && q && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border bg-white text-black shadow-xl">
              <ul className="divide-y">
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => pick(p)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50"
                    >
                      <img src={p.image} alt={p.name} className="h-12 w-12 rounded object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{p.name}</p>
                        <p className="text-xs text-gray-500">{formatINR(p.price)}</p>
                      </div>
                      <span className="text-xs font-bold text-[var(--brand)]">Add</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goSearch}
                className="block w-full border-t bg-gray-50 px-3 py-2 text-center text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                See all results for “{query}”
              </button>
            </div>
          )}
        </div>
        <nav className="hidden items-center gap-6 text-xs font-semibold tracking-widest lg:flex">
          <Link to="/" className="hover:text-[var(--brand)]">HOME</Link>
          <a href="#products" className="hover:text-[var(--brand)]">SHOP</a>
          <a href="#products" className="hover:text-[var(--brand)]">OUR PRODUCTS</a>
          <a href="#contact" className="hover:text-[var(--brand)]">CONTACT US</a>
          <a href="#about" className="hover:text-[var(--brand)]">ABOUT US</a>
          <Link to="/dashboard" className="hover:text-[var(--brand)]">DASHBOARD</Link>
        </nav>
        <Link
          to="/dashboard"
          className="rounded-full p-2 hover:bg-white/10"
          aria-label="Open dashboard"
        >
          <LayoutDashboard className="h-5 w-5" />
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="relative rounded-full p-2 hover:bg-white/10"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-bold text-black">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}