import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iveta Clarke – Rozhovor s přesahem",
  description:
    "Profesionální kouč, mentor a supervizor. Poskytuji podporu zralým lidem v labyrintu přechodových životních fází.",
  openGraph: {
    title: "Iveta Clarke – Rozhovor s přesahem",
    description:
      "Profesionální kouč, mentor a supervizor s více než 25 lety zkušeností.",
    url: "https://ivetaclarke.com",
    siteName: "Iveta Clarke",
    locale: "cs_CZ",
    type: "website",
  },
  metadataBase: new URL("https://ivetaclarke.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
