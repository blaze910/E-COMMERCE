# NovaEdge Studio — storefront

A rebuilt version of the original NovaEdge e-commerce site: a modern storefront with a
catalogue, search and filtering, a slide-out bag, checkout with discount codes, persistent
order history, and a working catalogue admin panel.

## What's included

| Page | Path | Purpose |
| --- | --- | --- |
| Home | `/` | Hero, trust points, featured products, category entry points |
| Products | `/products` | Search, category filters, sorting, product grid |
| Product detail | `/products/:id` | Full description, what's included, quantity, buy now, related items |
| Checkout | `/checkout` | Customer details, discount codes, tax, order confirmation |
| Orders | `/dashboard` | Persistent order history with totals and status |
| Admin | `/admin` | Add, edit, delete products; reset the catalogue |
| About | `/about` | How the studio works |
| Contact | `/contact` | Enquiry form and studio details |

## Fixes over the original

- Added the admin interface the original README advertised but never shipped.
- Replaced the "rhyme" search matcher with weighted relevance scoring across name, tagline,
  category, description and deliverables.
- Replaced 100 duplicated mock products with 12 curated products that have real copy,
  pricing, delivery times and inclusion lists.
- Orders are now created, stored and listed instead of being a hardcoded empty state.
- Replaced `alert()` checkout with a real checkout flow, discount codes, tax and a receipt.
- Added a mobile navigation drawer and responsive layouts throughout.
- Removed dead external links and the no-op contact form stub.

## Tech

React 19, TanStack Start / Router, Vite 7, Tailwind CSS v4, shadcn-style UI components.
Cart, orders and catalogue persist in `localStorage` (`novaedge:cart`, `novaedge:orders`,
`novaedge:catalog`) — there is no payment processor wired up, so checkout records orders
locally rather than charging a card.

## Running it

```bash
npm install
npm run dev     # http://localhost:8080
npm run build   # production build
```

## Discount codes

- `NOVA10` — 10% off
- `LAUNCH20` — 20% off
