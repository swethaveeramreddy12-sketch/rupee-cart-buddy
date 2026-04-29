import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/products";
import { CreditCard, Lock, Truck, Smartphone } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout — ShoPperZ" },
      { name: "description", content: "Complete your purchase securely." },
    ],
  }),
});

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState<"card" | "phonepe" | "cod">("card");
  const [phoneUpi, setPhoneUpi] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", address: "", city: "", pincode: "",
    card: "", expiry: "", cvv: "",
  });

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      clear();
      navigate({ to: "/success", search: { method } });
    }, method === "cod" ? 800 : 1500);
  };

  if (items.length === 0 && !processing) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link to="/" className="mt-4 inline-block rounded bg-black px-6 py-2 text-white">Continue Shopping</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <form onSubmit={submit} className="space-y-6">
          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-bold">Shipping Address</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="Full name" value={form.name} onChange={update("name")} className="rounded border px-3 py-2 sm:col-span-2" />
              <input required type="email" placeholder="Email" value={form.email} onChange={update("email")} className="rounded border px-3 py-2 sm:col-span-2" />
              <input required placeholder="Address" value={form.address} onChange={update("address")} className="rounded border px-3 py-2 sm:col-span-2" />
              <input required placeholder="City" value={form.city} onChange={update("city")} className="rounded border px-3 py-2" />
              <input required placeholder="PIN code" value={form.pincode} onChange={update("pincode")} className="rounded border px-3 py-2" />
            </div>
          </section>

          <section className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <CreditCard className="h-5 w-5" /> Payment Details
            </h2>

            <div className="mb-4 grid gap-2 sm:grid-cols-3">
              {[
                { id: "card", label: "Card", icon: CreditCard },
                { id: "phonepe", label: "PhonePe / UPI", icon: Smartphone },
                { id: "cod", label: "Cash on Delivery", icon: Truck },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = method === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setMethod(opt.id as typeof method)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 px-3 py-3 text-sm font-medium transition ${
                      active ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {method === "card" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <input required placeholder="Card number" maxLength={19} value={form.card} onChange={update("card")} className="rounded border px-3 py-2 sm:col-span-2" />
                <input required placeholder="MM/YY" value={form.expiry} onChange={update("expiry")} className="rounded border px-3 py-2" />
                <input required placeholder="CVV" maxLength={4} value={form.cvv} onChange={update("cvv")} className="rounded border px-3 py-2" />
              </div>
            )}

            {method === "phonepe" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#5f259f] text-white font-bold">P</div>
                  <div className="text-sm">
                    <p className="font-semibold">Pay with PhonePe</p>
                    <p className="text-xs text-gray-600">Enter your UPI ID or PhonePe number</p>
                  </div>
                </div>
                <input
                  required
                  placeholder="yourname@ybl  or  9876543210"
                  value={phoneUpi}
                  onChange={(e) => setPhoneUpi(e.target.value)}
                  className="w-full rounded border px-3 py-2"
                />
                <p className="text-xs text-gray-500">A payment request will be sent to your PhonePe app.</p>
              </div>
            )}

            {method === "cod" && (
              <div className="rounded-lg border border-dashed bg-amber-50 p-4 text-sm">
                <p className="font-semibold">Pay {formatINR(total)} in cash when your order arrives.</p>
                <p className="mt-1 text-xs text-gray-600">Please keep exact change ready. An OTP will be required at the time of delivery.</p>
              </div>
            )}

            <p className="mt-3 flex items-center gap-1 text-xs text-gray-500">
              <Lock className="h-3 w-3" /> Demo checkout — no real payment processed.
            </p>
          </section>

          <button
            type="submit"
            disabled={processing}
            className="w-full rounded bg-black py-4 font-bold text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {processing
              ? method === "cod" ? "Placing order…" : "Processing payment…"
              : method === "cod"
                ? `Place Order — ${formatINR(total)}`
                : method === "phonepe"
                  ? `Pay with PhonePe — ${formatINR(total)}`
                  : `Pay ${formatINR(total)}`}
          </button>
        </form>

        <aside className="h-fit rounded-lg border bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
          <ul className="mb-4 space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex gap-3">
                <img src={i.image} alt={i.name} className="h-14 w-14 rounded object-cover" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold">{i.name}</p>
                  <p className="text-gray-500">Qty {i.qty}</p>
                </div>
                <p className="text-sm font-semibold">{formatINR(i.price * i.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t pt-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(total)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Shipping</span><span>Free</span></div>
            <div className="mt-2 flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total</span><span>{formatINR(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}