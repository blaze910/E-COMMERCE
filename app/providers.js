"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/lib/store";

export default function AppProviders({ children }) {
  return (
    <StoreProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <Toaster position="top-center" />
    </StoreProvider>
  );
}
