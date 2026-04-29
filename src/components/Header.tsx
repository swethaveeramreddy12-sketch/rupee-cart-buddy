import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, Search, LayoutDashboard } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useSearchQuery } from "@/lib/search";

export function Header() {
  const { count, setOpen } = useCart();
  const { query, setQuery } = useSearchQuery();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const goSearch = () => {
    if (path !== "/") navigate({ to: "/" });
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 bg-black text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="font-serif text-2xl tracking-wide italic">
          ShoPperZ
        </Link>
        <form
          onSubmit={(e) => { e.preventDefault(); goSearch(); }}
          className="hidden flex-1 max-w-md items-center rounded bg-white px-3 py-1.5 text-black md:flex"
        >
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); if (path !== "/") navigate({ to: "/" }); }}
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