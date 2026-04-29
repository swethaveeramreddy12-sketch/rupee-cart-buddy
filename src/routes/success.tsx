import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/success")({
  component: SuccessPage,
  head: () => ({
    meta: [
      { title: "Payment Successful — ShoPperZ" },
      { name: "description", content: "Your order has been placed successfully." },
    ],
  }),
});

function SuccessPage() {
  const orderId = "SHP" + Math.floor(100000 + Math.random() * 900000);
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 grid h-24 w-24 place-items-center rounded-full bg-green-100">
        <CheckCircle2 className="h-14 w-14 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold">Payment Successful!</h1>
      <p className="mt-3 text-gray-600">
        Thank you for shopping with ShoPperZ. Your order has been placed and will be shipped soon.
      </p>
      <div className="mt-6 rounded-lg border bg-gray-50 px-6 py-3">
        <p className="text-xs uppercase tracking-wider text-gray-500">Order ID</p>
        <p className="font-mono text-lg font-bold">{orderId}</p>
      </div>
      <Link
        to="/"
        className="mt-8 rounded bg-black px-8 py-3 font-bold text-white transition hover:bg-gray-800"
      >
        Continue Shopping
      </Link>
    </main>
  );
}