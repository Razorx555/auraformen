import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { SignatureSeries } from "@/components/home/signature-series";
import { CollectionFocus } from "@/components/home/collection-focus";
import { ComparisonSection, DetailsSection, QuizSection, ShopSection, UniverseSection } from "@/components/home/sections";
import { LaunchSection } from "@/components/home/launch";
import { storeConfig } from "@/data/store-config";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Home — narrativa em seis cenas:
 * 1 Curiosidade (Hero) → 2 Identificação (Signature Series) → 3 Descoberta (Quiz)
 * → 4 Desejo (Coleção interativa + Detalhes) → 5 Escolha (Comparação + Loja/Kits)
 * → 6 Marca (Universo AURA).
 */
export default function Home() {
  const live = storeConfig.mode === "live";
  return (
    <>
      <Hero />
      <SignatureSeries />
      <QuizSection />
      <CollectionFocus />
      <DetailsSection />
      <ComparisonSection />
      {live ? <ShopSection /> : <LaunchSection />}
      <UniverseSection />
    </>
  );
}
