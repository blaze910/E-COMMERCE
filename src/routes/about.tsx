import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the studio — NovaEdge" },
      {
        name: "description",
        content:
          "NovaEdge is a small commerce studio selling the design, branding and engineering work teams repeat on every launch — at fixed prices.",
      },
      { property: "og:title", content: "About the studio — NovaEdge" },
      {
        property: "og:description",
        content: "A small commerce studio selling launch work at fixed prices.",
      },
    ],
  }),
  component: AboutPage,
});

const STEPS = [
  {
    title: "Pick a kit",
    body: "Every product lists its price, delivery time and exactly what arrives. No discovery call needed to get a number.",
  },
  {
    title: "We deliver",
    body: "Downloads land immediately. Bespoke work starts within two business days and ships on the stated schedule.",
  },
  {
    title: "Two revision rounds",
    body: "Bespoke items include two rounds of feedback so the result fits your product rather than a template.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-16">
      <p className="eyebrow">About</p>
      <h1 className="mt-3 text-balance text-4xl sm:text-5xl">
        We sell the work every launch repeats.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        NovaEdge started because the same requests kept arriving: a brand system, a set of interface
        blocks that convert, a pricing page that stops leaking, an analytics setup nobody wants to
        wire again. Rather than quoting the same project over and over, we packaged it.
      </p>

      <div className="mt-14 grid gap-px overflow-hidden rounded-sm border bg-border sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <div key={step.title} className="bg-background p-7">
            <span className="font-display text-3xl text-primary">0{index + 1}</span>
            <p className="mt-3 font-medium">{step.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-3xl">What we care about</h2>
      <ul className="mt-6 space-y-4 text-muted-foreground">
        <li>
          <span className="font-medium text-foreground">Public pricing.</span> If we can't put a
          number on it, it isn't a product yet.
        </li>
        <li>
          <span className="font-medium text-foreground">Finished, not decorative.</span> Files ship
          organised, named, and documented well enough to hand to an engineer.
        </li>
        <li>
          <span className="font-medium text-foreground">Small scope, fast turnaround.</span> We would
          rather ship one tight deliverable in a week than a retainer that drifts for a quarter.
        </li>
      </ul>

      <div className="mt-14 rounded-sm border bg-secondary/40 p-8 text-center">
        <p className="font-display text-2xl">Not sure which kit fits?</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Send us a short note about the launch and we'll reply with a recommendation.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/contact">Contact the studio</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/products">See all products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
