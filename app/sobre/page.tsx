import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, PendingNotice } from "@/components/layout/page-header";
import { Reveal, TextReveal } from "@/components/animations/reveal";
import { BrandSymbol, Eyebrow } from "@/components/ui/brand";
import { FragranceVisual } from "@/components/products/fragrance-visual";
import { fragrances, fragranceOrder } from "@/data/fragrances";

export const metadata: Metadata = {
  title: "Sobre a AURA",
  description:
    "AURA FOR MEN — The Art of Presence. Uma marca de fragrâncias masculinas que transforma a escolha de um perfume em expressão de estilo.",
  alternates: { canonical: "/sobre" },
};

/*
 * HISTÓRIA OFICIAL: substitua o bloco marcado abaixo pelo texto aprovado pela
 * marca. Não incluir data de fundação, fábrica, produção artesanal ou outros
 * fatos sem confirmação.
 */
const officialHistory: string[] | null = null;

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="AURA — The art of presence"
        title={["Presença não", "se explica.", <span key="a" className="text-chrome">Se sente.</span>]}
      />

      <section className="relative overflow-hidden py-20 md:py-32">
        <div aria-hidden className="pointer-events-none absolute -right-[10%] top-0 w-[min(700px,90vw)] opacity-[0.08]">
          <BrandSymbol sizes="700px" className="h-auto w-full" />
        </div>
        <div className="container-x relative grid gap-16 md:grid-cols-[1fr_1fr]">
          <Reveal>
            <Eyebrow>Manifesto</Eyebrow>
            <div className="mt-8 space-y-5 font-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-snug text-paper">
              <p>Existe algo em você que não cabe em uma descrição.</p>
              <p className="text-chrome">
                Não é só o que veste.
                <br />
                Não é só o que diz.
                <br />
                Não é apenas como chega.
              </p>
              <p>É a sua maneira de estar presente.</p>
              <p className="text-chrome">Seu estilo. Seus detalhes. Suas escolhas.</p>
              <p>A gente chama isso de AURA.</p>
            </div>
            <p className="t-name mt-10 text-sm">AURA FOR MEN. Sua presença tem assinatura.</p>
          </Reveal>
          <Reveal delay={0.15} className="md:pt-16">
            <h2 className="t-h3">Não vendemos uma personalidade.</h2>
            <p className="t-lead mt-4">Ajudamos você a expressar a que já tem.</p>
            <p className="t-body mt-6">
              AURA FOR MEN nasceu para transformar a escolha de uma fragrância em uma expressão de estilo. Cada criação da
              Signature Series apresenta um universo próprio, pensado para quem valoriza os detalhes e a maneira como se
              apresenta ao mundo.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="historia" className="py-20 md:py-28">
        <div className="container-x max-w-4xl">
          <Eyebrow>Nossa história</Eyebrow>
          <h2 id="historia" className="t-h2 mt-6">
            O começo de uma assinatura.
          </h2>
          <div className="mt-8 space-y-5">
            {officialHistory ? (
              officialHistory.map((p) => (
                <p key={p} className="t-lead">
                  {p}
                </p>
              ))
            ) : (
              <PendingNotice>
                Espaço reservado para a história oficial da marca. O conteúdo será publicado após aprovação da AURA FOR MEN.
              </PendingNotice>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container-x">
          <TextReveal as="h2" className="t-h2 max-w-3xl" lines={["Três universos.", <span key="t" className="text-chrome">Uma identidade.</span>]} />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {fragranceOrder.map((id) => (
              <li key={id} data-aura={id}>
                <Link href={`/fragrancias/${id}`} className="group block">
                  <div className="chrome-border relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[24px]">
                    <FragranceVisual id={id} sizes="(max-width: 768px) 90vw, 30vw" className="absolute inset-0" imgClassName="transition-transform duration-[1.2s] group-hover:scale-105" decorative />
                  </div>
                  <p className="mt-5 font-display text-2xl font-semibold uppercase tracking-[0.1em]">{fragrances[id].name}</p>
                  <p className="text-sm text-chrome">{fragrances[id].tagline}</p>
                  <span className="btn-link mt-3 text-accent">
                    {fragrances[id].cta} <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
