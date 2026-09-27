import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Clock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact NovaEdge Studio" },
      {
        name: "description",
        content:
          "Tell the NovaEdge studio what you're launching and get a recommendation on which kit fits, usually within one business day.",
      },
      { property: "og:title", content: "Contact NovaEdge Studio" },
      { property: "og:description", content: "Get a recommendation on which kit fits your launch." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSent(true);
    toast.success("Thanks — we'll reply within one business day.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-16">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Tell us what you're launching</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_0.6fr]">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-sm border p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Your name</Label>
              <Input
                id="contact-name"
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Ada Lovelace"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">What are you working on?</Label>
            <Textarea
              id="contact-message"
              required
              rows={6}
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              placeholder="We're relaunching our storefront in March and need the pricing page rebuilt…"
            />
          </div>
          <Button type="submit" size="lg">
            Send message
          </Button>
          {sent && (
            <p className="text-sm text-primary">
              Message received. This demo store logs enquiries locally rather than emailing them.
            </p>
          )}
        </form>

        <aside className="space-y-6">
          {[
            { icon: Mail, title: "Email", body: "hello@novaedge.studio" },
            { icon: Clock, title: "Hours", body: "Mon–Fri, 9:00–17:00 GMT" },
            { icon: MapPin, title: "Where we are", body: "Remote studio, clients worldwide" },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 rounded-sm border bg-secondary/40 p-5">
              <Icon className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
