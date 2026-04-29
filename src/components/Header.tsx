import { Link } from "@tanstack/react-router";
import { ShoppingCart, LayoutDashboard } from "lucide-react";
import { useCart } from "@/lib/cart";

export function Header() {
  const { count, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-black text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="font-serif text-2xl tracking-wide italic">
          ShoPperZ
        </Link>
        <div className="flex-1" />
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