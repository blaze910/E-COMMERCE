import ProductDetail from "@/components/pages/product-detail";

export async function generateMetadata({ params }) {
  const { productId } = await params;
  const title = productId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    title: `${title} — NovaEdge Studio`,
    description: `${title} from the NovaEdge catalogue: what is included, delivery time, and pricing.`,
    openGraph: {
      title: `${title} — NovaEdge Studio`,
      description: `${title}: what is included, delivery time, and pricing.`,
    },
  };
}

export default function Product() {
  return <ProductDetail />;
}
