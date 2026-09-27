import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Clock, ShieldCheck } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NovaEdge Studio — Commerce kits that ship" },
      {
        name: "description",
        content:
          "Buy design systems, branding kits, strategy sessions and engineering starters built for commerce teams. Instant delivery, fixed prices, no retainers.",
      },
      { property: "og:title", content: "NovaEdge Studio — Commerce kits that ship" },
      {
        property: "og:description",
        content: "Design, branding, strategy and engineering kits for commerce teams.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { catalog } = useStore();
  const featured = catalog.filter((product) => product.featured).slice(0, 3);

  return (
    <>
      <section className="border-b bg-secondary/30">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div>
            <p className="eyebrow">Studio catalogue</p>
            <h1 className="mt-5 text-balance text-5xl leading-[1.05] sm:text-6xl">
              The parts of a launch you shouldn't have to build twice.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Design systems, brand kits, strategy sessions, and engineering starters — priced
              plainly and delivered in days, not quarters.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/products">
                  Browse the catalogue <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">How we work</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t pt-8">
              <div>
                <dt className="font-display text-3xl">12</dt>
                <dd className="mt-1 text-xs text-muted-foreground">Products in catalogue</dd>
              </div>
              <div>
                <dt className="font-display text-3xl">1.6k</dt>
                <dd className="mt-1 text-xs text-muted-foreground">Teams served</dd>
              </div>
              <div>
                <dt className="font-display text-3xl">4.8</dt>
                <dd className="mt-1 text-xs text-muted-foreground">Average rating</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
              alt="A studio workspace with design references pinned to the wall"
              className="aspect-[4/5] w-full rounded-sm object-cover"
            />
            <div className="absolute -bottom-6 -left-6 hidden max-w-xs rounded-sm border bg-card p-5 shadow-xl sm:block">
              <p className="eyebrow">Most requested</p>
              <p className="mt-2 font-display text-xl">Conversion UI Toolkit</p>
              <p className="mt-1 text-sm text-muted-foreground">
                140 interface blocks built around buying decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
          {[
            { icon: Clock, title: "Delivered in days", body: "Most items download instantly; sessions book within a week." },
            { icon: ShieldCheck, title: "Fixed, public pricing", body: "No discovery calls before you see a number." },
            { icon: BadgeCheck, title: "Revisions included", body: "Every bespoke item includes two rounds of revisions." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 className="mt-3 text-4xl">Start with what teams buy most</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/products">
              View all 12 products <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y bg-secondary/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <p className="eyebrow">Categories</p>
          <h2 className="mt-3 text-4xl">Four ways we help</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-sm border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.value}
                to="/products"
                search={{ category: category.value }}
                className="group bg-background p-7 transition-colors hover:bg-card"
              >
                <p className="font-display text-2xl">{category.label}</p>
                <p className="mt-2 text-sm text-muted-foreground">{category.blurb}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Browse <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-5 py-20 text-center">
        <p className="eyebrow">Ready when you are</p>
        <h2 className="mt-4 text-balance text-4xl">
          Tell us what you're launching and we'll point you to the right kit.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/contact">Talk to the studio</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/products">See the catalogue</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
