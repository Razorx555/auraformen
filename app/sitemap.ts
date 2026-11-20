import type { MetadataRoute } from "next";
import { storeConfig } from "@/data/store-config";
import { fragranceOrder } from "@/data/fragrances";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = storeConfig.siteUrl;
  const routes = [
    ["", 1],
    ["/colecao", 0.9],
    ...fragranceOrder.map((id) => [`/fragrancias/${id}`, 0.9] as const),
    ["/descubra-sua-aura", 0.8],
    ["/kits", 0.8],
    ["/sobre", 0.6],
    ["/contato", 0.5],
    ["/faq", 0.5],
    ["/politica-de-privacidade", 0.3],
    ["/termos-de-uso", 0.3],
    ["/trocas-e-devolucoes", 0.3],
    ["/entrega", 0.3],
  ] as const;
  return routes.map(([path, priority]) => ({ url: `${base}${path}`, priority }));
}
