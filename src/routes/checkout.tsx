import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/products";
import { DISCOUNT_CODES, TAX_RATE, useStore, type Order } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — NovaEdge Studio" },
      {
        name: "description",
        content:
          "Review your bag, apply a discount code and place your NovaEdge order. Digital items are delivered by email.",
      },
      { property: "og:title", content: "Checkout — NovaEdge Studio" },
      { property: "og:description", content: "Review your bag and place your NovaEdge order." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, getProduct, subtotal, placeOrder, hydrated } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Order | null>(null);

  const rate = appliedCode ? (DISCOUNT_CODES[appliedCode] ?? 0) : 0;
  const discount = subtotal * rate;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax;

  const applyCode = () => {
    const normalised = code.trim().toUpperCase();
    if (DISCOUNT_CODES[normalised]) {
      setAppliedCode(normalised);
      toast.success(`Code ${normalised} applied — ${Math.round(DISCOUNT_CODES[normalised] * 100)}% off`);
    } else {
      setAppliedCode(null);
      toast.error("That discount code isn't recognised.");
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const order = placeOrder({ name: name.trim(), email: email.trim(), discount });
    setSubmitting(false);
    if (!order) {
      toast.error("Your bag is empty.");
      return;
    }
    setConfirmed(order);
    toast.success(`Order ${order.id} placed`);
  };

  if (confirmed) {
    return (
      <div className="mx-auto w-full max-w-2xl px-5 py-24 text-center">
        <CheckCircle2 className="mx-auto size-12 text-primary" strokeWidth={1.25} />
        <h1 className="mt-6 font-display text-4xl">Order {confirmed.id} confirmed</h1>
        <p className="mt-3 text-muted-foreground">
          A receipt and download links are on their way to {confirmed.email}.
        </p>
        <div className="mt-8 rounded-sm border text-left">
          <ul className="divide-y">
            {confirmed.lines.map((line) => (
              <li key={line.productId} className="flex justify-between gap-4 px-5 py-3 text-sm">
                <span>
                  {line.name} <span className="text-muted-foreground">× {line.quantity}</span>
                </span>
                <span className="tabular-nums">{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t px-5 py-4">
            <span className="font-medium">Total paid</span>
            <span className="font-display text-xl">{formatPrice(confirmed.total)}</span>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/dashboard">View your orders</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/products">Keep browsing</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (hydrated && cart.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-5 py-28 text-center">
        <h1 className="font-display text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Add a product to the bag and it will show up here.
        </p>
        <Button asChild className="mt-8">
          <Link to="/products">Browse the catalogue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14">
      <p className="eyebrow">Checkout</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Complete your order</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="rounded-sm border p-6">
            <legend className="eyebrow px-2">Your details</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email for delivery</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-sm border p-6">
            <legend className="eyebrow px-2">Discount code</legend>
            <div className="flex gap-2">
              <Input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="NOVA10"
                aria-label="Discount code"
              />
              <Button type="button" variant="outline" onClick={applyCode}>
                Apply
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Try NOVA10 for 10% off or LAUNCH20 for 20% off.
            </p>
          </fieldset>

          <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
            <Lock className="size-4" />
            {submitting ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            This demo store records orders locally instead of charging a card.
          </p>
        </form>

        <aside className="h-fit rounded-sm border bg-secondary/40 p-6">
          <p className="eyebrow">Order summary</p>
          <ul className="mt-4 divide-y">
            {cart.map((line) => {
              const product = getProduct(line.productId);
              if (!product) return null;
              return (
                <li key={line.productId} className="flex gap-4 py-3">
                  <img
                    src={product.image}
                    alt=""
                    loading="lazy"
                    className="size-14 rounded-sm object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {line.quantity}</p>
                  </div>
                  <span className="text-sm tabular-nums">
                    {formatPrice(product.price * line.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>

          <dl className="mt-5 space-y-2 border-t pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-primary">
                <dt>Discount ({appliedCode})</dt>
                <dd className="tabular-nums">−{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tax (8%)</dt>
              <dd className="tabular-nums">{formatPrice(tax)}</dd>
            </div>
            <div className="flex justify-between border-t pt-3 text-base">
              <dt className="font-medium">Total</dt>
              <dd className="font-display text-2xl">{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
