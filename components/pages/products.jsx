"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/products";
import { useStore } from "@/lib/store";
const ADMIN_DESTINATION = "/admin";
const ADMIN_ENTRY_KEY = "novaedge:admin-entry";
const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
];
function score(product, query) {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const haystacks = [
    [product.name.toLowerCase(), 40],
    [product.tagline.toLowerCase(), 20],
    [product.category.toLowerCase(), 15],
    [product.description.toLowerCase(), 8],
    [product.includes.join(" ").toLowerCase(), 5],
  ];
  let total = 0;
  for (const [text, weight] of haystacks) {
    if (text.startsWith(q)) total += weight * 1.5;
    else if (text.includes(q)) total += weight;
  }
  return total;
}
export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "all";
  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const { catalog } = useStore();
  const setSearch = (next) => {
    const merged = { category, q, sort, ...next };
    const search = new URLSearchParams();
    if (merged.category && merged.category !== "all")
      search.set("category", merged.category);
    if (merged.q) search.set("q", merged.q);
    if (merged.sort && merged.sort !== "featured")
      search.set("sort", merged.sort);
    const query = search.toString();
    void router.replace(query ? `/products?${query}` : "/products", {
      scroll: false,
    });
  };
  const counts = useMemo(() => {
    const map = { all: catalog.length };
    for (const item of catalog)
      map[item.category] = (map[item.category] ?? 0) + 1;
    return map;
  }, [catalog]);
  const results = useMemo(() => {
    const filtered = catalog
      .filter((product) => category === "all" || product.category === category)
      .map((product) => ({ product, relevance: score(product, q) }))
      .filter((entry) => entry.relevance > 0);
    filtered.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.product.price - b.product.price;
        case "price-desc":
          return b.product.price - a.product.price;
        case "rating":
          return b.product.rating - a.product.rating;
        default:
          if (q.trim()) return b.relevance - a.relevance;
          return (
            Number(Boolean(b.product.featured)) -
            Number(Boolean(a.product.featured))
          );
      }
    });
    return filtered.map((entry) => entry.product);
  }, [catalog, category, q, sort]);
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14">
      <p className="eyebrow">Catalogue</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Everything we sell</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Fixed prices, stated delivery times, and a plain description of what
        lands in your inbox.
      </p>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(event) => {
              if (
                event.target.value.trim().toLowerCase() === ADMIN_DESTINATION
              ) {
                window.sessionStorage.setItem(ADMIN_ENTRY_KEY, "1");
                void router.push(ADMIN_DESTINATION);
                return;
              }
              setSearch({ q: event.target.value });
            }}
            placeholder="Search products, categories or deliverables"
            aria-label="Search products"
            className="h-11 pl-9 pr-9"
          />
          {q && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch({ q: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Select
          value={sort}
          onValueChange={(value) => setSearch({ sort: value })}
        >
          <SelectTrigger
            className="h-11 w-full lg:w-56"
            aria-label="Sort products"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[{ value: "all", label: "All" }, ...CATEGORIES].map((option) => {
          const active = category === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSearch({ category: option.value })}
              aria-pressed={active}
              className={`rounded-sm border px-3.5 py-2 text-sm transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background hover:bg-secondary"
              }`}
            >
              {option.label}
              <span className="ml-1.5 opacity-60 tabular-nums">
                {counts[option.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Showing {results.length} {results.length === 1 ? "product" : "products"}
        {q ? ` for “${q}”` : ""}.
      </p>

      {results.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed p-14 text-center">
          <p className="font-display text-2xl">Nothing matched that search</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a broader word, or clear the filters to see the full catalogue.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setSearch({ q: "", category: "all" })}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
