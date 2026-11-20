import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { DuoBuilder, KitTrioFeature } from "@/components/products/kit-feature";
import { Reveal } from "@/components/animations/reveal";
import { kits } from "@/data/products";

export const metadata: Metadata = {
  title: "Kits e combinações",
  description: "Signature Trio e Duo Signature: combine os universos HALO, EMBER e ECLIPSE da AURA FOR MEN.",
  alternates: { canonical: "/kits" },
};

export default function KitsPage() {
  const seasonal = kits.filter((k) => k.seasonal);
  return (
    <>
      <PageHeader
        eyebrow="Kits e combinações"
        title={["Uma aura para", <span key="k" className="text-chrome">cada versão sua.</span>]}
        lead="Explore a coleção completa e escolha as fragrâncias que acompanham cada momento do seu estilo."
      />
      <section className="pb-24 md:pb-36">
        <div className="container-x space-y-10 md:space-y-16">
          <Reveal>
            <KitTrioFeature />
          </Reveal>
          <Reveal>
            <DuoBuilder />
          </Reveal>
          {seasonal.length > 0 && (
            <div>
              <h2 className="t-h2">Edições sazonais</h2>
              <ul className="mt-8 grid gap-6 md:grid-cols-2">
                {seasonal.map((k) => (
                  <li key={k.id} className="chrome-border rounded-3xl bg-graphite p-8">
                    <h3 className="t-h3">{k.title}</h3>
                    <p className="t-body mt-3">{k.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
