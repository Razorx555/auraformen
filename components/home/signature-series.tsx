"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { FragranceVisual } from "@/components/products/fragrance-visual";
import { Spotlight } from "@/components/ui/interactive";
import { Reveal, TextReveal } from "@/components/animations/reveal";
import { Eyebrow } from "@/components/ui/brand";
import { fragrances, fragranceOrder } from "@/data/fragrances";
import { cn } from "@/lib/format";

/** Cena 2 — Identificação: três cards como pequenas campanhas. */
export function SignatureSeries() {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(fragranceOrder.length - 1, i));
    const card = el.children[idx] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const w = (el.children[0] as HTMLElement).offsetWidth;
    setActive(Math.round(el.scrollLeft / w));
  };

  return (
    <section id="colecao" aria-labelledby="series-title" className="relative scroll-mt-20 bg-ink py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <Eyebrow>Signature Series</Eyebrow>
            <TextReveal
              as="h2"
              className="t-display mt-6"
              lines={["Não existe uma", "única forma de", <span key="p" className="text-chrome">ter presença.</span>]}
            />
          </div>
          <Reveal delay={0.15}>
            <p className="t-h3 text-chrome/90">Três formas de ser inesquecível.</p>
            <p className="t-body mt-4 max-w-md">
              Descubra a coleção Signature Series e encontre a fragrância que combina com a sua presença.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="container-x mt-14 md:mt-20">
        <ul
          ref={track}
          onScroll={onScroll}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 lg:gap-8"
          aria-label="Fragrâncias da Signature Series"
        >
          {fragranceOrder.map((id, i) => {
            const f = fragrances[id];
            return (
              <li
                key={id}
                data-aura={id}
                className={cn("w-[82vw] max-w-[380px] shrink-0 snap-center md:w-auto md:max-w-none", i === 1 && "md:mt-20")}
              >
                <Reveal delay={i * 0.12} amount={0.15}>
                  <Spotlight as="article" className="group">
                    <Link
                      href={`/fragrancias/${id}`}
                      className="chrome-border relative block overflow-hidden rounded-[28px] bg-graphite"
                      aria-label={`${f.name} — ${f.tagline} ${f.cta}`}
                    >
                      <div className="relative aspect-[4/4.6]">
                        <FragranceVisual
                          id={id}
                          sizes="(max-width: 768px) 82vw, 32vw"
                          className="absolute inset-0"
                          imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_78%,#101114_100%)]" />
                        <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(70%_50%_at_50%_100%,color-mix(in_srgb,var(--aura-accent)_30%,transparent),transparent)]" />
                      </div>
                      <div className="relative p-6 pt-4 md:p-7 md:pt-5">
                        <p className="t-eyebrow text-accent/90 transition-transform duration-700 group-hover:-translate-y-1">
                          {f.cardHint}
                        </p>
                        <h3 className="mt-3 font-display text-[clamp(2.4rem,4vw,3.5rem)] font-semibold uppercase leading-none tracking-[0.04em] transition-transform duration-700 group-hover:-translate-y-1">
                          {f.name}
                        </h3>
                        <p className="mt-2 text-sm text-chrome">{f.tagline}</p>
                        <span className="btn-link mt-5 translate-y-0 opacity-100 transition-all duration-700 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                          {f.cta} <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </Link>
                  </Spotlight>
                </Reveal>
              </li>
            );
          })}
        </ul>

        {/* Controles acessíveis do carrossel (mobile) */}
        <div className="mt-6 flex items-center justify-between md:hidden">
          <div className="flex gap-2" role="group" aria-label="Escolher fragrância">
            {fragranceOrder.map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Ver ${fragrances[id].name}`}
                aria-current={active === i}
                className="grid h-11 min-w-11 place-items-center"
              >
                <span className={cn("block h-[2px] rounded-full transition-all", active === i ? "w-8 bg-paper" : "w-4 bg-steel/50")} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(active - 1)} disabled={active === 0} className="grid size-11 place-items-center rounded-full border border-white/15 disabled:opacity-30" aria-label="Fragrância anterior">
              <ChevronLeft className="size-4" />
            </button>
            <button type="button" onClick={() => go(active + 1)} disabled={active === fragranceOrder.length - 1} className="grid size-11 place-items-center rounded-full border border-white/15 disabled:opacity-30" aria-label="Próxima fragrância">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
