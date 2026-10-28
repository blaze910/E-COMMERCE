import { Suspense } from "react";

import ProductsPage from "@/components/pages/products";

export const metadata = {
  title: "All products — NovaEdge Studio",
  description:
    "Browse every NovaEdge product: UI toolkits, brand kits, strategy sessions, audits and engineering starters, with clear pricing and delivery times.",
};

export default function Products() {
  return (
    <Suspense>
      <ProductsPage />
    </Suspense>
  );
}
