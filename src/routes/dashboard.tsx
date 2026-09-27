import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your orders — NovaEdge Studio" },
      {
        name: "description",
        content:
          "Track every NovaEdge order you have placed, including items, totals and delivery status.",
      },
      { property: "og:title", content: "Your orders — NovaEdge Studio" },
      { property: "og:description", content: "Track your NovaEdge orders and downloads." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { orders, hydrated } = useStore();

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const itemsBought = orders.reduce(
    (sum, order) => sum + order.lines.reduce((lineSum, line) => lineSum + line.quantity, 0),
    0,
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-14">
      <p className="eyebrow">Account</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Your orders</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Every order placed in this browser, with its items, totals and current status.
      </p>

      <div className="mt-10 grid gap-px overflow-hidden rounded-sm border bg-border sm:grid-cols-3">
        {[
          { label: "Orders placed", value: orders.length.toString() },
          { label: "Items purchased", value: itemsBought.toString() },
          { label: "Total spent", value: formatPrice(totalSpent) },
        ].map((stat) => (
          <div key={stat.label} className="bg-background p-6">
            <p className="font-display text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {hydrated && orders.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed p-16 text-center">
          <Package className="mx-auto size-10 text-muted-foreground" strokeWidth={1} />
          <p className="mt-4 font-display text-2xl">No orders yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Once you place an order it will appear here with its receipt.
          </p>
          <Button asChild className="mt-6">
            <Link to="/products">Browse the catalogue</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="rounded-sm border">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-secondary/40 px-6 py-4">
                <div>
                  <p className="font-medium">Order {order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.placedAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}{" "}
                    · {order.email}
                  </p>
                </div>
                <Badge variant={order.status === "delivered" ? "secondary" : "default"}>
                  {order.status === "delivered" ? "Delivered" : "Processing"}
                </Badge>
              </header>
              <ul className="divide-y">
                {order.lines.map((line) => (
                  <li key={line.productId} className="flex justify-between gap-4 px-6 py-3 text-sm">
                    <Link
                      to="/products/$productId"
                      params={{ productId: line.productId }}
                      className="hover:underline"
                    >
                      {line.name} <span className="text-muted-foreground">× {line.quantity}</span>
                    </Link>
                    <span className="tabular-nums">{formatPrice(line.price * line.quantity)}</span>
                  </li>
                ))}
              </ul>
              <footer className="flex flex-wrap justify-end gap-6 border-t px-6 py-4 text-sm">
                <span className="text-muted-foreground">
                  Subtotal <span className="tabular-nums">{formatPrice(order.subtotal)}</span>
                </span>
                {order.discount > 0 && (
                  <span className="text-primary">
                    Discount <span className="tabular-nums">−{formatPrice(order.discount)}</span>
                  </span>
                )}
                <span className="text-muted-foreground">
                  Tax <span className="tabular-nums">{formatPrice(order.tax)}</span>
                </span>
                <span className="font-medium">
                  Total <span className="tabular-nums">{formatPrice(order.total)}</span>
                </span>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
