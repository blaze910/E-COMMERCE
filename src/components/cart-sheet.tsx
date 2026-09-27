import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

export function CartSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { cart, getProduct, setQuantity, removeFromCart, subtotal, itemCount } = useStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="font-display text-2xl">
            Your bag {itemCount > 0 && <span className="text-muted-foreground">({itemCount})</span>}
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
            <Button asChild variant="outline" onClick={() => onOpenChange(false)}>
              <Link to="/products">Browse the catalogue</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="divide-y">
              {cart.map((line) => {
                const product = getProduct(line.productId);
                if (!product) return null;
                return (
                  <li key={line.productId} className="flex gap-4 py-4">
                    <img
                      src={product.image}
                      alt=""
                      loading="lazy"
                      className="size-20 shrink-0 rounded-sm object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{product.delivery}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center rounded-sm border">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${product.name}`}
                            className="px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="min-w-8 text-center text-sm tabular-nums">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${product.name}`}
                            className="px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${product.name}`}
                          className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                          onClick={() => removeFromCart(line.productId)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <span className="ml-auto text-sm font-medium tabular-nums">
                          {formatPrice(product.price * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {cart.length > 0 && (
          <SheetFooter className="border-t px-6 py-5">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Taxes are calculated at checkout. Digital items are delivered by email.
            </p>
            <Button asChild size="lg" className="w-full" onClick={() => onOpenChange(false)}>
              <Link to="/checkout">Checkout</Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
