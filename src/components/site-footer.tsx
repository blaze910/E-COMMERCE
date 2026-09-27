import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-secondary/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl">NovaEdge</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Commerce design, branding, and engineering kits for teams shipping their next launch.
          </p>
        </div>
        <div>
          <p className="eyebrow">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/products" className="text-muted-foreground hover:text-foreground">
                All products
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="text-muted-foreground hover:text-foreground">
                Checkout
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Company</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/admin" className="text-muted-foreground hover:text-foreground">
                Catalogue admin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>hello@novaedge.studio</li>
            <li>Mon–Fri, 9:00–17:00 GMT</li>
            <li>Remote, worldwide</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NovaEdge Studio. All rights reserved.</p>
          <p>Prices in USD. Digital delivery by email.</p>
        </div>
      </div>
    </footer>
  );
}
