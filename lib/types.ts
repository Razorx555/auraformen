/**
 * Tipos centrais da AURA FOR MEN.
 * Espelham o formato da Shopify Storefront API para que a camada de dados
 * local (data/) possa ser trocada pela Shopify sem refazer o front-end.
 */

export type FragranceId = "halo" | "ember" | "eclipse";

export type Money = {
  /** Valor em reais, ex.: 89.9 */
  amount: number;
  currencyCode: "BRL";
};

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** object-position usado em recortes (mantém o frasco no quadro) */
  focal?: string;
  /** true somente para imagens oficiais fornecidas pela marca */
  official: boolean;
};

export type Palette = {
  accent: string;
  deep: string;
  soft: string;
  metal: string;
  /** cor de fundo da atmosfera */
  base: string;
};

export type Fragrance = {
  id: FragranceId;
  name: string;
  /** frase impressa no rótulo oficial */
  tagline: string;
  concept: string[];
  headline: string;
  story: string[];
  signature: string;
  cta: string;
  cardHint: string;
  palette: Palette;
  /** atributos de proposta estética — NÃO é pirâmide olfativa */
  aesthetic: { atmosfera: string; estilo: string; identidade: string };
  /** Notas olfativas: ficam null até a marca fornecer dados reais. */
  notes: { topo: string[]; coracao: string[]; fundo: string[] } | null;
  /** Modo de uso: null até ser fornecido oficialmente. */
  usage: string | null;
};

export type ProductVariant = {
  id: string;
  sku: string;
  title: string;
  price: Money;
  /** Preço "de" — só preencher com oferta real e vigente. */
  compareAtPrice: Money | null;
  availableForSale: boolean;
  /** null = estoque não informado pela fonte comercial */
  quantityAvailable: number | null;
};

export type Product = {
  id: string;
  handle: string;
  kind: "single" | "kit";
  fragranceId?: FragranceId;
  title: string;
  fullName: string;
  category: string;
  volumeMl: number;
  description: string;
  images: ImageAsset[];
  /** Mídias futuras: frontal, lateral, detalhe, ambiente, vídeo. */
  videoUrl?: string | null;
  variants: ProductVariant[];
  /** true enquanto preço/estoque/SKU forem de demonstração */
  demo: boolean;
};

export type KitRule =
  | { type: "fixed"; components: FragranceId[] }
  | { type: "choose"; count: number; from: FragranceId[] };

export type Kit = {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  description: string;
  rule: KitRule;
  /** Preço próprio do kit. null = soma dos componentes. */
  price: Money | null;
  sku: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  demo: boolean;
  seasonal?: boolean;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productHandles: string[];
};

export type CartLineAttribute = { key: string; value: string };

export type CartLine = {
  /** id único da linha (variante + atributos) */
  id: string;
  merchandiseId: string;
  kind: "single" | "kit";
  handle: string;
  title: string;
  variantTitle: string;
  imageSrc: string;
  imageAlt: string;
  unitPrice: Money;
  quantity: number;
  attributes: CartLineAttribute[];
  maxQuantity: number;
  demo: boolean;
};

export type Cart = {
  lines: CartLine[];
  updatedAt: number;
};

export type QuizOption = {
  id: "a" | "b" | "c";
  label: string;
  points: FragranceId;
  visual?: FragranceId;
};

export type QuizQuestion = {
  id: string;
  step: number;
  question: string;
  visual: boolean;
  options: QuizOption[];
};

export type QuizResult = {
  fragranceId: FragranceId;
  title: string;
  description: string;
  scores: Record<FragranceId, number>;
  tieBreak: boolean;
};

export type StoreMode = "prelaunch" | "live";

export type StoreConfig = {
  mode: StoreMode;
  /** Dados comerciais (preço, estoque, SKU) ainda são de demonstração */
  demoCommerce: boolean;
  siteUrl: string;
  launchDate: string | null;
  maxQuantityPerLine: number;
  shopify: { configured: boolean; missing: string[] };
  newsletterConfigured: boolean;
  contactConfigured: boolean;
  coupons: { code: string; description: string }[];
  company: {
    legalName: string | null;
    cnpj: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
    serviceHours: string | null;
  };
  social: { label: string; url: string }[];
};
