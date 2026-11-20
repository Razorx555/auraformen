import type { StoreConfig, StoreMode } from "@/lib/types";

/**
 * CONFIGURAÇÃO CENTRAL DA LOJA
 * ---------------------------------------------------------------
 * Tudo que muda o comportamento comercial do site passa por aqui.
 * As variáveis de ambiente estão documentadas em .env.example.
 *
 * - NEXT_PUBLIC_STORE_MODE = "prelaunch" | "live"
 * - NEXT_PUBLIC_DEMO_COMMERCE = "false" quando preço/estoque vierem da Shopify
 * - NEXT_PUBLIC_LAUNCH_DATE = data ISO real; sem ela não há contagem regressiva
 */

/** Normaliza valores vazios. As chaves precisam ser literais (process.env.NEXT_PUBLIC_X)
 *  para que o Next.js as injete também no navegador. */
const env = (v: string | undefined) => (v && v.trim() !== "" ? v.trim() : null);

const mode: StoreMode =
  process.env.NEXT_PUBLIC_STORE_MODE === "prelaunch" ? "prelaunch" : "live";

const shopifyMissing = [
  !process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN",
  !process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN && "NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN",
].filter(Boolean) as string[];

const socialCandidates: { label: string; url: string | undefined }[] = [
  { label: "Instagram", url: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM },
  { label: "TikTok", url: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK },
  { label: "YouTube", url: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE },
  { label: "Facebook", url: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK },
];

export const storeConfig: StoreConfig = {
  mode,
  demoCommerce: process.env.NEXT_PUBLIC_DEMO_COMMERCE !== "false",
  siteUrl: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  launchDate: env(process.env.NEXT_PUBLIC_LAUNCH_DATE),
  maxQuantityPerLine: 10,
  shopify: { configured: shopifyMissing.length === 0, missing: shopifyMissing },
  newsletterConfigured: Boolean(env(process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED)),
  contactConfigured: Boolean(env(process.env.NEXT_PUBLIC_CONTACT_ENABLED)),
  /** Cupons só existem quando houver regra real. Validação final na Shopify. */
  coupons: [],
  company: {
    legalName: env(process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME),
    cnpj: env(process.env.NEXT_PUBLIC_COMPANY_CNPJ),
    address: env(process.env.NEXT_PUBLIC_COMPANY_ADDRESS),
    phone: env(process.env.NEXT_PUBLIC_COMPANY_PHONE),
    email: env(process.env.NEXT_PUBLIC_COMPANY_EMAIL),
    whatsapp: env(process.env.NEXT_PUBLIC_COMPANY_WHATSAPP),
    serviceHours: env(process.env.NEXT_PUBLIC_COMPANY_SERVICE_HOURS),
  },
  social: socialCandidates
    .map((s) => ({ label: s.label, url: s.url ?? "" }))
    .filter((s) => s.url.startsWith("https://")),
};

export const brand = {
  name: "AURA FOR MEN",
  concept: "AURA — THE ART OF PRESENCE",
  signature: "THE ART OF PRESENCE.",
  collection: "Signature Series",
  logo: {
    src: "/images/brand/logo.png",
    width: 1439,
    height: 375,
    alt: "AURA FOR MEN",
  },
  symbol: {
    src: "/images/brand/simbolo.png",
    width: 1035,
    height: 798,
    alt: "Símbolo AURA",
  },
};
