import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, formatPrice, type Category, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Catalogue admin — NovaEdge Studio" },
      {
        name: "description",
        content:
          "Add, edit and remove NovaEdge products, and reset the catalogue back to its default set.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Catalogue admin — NovaEdge Studio" },
      { property: "og:description", content: "Manage the NovaEdge product catalogue." },
    ],
  }),
  component: AdminPage,
});

const EMPTY = {
  id: "",
  name: "",
  tagline: "",
  description: "",
  category: "design" as Category,
  price: "",
  compareAt: "",
  delivery: "Instant download",
  image: "",
  includes: "",
};

type FormState = typeof EMPTY;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toForm(product: Product): FormState {
  return {
    id: product.id,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    category: product.category,
    price: String(product.price),
    compareAt: product.compareAt ? String(product.compareAt) : "",
    delivery: product.delivery,
    image: product.image,
    includes: product.includes.join("\n"),
  };
}

function AdminPage() {
  const { catalog, saveProduct, deleteProduct, resetCatalog } = useStore();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const startCreate = () => {
    setEditingId(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm(toForm(product));
    setOpen(true);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim() || Number.isNaN(price) || price <= 0) {
      toast.error("A name and a price above zero are required.");
      return;
    }

    const existing = editingId ? catalog.find((item) => item.id === editingId) : undefined;
    const id = editingId ?? (slugify(form.name) || `product-${Date.now()}`);

    if (!editingId && catalog.some((item) => item.id === id)) {
      toast.error("A product with that name already exists.");
      return;
    }

    const compareAt = Number(form.compareAt);
    const product: Product = {
      id,
      name: form.name.trim(),
      tagline: form.tagline.trim() || form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price,
      ...(form.compareAt && !Number.isNaN(compareAt) && compareAt > price ? { compareAt } : {}),
      rating: existing?.rating ?? 4.8,
      reviews: existing?.reviews ?? 0,
      delivery: form.delivery.trim() || "Instant download",
      ...(existing?.featured ? { featured: true } : {}),
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=1200&q=80",
      includes: form.includes
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };

    saveProduct(product);
    toast.success(editingId ? `${product.name} updated` : `${product.name} added`);
    setOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Catalogue</h1>
          <p className="mt-3 text-muted-foreground">
            {catalog.length} products. Changes are saved in this browser and appear across the store
            immediately.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              resetCatalog();
              toast.success("Catalogue reset to defaults");
            }}
          >
            <RotateCcw className="size-4" /> Reset
          </Button>
          <Button className="gap-2" onClick={startCreate}>
            <Plus className="size-4" /> New product
          </Button>
        </div>
      </div>

      <div className="mt-10 overflow-x-auto rounded-sm border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-secondary/60 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Delivery</th>
              <th className="px-5 py-3 text-right font-medium">Price</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {catalog.map((product) => (
              <tr key={product.id}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt=""
                      loading="lazy"
                      className="size-10 rounded-sm object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{product.tagline}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 capitalize text-muted-foreground">{product.category}</td>
                <td className="px-5 py-3 text-muted-foreground">{product.delivery}</td>
                <td className="px-5 py-3 text-right tabular-nums">{formatPrice(product.price)}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${product.name}`}
                      onClick={() => startEdit(product)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${product.name}`}
                      onClick={() => {
                        deleteProduct(product.id);
                        toast.success(`${product.name} removed`);
                      }}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {catalog.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center text-muted-foreground">
                  The catalogue is empty. Add a product or reset to the defaults.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingId ? "Edit product" : "New product"}
            </DialogTitle>
            <DialogDescription>
              Fields marked with a price and name are required; everything else has a sensible
              default.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="p-name">Name</Label>
                <Input
                  id="p-name"
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-category">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value as Category })}
                >
                  <SelectTrigger id="p-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-tagline">Tagline</Label>
              <Input
                id="p-tagline"
                value={form.tagline}
                onChange={(event) => setForm({ ...form, tagline: event.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-description">Description</Label>
              <Textarea
                id="p-description"
                rows={4}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="p-price">Price (USD)</Label>
                <Input
                  id="p-price"
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-compare">Compare at</Label>
                <Input
                  id="p-compare"
                  type="number"
                  min="0"
                  step="1"
                  value={form.compareAt}
                  onChange={(event) => setForm({ ...form, compareAt: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-delivery">Delivery</Label>
                <Input
                  id="p-delivery"
                  value={form.delivery}
                  onChange={(event) => setForm({ ...form, delivery: event.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-image">Image URL</Label>
              <Input
                id="p-image"
                value={form.image}
                onChange={(event) => setForm({ ...form, image: event.target.value })}
                placeholder="https://…"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="p-includes">What's included (one per line)</Label>
              <Textarea
                id="p-includes"
                rows={4}
                value={form.includes}
                onChange={(event) => setForm({ ...form, includes: event.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingId ? "Save changes" : "Add product"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
