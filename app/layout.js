import "./globals.css";

import AppProviders from "./providers";

export const metadata = {
  title: "NovaEdge Studio — Commerce design, branding and build kits",
  description:
    "Design, branding and engineering kits for modern commerce teams.",
  authors: [{ name: "NovaEdge Studio" }],
  openGraph: {
    title: "NovaEdge Studio",
    description:
      "Design, branding and engineering kits for modern commerce teams.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
