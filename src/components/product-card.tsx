import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatPrice, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();

  return (
    <article className="group flex flex-col overflow-hidden rounded-sm border bg-card transition-shadow hover:shadow-lg">
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.compareAt && (
          <span className="absolute left-3 top-3 rounded-sm bg-primary px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
            Save {formatPrice(product.compareAt - product.price)}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">{product.category}</p>
        <h3 className="mt-2 text-lg leading-snug">
          <Link to="/products/$productId" params={{ productId: product.id }}>
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-primary text-primary" />
          <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
          <span>({product.reviews})</span>
          <span aria-hidden>·</span>
          <span>{product.delivery}</span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3 pt-1">
          <div>
            <span className="font-display text-2xl">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>
          <Button size="sm" onClick={() => {
              addToCart(product.id);
              toast.success(`${product.name} added to your bag`);
            }}>
            Add to bag
          </Button>
        </div>
      </div>
    </article>
  );
}
