export type Category = "design" | "branding" | "strategy" | "development";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: Category;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  delivery: string;
  featured?: boolean;
  image: string;
  includes: string[];
};

export const CATEGORIES: { value: Category; label: string; blurb: string }[] = [
  { value: "design", label: "Design", blurb: "Interface systems and production-ready layouts." },
  { value: "branding", label: "Branding", blurb: "Identity, voice, and launch-ready brand assets." },
  { value: "strategy", label: "Strategy", blurb: "Research, positioning, and growth planning." },
  { value: "development", label: "Development", blurb: "Engineering kits that shorten delivery time." },
];

export const PRODUCTS: Product[] = [
  {
    id: "executive-branding-kit",
    name: "Executive Branding Kit",
    tagline: "A complete identity system, ready on day one.",
    description:
      "Everything a founding team needs to present a credible brand: logo suite, colour and type scales, stationery, pitch templates, and a written usage guide that keeps the identity consistent as the team grows.",
    category: "branding",
    price: 199,
    compareAt: 279,
    rating: 4.9,
    reviews: 218,
    delivery: "Instant download",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "Logo suite in SVG, PNG and PDF",
      "Colour and typography scales",
      "Stationery and social templates",
      "28-page brand usage guide",
    ],
  },
  {
    id: "conversion-ui-toolkit",
    name: "Conversion UI Toolkit",
    tagline: "Checkout patterns that have been tested on real traffic.",
    description:
      "A library of 140 interface blocks built around buying decisions: product grids, comparison tables, trust panels, and a three-step checkout that reduces abandonment. Delivered as Figma components and Tailwind markup.",
    category: "design",
    price: 149,
    rating: 4.8,
    reviews: 341,
    delivery: "Instant download",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "140 Figma components",
      "Matching Tailwind markup",
      "Light and dark themes",
      "Accessibility annotations",
    ],
  },
  {
    id: "go-to-market-session",
    name: "Go-to-Market Session",
    tagline: "Two working sessions with a written launch plan.",
    description:
      "A pair of ninety-minute sessions covering audience, pricing, channel mix, and launch sequence, followed by a written plan with owners and dates so the work starts the next morning.",
    category: "strategy",
    price: 299,
    rating: 5,
    reviews: 96,
    delivery: "Booked within 5 days",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "2 × 90 minute working sessions",
      "Positioning and pricing review",
      "12-week launch calendar",
      "Session recordings and notes",
    ],
  },
  {
    id: "landing-page-teardown",
    name: "Landing Page Teardown",
    tagline: "A line-by-line review of the page that earns your revenue.",
    description:
      "We record a full walkthrough of your landing page, rank every issue by revenue impact, and hand back annotated screens plus rewritten copy for the hero, proof, and call to action.",
    category: "design",
    price: 129,
    compareAt: 169,
    rating: 4.7,
    reviews: 187,
    delivery: "3 business days",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "40 minute recorded walkthrough",
      "Annotated screen mockups",
      "Rewritten hero and CTA copy",
      "Prioritised fix list",
    ],
  },
  {
    id: "product-launch-visuals",
    name: "Product Launch Visuals",
    tagline: "Campaign artwork for the week that matters most.",
    description:
      "A coordinated set of launch assets: announcement graphics, device mockups, short-form video templates, and email headers, all built from one layout grid so the campaign reads as a single piece.",
    category: "branding",
    price: 179,
    rating: 4.6,
    reviews: 142,
    delivery: "Instant download",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "32 announcement graphics",
      "Device and packaging mockups",
      "Motion templates for reels",
      "Email header set",
    ],
  },
  {
    id: "customer-journey-audit",
    name: "Customer Journey Audit",
    tagline: "Find where buyers quietly give up.",
    description:
      "We map every step from first visit to repeat order, run moderated tests with five people in your audience, and return a friction report with the fixes ordered by how much revenue each one recovers.",
    category: "strategy",
    price: 239,
    rating: 4.9,
    reviews: 74,
    delivery: "7 business days",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "Full journey map",
      "5 moderated user tests",
      "Friction report with fixes",
      "Follow-up review call",
    ],
  },
  {
    id: "storefront-starter",
    name: "Storefront Starter Codebase",
    tagline: "A production storefront you can hand to your engineers.",
    description:
      "A typed React storefront with catalogue, cart, checkout, and order history already wired up, plus deployment notes. It is the same foundation we use on client builds, stripped of client-specific work.",
    category: "development",
    price: 349,
    compareAt: 449,
    rating: 4.8,
    reviews: 63,
    delivery: "Instant download",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "Typed React + Tailwind codebase",
      "Cart, checkout and order history",
      "Admin catalogue screen",
      "Deployment and handover notes",
    ],
  },
  {
    id: "design-token-pipeline",
    name: "Design Token Pipeline",
    tagline: "One source of truth for colour, type and spacing.",
    description:
      "A token setup that exports from Figma to CSS variables and Tailwind theme values in a single command, so design changes reach production without anyone retyping a hex code.",
    category: "development",
    price: 189,
    rating: 4.7,
    reviews: 88,
    delivery: "Instant download",
    image:
      "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "Figma token library",
      "Export script and CI step",
      "Tailwind theme mapping",
      "Migration walkthrough",
    ],
  },
  {
    id: "pricing-page-rebuild",
    name: "Pricing Page Rebuild",
    tagline: "Make the plan comparison obvious in four seconds.",
    description:
      "A rebuilt pricing page: tier structure, feature naming, comparison table, and objection-handling FAQ, delivered as design files and copy you can publish as written.",
    category: "design",
    price: 159,
    rating: 4.6,
    reviews: 121,
    delivery: "5 business days",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "Tier and feature structure",
      "Comparison table design",
      "Final copy, ready to publish",
      "Two revision rounds",
    ],
  },
  {
    id: "brand-voice-guide",
    name: "Brand Voice Guide",
    tagline: "Everyone writes like the same company.",
    description:
      "A written voice guide with tone rules, vocabulary lists, before-and-after rewrites, and ready templates for support replies, release notes, and announcements.",
    category: "branding",
    price: 119,
    rating: 4.5,
    reviews: 158,
    delivery: "Instant download",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "Tone and vocabulary rules",
      "24 before-and-after rewrites",
      "Support and release templates",
      "Editor checklist",
    ],
  },
  {
    id: "retention-playbook",
    name: "Retention Playbook",
    tagline: "Keep the customers you already paid to win.",
    description:
      "A lifecycle plan covering onboarding, first-value moments, win-back offers, and cancellation flows, with the twelve messages written out and a measurement sheet to track each one.",
    category: "strategy",
    price: 209,
    rating: 4.8,
    reviews: 67,
    delivery: "Instant download",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "Lifecycle map",
      "12 written lifecycle messages",
      "Win-back and cancellation flows",
      "Measurement sheet",
    ],
  },
  {
    id: "analytics-instrumentation",
    name: "Analytics Instrumentation Kit",
    tagline: "Trustworthy numbers before you make the next decision.",
    description:
      "An event schema, naming conventions, and a typed tracking client, plus dashboards for funnel, activation, and revenue so the reporting matches what the product actually does.",
    category: "development",
    price: 229,
    rating: 4.7,
    reviews: 54,
    delivery: "Instant download",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    includes: [
      "Event schema and naming rules",
      "Typed tracking client",
      "Funnel and revenue dashboards",
      "QA checklist",
    ],
  },
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}
