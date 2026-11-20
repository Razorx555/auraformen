"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { AddToBag } from "./add-to-bag";
import { FragranceVisual } from "./fragrance-visual";
import { Eyebrow, Price } from "@/components/ui/brand";
import { Reveal } from "@/components/animations/reveal";
import { fragrances, fragranceOrder } from "@/data/fragrances";
import { getKit } from "@/data/products";
import { storeConfig } from "@/data/store-config";
import { formatMoney, kitPricing, cn } from "@/lib/format";
import type { FragranceId } from "@/lib/types";

/** Destaque do SIGNATURE TRIO — apresentação valorizada, preço e economia reais. */
export function KitTrioFeature({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" }) {
  const kit = getKit("signature-trio")!;
  const selection = kit.rule.type === "fixed" ? kit.rule.components : fragranceOrder;
  const { price, componentsTotal, savings } = kitPricing(kit, selection);
  const H = headingLevel;

  return (
    <div className="chrome-border relative isolate overflow-hidden rounded-[32px] bg-graphite">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(40%_70%_at_15%_60%,rgba(143,202,255,0.14),transparent),radial-gradient(40%_70%_at_50%_80%,rgba(197,197,208,0.1),transparent),radial-gradient(40%_70%_at_85%_60%,rgba(242,138,48,0.14),transparent)]" />
      <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:p-16">
        <Reveal className="relative mx-auto flex h-[340px] w-full max-w-[520px] items-end justify-center sm:h-[420px]">
          {selection.map((id, i) => (
            <div
              key={id}
              className={cn(
                "overflow-hidden rounded-t-full rounded-b-3xl border border-white/10 shadow-2xl",
                i === 1 ? "relative z-10 h-full w-[40%]" : "absolute bottom-0 h-[82%] w-[34%]",
                i === 0 && "left-[4%] -rotate-3",
                i === 2 && "right-[4%] rotate-3",
              )}
            >
              <FragranceVisual id={id} sizes="(max-width: 640px) 40vw, 220px" className="h-full w-full" />
            </div>
          ))}
        </Reveal>
        <div>
          <Eyebrow>Uma aura para cada versão sua</Eyebrow>
          <H className="t-display mt-6">{kit.title}</H>
          <p className="t-name mt-3 text-sm text-chrome">{kit.subtitle}</p>
          <p className="t-body mt-6 max-w-md">{kit.description}</p>
          <p className="t-body mt-3 max-w-md text-sm">
            Explore a coleção completa e escolha a fragrância que acompanha cada momento do seu estilo.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {selection.map((id) => (
              <li key={id} data-aura={id} className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em]">
                <span className="size-1.5 rounded-full bg-accent" /> {fragrances[id].name}
              </li>
            ))}
          </ul>
          {storeConfig.mode === "live" ? (
            <>
              <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <Price value={price} demo={kit.demo} className="text-3xl" />
                {savings ? (
                  <span className="text-sm text-accent">
                    Economia de {formatMoney(savings)} em relação às unidades ({formatMoney(componentsTotal)})
                  </span>
                ) : (
                  <span className="text-sm text-steel">3 × 200 ml</span>
                )}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <AddToBag kit={kit.handle} selection={selection} label="Adicionar o trio" />
                <Link href="/kits" className="btn btn-ghost">
                  Montar um duo <ArrowRight className="size-4" />
                </Link>
              </div>
            </>
          ) : (
            <Link href="/kits" className="btn btn-ghost mt-8">
              Conhecer os kits <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/** Montador de DUO: o cliente escolhe duas fragrâncias diferentes. */
export function DuoBuilder() {
  const kit = getKit("duo")!;
  const count = kit.rule.type === "choose" ? kit.rule.count : 2;
  const [selected, setSelected] = useState<FragranceId[]>(["halo", "eclipse"]);
  const toggle = (id: FragranceId) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= count ? [...prev.slice(1), id] : [...prev, id],
    );
  const ordered = fragranceOrder.filter((f) => selected.includes(f));
  const { price, savings, componentsTotal } = kitPricing(kit, ordered);
  const complete = ordered.length === count;

  return (
    <div className="chrome-border rounded-[32px] bg-graphite/70 p-7 sm:p-10 lg:p-14">
      <Eyebrow>Combine dois universos</Eyebrow>
      <h2 className="t-h2 mt-6">{kit.title}</h2>
      <p className="t-body mt-4 max-w-xl">{kit.description}</p>
      <fieldset className="mt-10">
        <legend className="t-eyebrow text-steel">
          Escolha {count} fragrâncias · {ordered.length}/{count}
        </legend>
        <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-5">
          {fragranceOrder.map((id) => {
            const on = selected.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(id)}
                data-aura={id}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border text-left transition-all duration-500",
                  on ? "border-accent" : "border-white/10 opacity-60 hover:opacity-100",
                )}
              >
                <div className="relative aspect-[4/5]">
                  <FragranceVisual id={id} sizes="(max-width: 640px) 30vw, 220px" className="absolute inset-0" decorative />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
                </div>
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 sm:p-4">
                  <span className="font-display text-xs font-semibold tracking-[0.18em] sm:text-sm">{fragrances[id].name}</span>
                  <span className={cn("grid size-6 place-items-center rounded-full border", on ? "border-accent bg-accent text-ink" : "border-white/40")}>
                    {on && <Check className="size-3.5" />}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
      {storeConfig.mode === "live" && (
        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Price value={price} demo={kit.demo} className="text-2xl" />
            <p className="mt-1 text-sm text-steel">
              {complete ? ordered.map((f) => fragrances[f].name).join(" + ") : `Selecione mais ${count - ordered.length}`}
              {savings && ` · economia de ${formatMoney(savings)} sobre ${formatMoney(componentsTotal)}`}
            </p>
          </div>
          <AddToBag kit={kit.handle} selection={ordered} label="Adicionar o duo" className="sm:w-auto" />
        </div>
      )}
    </div>
  );
}
