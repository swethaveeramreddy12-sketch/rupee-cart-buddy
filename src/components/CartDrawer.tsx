import { useNavigate } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/products";

export function CartDrawer() {
  const { open, setOpen, items, setQty, remove, total, count } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag className="h-5 w-5" /> Your Cart ({count})
          </h2>
          <button onClick={() => setOpen(false)} className="rounded p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="mt-20 text-center text-gray-500">
              <ShoppingBag className="mx-auto mb-3 h-12 w-12 opacity-30" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3 rounded-lg border p-3">
                  <img src={i.image} alt={i.name} className="h-20 w-20 rounded object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-bold">{i.name}</p>
                      <button onClick={() => remove(i.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-[var(--price)]">{formatINR(i.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => setQty(i.id, i.qty - 1)}
                        className="rounded border p-1 hover:bg-gray-50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{i.qty}</span>
                      <button
                        onClick={() => setQty(i.id, i.qty + 1)}
                        className="rounded border p-1 hover:bg-gray-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-bold">{formatINR(total)}</span>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                navigate({ to: "/checkout" });
              }}
              className="w-full rounded bg-black py-3 font-bold text-white transition hover:bg-gray-800"
            >
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}