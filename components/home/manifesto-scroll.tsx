"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { BrandSymbol } from "@/components/ui/brand";

const lines = [
  { text: "Existe algo em você que não cabe em uma descrição.", tone: "text-paper" },
  { text: "Não é só o que veste.", tone: "text-steel" },
  { text: "Não é só o que diz.", tone: "text-steel" },
  { text: "Não é apenas como chega.", tone: "text-steel" },
  { text: "É a sua maneira de estar presente.", tone: "text-paper" },
];

function Line({ i, total, progress, text, tone }: { i: number; total: number; progress: MotionValue<number>; text: string; tone: string }) {
  const start = 0.06 + (i / (total + 1)) * 0.72;
  const opacity = useTransform(progress, [start, start + 0.08], [0.08, 1]);
  const y = useTransform(progress, [start, start + 0.1], [18, 0]);
  const blur = useTransform(progress, [start, start + 0.08], ["blur(6px)", "blur(0px)"]);
  return (
    <motion.p style={{ opacity, y, filter: blur }} className={`font-display text-[clamp(1.5rem,3.6vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.02em] ${tone}`}>
      {text}
    </motion.p>
  );
}

/**
 * Cena de manifesto conduzida pelo scroll: a página escurece, as frases
 * acendem uma a uma e a palavra AURA se revela no fim.
 * Com movimento reduzido, tudo aparece estático e legível.
 */
export function ManifestoScroll() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const finalOpacity = useTransform(scrollYProgress, [0.78, 0.9], [0, 1]);
  const finalScale = useTransform(scrollYProgress, [0.78, 0.95], [0.94, 1]);
  const symbolOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.04, 0.1, 0.16]);
  const symbolScale = useTransform(scrollYProgress, [0, 1], [1.25, 0.95]);

  if (reduce) {
    return (
      <section aria-label="Manifesto AURA" className="bg-ink py-28">
        <div className="container-x max-w-4xl space-y-5">
          {lines.map((l) => (
            <p key={l.text} className={`font-display text-[clamp(1.5rem,3.6vw,3.25rem)] font-medium leading-[1.12] ${l.tone}`}>
              {l.text}
            </p>
          ))}
          <p className="t-display pt-6">
            A gente chama isso de <span className="text-chrome">AURA.</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="Manifesto AURA" className="relative h-[320vh] bg-ink">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <motion.div aria-hidden style={{ opacity: symbolOpacity, scale: symbolScale }} className="pointer-events-none absolute left-1/2 top-1/2 w-[min(900px,120vw)] -translate-x-1/2 -translate-y-1/2">
          <BrandSymbol sizes="900px" className="h-auto w-full" />
        </motion.div>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,transparent,#050505_80%)]" />
        <div className="container-x relative max-w-5xl space-y-4 md:space-y-5">
          {lines.map((l, i) => (
            <Line key={l.text} i={i} total={lines.length} progress={scrollYProgress} {...l} />
          ))}
          <motion.p style={{ opacity: finalOpacity, scale: finalScale }} className="t-display origin-left pt-6 md:pt-10">
            A gente chama isso de <span className="text-chrome">AURA.</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
