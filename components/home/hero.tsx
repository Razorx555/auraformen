"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { FragranceVisual } from "@/components/products/fragrance-visual";
import { AmbientVideo } from "@/components/products/ambient-video";
import { Magnetic } from "@/components/ui/interactive";
import { useIntroDelay } from "@/components/animations/use-intro-delay";
import type { FragranceId } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

const panels: { id: FragranceId; label: string }[] = [
  { id: "halo", label: "HALO" },
  { id: "eclipse", label: "ECLIPSE" },
  { id: "ember", label: "EMBER" },
];

const particles = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37.7) % 100,
  top: (i * 53.3) % 100,
  size: i % 5 === 0 ? 2 : 1,
  delay: (i % 7) * 0.7,
}));

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const d = useIntroDelay();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });
  const rotY = useTransform(sx, [-1, 1], [-3, 3]);
  const rotX = useTransform(sy, [-1, 1], [2, -2]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    px.set((e.clientX / window.innerWidth) * 2 - 1);
    py.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      aria-labelledby="hero-title"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-16 md:pt-20"
    >
      {/* Atmosfera */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="atmo-drift absolute -left-[20%] top-[10%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(143,202,255,0.16),transparent)] blur-2xl" />
        <div className="atmo-drift absolute -right-[15%] bottom-[0%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(242,138,48,0.13),transparent)] blur-2xl [animation-delay:-6s]" />
        <div className="absolute left-1/2 top-[38%] h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(197,197,208,0.09),transparent)] lg:left-[72%]" />
        <div className="hairline-v absolute left-[8%] top-0 h-full opacity-40" />
        <div className="hairline-v absolute right-[6%] top-0 h-full opacity-30" />
        {particles.map((p, i) => (
          <span
            key={i}
            className="twinkle absolute rounded-full bg-paper"
            style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, animationDelay: `${p.delay}s` }}
          />
        ))}
      </div>

      <div className="container-x relative flex flex-1 flex-col gap-8 pb-8 pt-4 lg:grid lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-10 lg:pb-12 lg:pt-6">
        {/* Composição dos frascos — primeiro no mobile */}
        <motion.div style={{ opacity: fade }} className="relative order-1 lg:order-2" aria-label="As três fragrâncias da Signature Series" role="img">
          <motion.div
            style={{ rotateY: rotY, rotateX: rotX, transformPerspective: 1400 }}
            className="relative mx-auto flex h-[46svh] min-h-[330px] max-w-[560px] items-end justify-center lg:h-[78vh] lg:max-h-[780px] lg:max-w-none"
          >
            {panels.map((p, i) => {
              const center = i === 1;
              return (
                <motion.div
                  key={p.id}
                  style={{ y: center ? yFront : yBack }}
                  className={
                    center
                      ? "relative z-20 h-full w-[52%] lg:w-[44%]"
                      : `absolute bottom-[6%] z-10 h-[78%] w-[40%] lg:w-[34%] ${i === 0 ? "left-0 lg:left-[2%]" : "right-0 lg:right-[2%]"}`
                  }
                >
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 60, scale: 0.96 }}
                    animate={{ opacity: center ? 1 : 0.82, y: 0, scale: 1 }}
                    transition={{ duration: 1.3, ease, delay: d + 0.0 + (center ? 0 : 0.18 + i * 0.05) }}
                    className="h-full w-full"
                  >
                    <div
                      className={`chrome-border relative h-full w-full overflow-hidden rounded-t-[999px] rounded-b-[28px] ${
                        center ? "shadow-[0_40px_120px_-30px_rgba(197,197,208,0.35)]" : ""
                      }`}
                    >
                      <FragranceVisual
                        id={p.id}
                        preload={center}
                        sizes="(max-width: 1024px) 52vw, 26vw"
                        className="absolute inset-0"
                        decorative
                      />
                      <AmbientVideo id={p.id} className="absolute inset-0 h-full w-full object-cover" eager={center} />
                      {!center && <div className="absolute inset-0 bg-ink/25" />}
                    </div>
                    <p className="t-eyebrow mt-3 text-center text-[0.6rem] text-steel lg:text-[0.65rem]">{p.label}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Mensagem */}
        <div className="relative z-10 order-2 flex flex-col lg:order-1">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: d + 0.15 }}
            className="t-eyebrow flex items-center gap-3 text-steel"
          >
            <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-chrome/60" />
            Signature Series · 200 ml
          </motion.p>

          <h1 id="hero-title" className="mt-5 lg:mt-8">
            <span className="block overflow-hidden py-[0.12em] -my-[0.12em]">
              <motion.span
                initial={reduce ? false : { y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease, delay: d + 0.2 }}
                className="block font-display text-[clamp(1.05rem,2.1vw,1.7rem)] font-medium uppercase tracking-[0.08em] text-chrome"
              >
                O mundo conhece seu rosto.
              </motion.span>
            </span>
            <span className="mt-1 -mb-[0.14em] block overflow-hidden pb-[0.14em] pt-[0.16em] lg:mt-2">
              <motion.span
                initial={reduce ? false : { y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease, delay: d + 0.33 }}
                className="block font-display text-[clamp(2.6rem,5.7vw,5.9rem)] font-semibold uppercase leading-[0.98] tracking-[-0.045em]"
              >
                Mas qual é a<br />
                sua <span className="text-chrome">aura?</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: d + 0.55 }}
            className="t-lead mt-5 max-w-[30rem] lg:mt-8"
          >
            Três fragrâncias. Três formas de expressar sua identidade. Descubra aquela que combina com você.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: d + 0.67 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-10"
          >
            <Magnetic>
              <Link href="/descubra-sua-aura" className="btn btn-primary sheen w-full sm:w-auto">
                Descobrir minha aura <ArrowRight className="size-4" />
              </Link>
            </Magnetic>
            <Link href="#colecao" className="btn btn-ghost">
              Explorar a coleção
            </Link>
          </motion.div>
        </div>
      </div>

      <div aria-hidden className="container-x hidden items-center justify-between pb-8 text-steel lg:flex">
        <span className="t-eyebrow">The art of presence</span>
        <span className="t-eyebrow flex items-center gap-2">
          Role <ArrowDown className="size-3.5 animate-bounce" />
        </span>
      </div>
    </section>
  );
}
