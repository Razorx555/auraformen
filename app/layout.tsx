import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/manrope";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { Footer } from "@/components/layout/footer";
import { IntroOverlay, introScript } from "@/components/animations/intro";
import { brand, storeConfig } from "@/data/store-config";
import { JsonLd } from "@/components/ui/json-ld";

export const metadata: Metadata = {
  metadataBase: new URL(storeConfig.siteUrl),
  title: {
    default: "AURA FOR MEN — Sua presença tem uma aura",
    template: "%s | AURA FOR MEN",
  },
  description:
    "AURA FOR MEN Signature Series: três body splashes masculinos de 200 ml — HALO, EMBER e ECLIPSE. Três universos. Descubra qual combina com a sua presença.",
  applicationName: "AURA FOR MEN",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "AURA FOR MEN",
    images: [{ url: "/images/brand/logo-fundo-preto.jpg", width: 1600, height: 900, alt: "AURA FOR MEN" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-dvh bg-ink text-paper">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-paper focus:px-5 focus:py-3 focus:text-ink"
        >
          Pular para o conteúdo
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: brand.name,
            url: storeConfig.siteUrl,
            logo: `${storeConfig.siteUrl}${brand.logo.src}`,
            slogan: brand.signature,
            ...(storeConfig.social.length ? { sameAs: storeConfig.social.map((s) => s.url) } : {}),
          }}
        />
        <IntroOverlay />
        <Providers>
          <main id="conteudo">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
