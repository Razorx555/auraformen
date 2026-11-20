import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ProductCard, ComparisonSection } from "@/components/home/sections";
import { KitTrioFeature } from "@/components/products/kit-feature";
import { Reveal } from "@/components/animations/reveal";
import { fragranceOrder } from "@/data/fragrances";

export const metadata: Metadata = {
  title: "Coleção Signature Series",
  description:
    "HALO, EMBER e ECLIPSE: os três body splashes masculinos de 200 ml da coleção Signature Series da AURA FOR MEN.",
  alternates: { canonical: "/colecao" },
};

export default function CollectionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Signature Series"
        title={["Três fragrâncias.", <span key="c" className="text-chrome">Infinitas formas de ser você.</span>]}
        lead="Três universos para expressar quem você é. Escolha o seu, compare lado a lado ou descubra qual combina com a sua presença."
      />
      <section aria-label="Produtos" className="pb-24 md:pb-32">
        <div className="container-x">
          <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {fragranceOrder.map((id, i) => (
              <Reveal as="li" key={id} delay={i * 0.08}>
                <ProductCard handle={id} headingLevel="h2" />
              </Reveal>
            ))}
          </ul>
          <div className="mt-24">
            <KitTrioFeature />
          </div>
        </div>
      </section>
      <ComparisonSection />
    </>
  );
}
