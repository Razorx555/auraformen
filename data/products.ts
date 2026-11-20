import type { Collection, Kit, Product } from "@/lib/types";
import { fragranceImages, fragrances, fragranceOrder } from "./fragrances";

/**
 * CATÁLOGO LOCAL (DEMONSTRAÇÃO)
 * ---------------------------------------------------------------
 * Preços, SKUs e estoque abaixo são DEMONSTRATIVOS e aparecem marcados
 * como tal na interface enquanto storeConfig.demoCommerce = true.
 * Com a Shopify configurada, lib/commerce substitui estes dados pelos reais.
 *
 * Fatos verificados (rótulo oficial): Body Splash · 200 ml (6,76 fl. oz.) ·
 * Signature Series · frasco preto com válvula spray.
 */

const DEMO_UNIT_PRICE = 89.9; // ← substituir pelo preço oficial

const descriptions: Record<string, string> = {
  halo: "Body splash masculino da Signature Series. HALO traduz um universo leve, luminoso e contemporâneo, para quem prefere uma elegância natural. Frasco preto de 200 ml com válvula spray.",
  ember: "Body splash masculino da Signature Series. EMBER traduz um universo quente, profundo e envolvente, para quem assume o próprio estilo com intensidade. Frasco preto de 200 ml com válvula spray.",
  eclipse: "Body splash masculino da Signature Series. ECLIPSE traduz um universo de contraste e mistério, para quem prefere marcar presença sem excessos. Frasco preto de 200 ml com válvula spray.",
};

export const products: Product[] = fragranceOrder.map((id) => {
  const f = fragrances[id];
  return {
    id: `prod-${id}`,
    handle: id,
    kind: "single",
    fragranceId: id,
    title: f.name,
    fullName: `AURA FOR MEN ${f.name} Body Splash 200 ml`,
    category: "Body Splash",
    volumeMl: 200,
    description: descriptions[id],
    images: [fragranceImages[id]],
    videoUrl: null,
    variants: [
      {
        id: `var-${id}-200`,
        sku: `DEMO-AFM-${f.name}-200`,
        title: "200 ml",
        price: { amount: DEMO_UNIT_PRICE, currencyCode: "BRL" },
        compareAtPrice: null,
        availableForSale: true,
        quantityAvailable: null,
      },
    ],
    demo: true,
  };
});

export const kits: Kit[] = [
  {
    id: "kit-signature-trio",
    handle: "signature-trio",
    title: "SIGNATURE TRIO",
    subtitle: "HALO + EMBER + ECLIPSE",
    description:
      "A coleção completa em um só gesto. Três universos para acompanhar cada versão do seu estilo, do dia mais leve à noite mais intensa.",
    rule: { type: "fixed", components: ["halo", "ember", "eclipse"] },
    // null = preço igual à soma das unidades. Só defina um valor menor se a
    // condição for real; a economia é calculada automaticamente.
    price: null,
    sku: "DEMO-AFM-TRIO",
    availableForSale: true,
    quantityAvailable: null,
    demo: true,
  },
  {
    id: "kit-duo",
    handle: "duo",
    title: "DUO SIGNATURE",
    subtitle: "Escolha duas fragrâncias",
    description:
      "Dois universos, uma assinatura. Combine as fragrâncias que mais conversam com a sua rotina.",
    rule: { type: "choose", count: 2, from: ["halo", "ember", "eclipse"] },
    price: null,
    sku: "DEMO-AFM-DUO",
    availableForSale: true,
    quantityAvailable: null,
    demo: true,
  },
  // Combos sazonais e edições especiais: adicionar aqui com seasonal: true.
];

export const collections: Collection[] = [
  {
    id: "col-signature-series",
    handle: "signature-series",
    title: "Signature Series",
    description: "Três fragrâncias. Três universos. Uma identidade que é só sua.",
    productHandles: ["halo", "ember", "eclipse"],
  },
];

export const getProduct = (handle: string) => products.find((p) => p.handle === handle);
export const getKit = (handle: string) => kits.find((k) => k.handle === handle);
