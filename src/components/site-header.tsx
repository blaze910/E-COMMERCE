import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { CartSheet } from "@/components/cart-sheet";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";

const NAV = [
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/dashboard", label: "Orders" },
] as const;

export function SiteHeader() {
  const { itemCount, hydrated } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-5">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6">
              <SheetTitle className="font-display text-2xl">NovaEdge</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-sm px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                    activeProps={{ className: "bg-secondary font-medium" }}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-sm px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary"
                >
                  Catalogue admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="font-display text-2xl tracking-tight">
            NovaEdge
          </Link>

          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
              <Link to="/admin">Admin</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="relative gap-2"
              onClick={() => setCartOpen(true)}
              aria-label="Open bag"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">Bag</span>
              {hydrated && itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground tabular-nums">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
