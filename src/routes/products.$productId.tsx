import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Minus, Plus, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/products/$productId")({
  head: ({ params }) => {
    const title = params.productId
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${title} — NovaEdge Studio` },
        {
          name: "description",
          content: `${title} from the NovaEdge catalogue: what is included, delivery time, and pricing.`,
        },
        { property: "og:title", content: `${title} — NovaEdge Studio` },
        {
          property: "og:description",
          content: `${title}: what is included, delivery time, and pricing.`,
        },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { productId } = Route.useParams();
  const { getProduct, catalog, addToCart, hydrated } = useStore();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const product = getProduct(productId);

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-28 text-center">
        <h1 className="font-display text-4xl">
          {hydrated ? "That product is no longer available" : "Loading…"}
        </h1>
        {hydrated && (
          <>
            <p className="mt-3 text-muted-foreground">
              It may have been removed from the catalogue.
            </p>
            <Button asChild className="mt-8">
              <Link to="/products">Back to all products</Link>
            </Button>
          </>
        )}
      </div>
    );
  }

  const related = catalog
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> All products
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-[4/3] w-full rounded-sm border object-cover"
        />

        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{product.tagline}</p>

          <div className="mt-5 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-primary text-primary" />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
            </span>
            <span className="text-muted-foreground">{product.reviews} reviews</span>
            <span className="text-muted-foreground" aria-hidden>
              ·
            </span>
            <span className="text-muted-foreground">{product.delivery}</span>
          </div>

          <div className="mt-7 flex items-end gap-3">
            <span className="font-display text-4xl">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="pb-1.5 text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>

          <p className="mt-6 text-muted-foreground">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-sm border">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="px-3 py-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-10 text-center text-sm tabular-nums">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="px-3 py-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setQuantity((value) => Math.min(99, value + 1))}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              size="lg"
              onClick={() => {
                addToCart(product.id, quantity);
                toast.success(`${product.name} added to your bag`);
              }}
            >
              Add to bag
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                addToCart(product.id, quantity);
                navigate({ to: "/checkout" });
              }}
            >
              Buy now
            </Button>
          </div>

          <div className="mt-10 rounded-sm border bg-secondary/40 p-6">
            <p className="eyebrow">What's included</p>
            <ul className="mt-4 space-y-2.5">
              {product.includes.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="text-3xl">More in {product.category}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
