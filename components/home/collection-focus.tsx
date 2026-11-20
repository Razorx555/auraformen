"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { FragranceVisual } from "@/components/products/fragrance-visual";
import { AddToBag } from "@/components/products/add-to-bag";
import { Eyebrow, Price } from "@/components/ui/brand";
import { fragrances, fragranceOrder } from "@/data/fragrances";
import { getProduct } from "@/data/products";
import { storeConfig } from "@/data/store-config";
import { cn } from "@/lib/format";
import type { FragranceId } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Coleção interativa + Product Focus + Ambientação dinâmica:
 * ao alternar a fragrância, a atmosfera da seção inteira muda.
 */
export function CollectionFocus() {
  const [active, setActive] = useState<FragranceId>("halo");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const f = fragrances[active];
  const product = getProduct(active)!;
  const variant = product.variants[0];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + fragranceOrder.length) % fragranceOrder.length;
    setActive(fragranceOrder[next]);
    tabs.current[next]?.focus();
  };

  return (
    <section
      data-aura={active}
      aria-labelledby="focus-title"
      className="relative isolate overflow-hidden py-24 transition-colors duration-[1.2s] md:py-32"
      style={{ backgroundColor: f.palette.base }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <AnimatePresence>
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(60% 70% at 28% 50%, ${f.palette.accent}2e, transparent 70%), radial-gradient(40% 50% at 85% 15%, ${f.palette.deep}55, transparent 70%)`,
            }}
          />
        </AnimatePresence>
        <div className="hairline absolute inset-x-0 top-0" />
      </div>

      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Coleção interativa</Eyebrow>
            <h2 id="focus-title" className="t-h2 mt-5">
              Escolha um universo.
            </h2>
          </div>
          <div role="tablist" aria-label="Fragrâncias" className="flex gap-1 rounded-full border border-white/10 bg-ink/30 p-1 backdrop-blur">
            {fragranceOrder.map((id, i) => (
              <button
                key={id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`tab-${id}`}
                aria-selected={active === id}
                aria-controls="focus-panel"
                tabIndex={active === id ? 0 : -1}
                onClick={() => setActive(id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "relative min-h-11 rounded-full px-4 font-display text-xs font-semibold tracking-[0.22em] transition-colors sm:px-6",
                  active === id ? "text-ink" : "text-chrome hover:text-paper",
                )}
              >
                {active === id && (
                  <motion.span layoutId="focus-pill" className="absolute inset-0 rounded-full bg-paper" transition={{ duration: 0.5, ease }} />
                )}
                <span className="relative">{fragrances[id].name}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          id="focus-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:gap-20"
        >
          <div className="relative mx-auto w-full max-w-[460px]">
            <div aria-hidden className="absolute -inset-10 rounded-full opacity-70 blur-3xl transition-colors duration-1000" style={{ background: `radial-gradient(closest-side, ${f.palette.accent}40, transparent)` }} />
            <div className="chrome-border relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[32px]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease }}
                >
                  <FragranceVisual id={active} sizes="(max-width: 768px) 90vw, 460px" className="absolute inset-0" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease }}
            >
              <p className="t-eyebrow text-accent">{f.concept.join(" · ")}</p>
              <h3 className="t-h2 mt-5 max-w-[16ch]">{f.headline}</h3>
              <div className="mt-6 max-w-lg space-y-4">
                {f.story.map((p) => (
                  <p key={p} className="t-body text-chrome/85">
                    {p}
                  </p>
                ))}
              </div>
              <p className="t-name mt-8 text-sm text-paper">{f.signature}</p>

              <dl className="mt-8 grid grid-cols-3 border-y border-white/10 py-5 text-center">
                {[
                  ["Categoria", product.category],
                  ["Volume", `${product.volumeMl} ml`],
                  ["Coleção", "Signature"],
                ].map(([k, v]) => (
                  <div key={k} className="px-2 [&+&]:border-l [&+&]:border-white/10">
                    <dt className="t-eyebrow text-[0.58rem] text-steel">{k}</dt>
                    <dd className="mt-2 font-display text-sm uppercase tracking-wider">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                {storeConfig.mode === "live" && (
                  <>
                    <Price value={variant.price} compareAt={variant.compareAtPrice} demo={product.demo} className="text-2xl" />
                    <AddToBag handle={active} className="sm:ml-auto sm:w-auto" />
                  </>
                )}
                <Link href={`/fragrancias/${active}`} className="btn btn-ghost">
                  Ver detalhes <ArrowRight className="size-4" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
