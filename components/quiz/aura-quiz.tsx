"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, RotateCcw, Share2, Check } from "lucide-react";
import { quizQuestions } from "@/data/quiz";
import { fragrances, isFragranceId } from "@/data/fragrances";
import { computeQuizResult } from "@/lib/quiz";
import { track } from "@/lib/analytics";
import { FragranceVisual } from "@/components/products/fragrance-visual";
import { Eyebrow } from "@/components/ui/brand";
import { cn } from "@/lib/format";
import type { FragranceId, QuizResult } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

type Phase = { kind: "intro" } | { kind: "question"; index: number } | { kind: "result"; result: QuizResult; shared?: boolean };

/**
 * DESCUBRA SUA AURA — quiz determinístico, sem IA.
 * Lógica e critério de desempate documentados em lib/quiz.ts.
 */
export function AuraQuiz({ readSharedResult = false, headingLevel = "h2" }: { readSharedResult?: boolean; headingLevel?: "h1" | "h2" }) {
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [answers, setAnswers] = useState<Record<string, FragranceId>>({});
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const Heading = headingLevel;

  // Link compartilhado: /descubra-sua-aura?resultado=halo
  useEffect(() => {
    if (!readSharedResult) return;
    const r = new URLSearchParams(window.location.search).get("resultado");
    if (r && isFragranceId(r)) {
      const result = computeQuizResult({ atmosfera: r, cenario: r, expressao: r });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza com fonte externa (navegador) após a hidratação
      setPhase({ kind: "result", result, shared: true });
    }
  }, [readSharedResult]);

  // Move o foco para o novo conteúdo a cada etapa (leitores de tela/teclado)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("[data-step-focus]")?.focus(), 380);
    return () => window.clearTimeout(t);
  }, [phase]);

  const start = () => {
    setAnswers({});
    setPhase({ kind: "question", index: 0 });
    track("quiz_start");
  };

  const choose = (questionId: string, value: FragranceId, index: number) => {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);
    window.setTimeout(() => {
      if (index + 1 < quizQuestions.length) setPhase({ kind: "question", index: index + 1 });
      else {
        const result = computeQuizResult(next);
        setPhase({ kind: "result", result });
        track("quiz_complete", { result: result.fragranceId, tie_break: result.tieBreak });
      }
    }, 260);
  };

  const share = async (id: FragranceId) => {
    const url = `${window.location.origin}/descubra-sua-aura?resultado=${id}`;
    const text = `Minha aura é ${fragrances[id].name}. Descubra a sua.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "AURA FOR MEN", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      /* compartilhamento cancelado pelo usuário */
    }
  };

  const resultId = phase.kind === "result" ? phase.result.fragranceId : null;

  return (
    <div
      ref={panelRef}
      data-aura={resultId ?? "neutral"}
      className="chrome-border relative isolate overflow-hidden rounded-[32px] bg-graphite/60 transition-colors duration-1000"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
        style={{
          background: resultId
            ? `radial-gradient(70% 60% at 75% 40%, ${fragrances[resultId].palette.accent}26, transparent 70%)`
            : "radial-gradient(60% 60% at 50% 0%, rgba(191,195,204,0.08), transparent 70%)",
        }}
      />
      <AnimatePresence mode="wait">
        {phase.kind === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease }}
            className="grid gap-10 p-7 sm:p-10 md:grid-cols-[1.2fr_1fr] md:items-center md:p-16"
          >
            <div>
              <Eyebrow>Três universos. Qual é o seu?</Eyebrow>
              <Heading className="t-display mt-6" tabIndex={-1} data-step-focus>
                Qual é a<br />
                sua <span className="text-chrome">aura?</span>
              </Heading>
              <p className="t-lead mt-6 max-w-md">Seu estilo revela mais do que você imagina.</p>
              <p className="mt-3 text-sm text-steel">3 perguntas · menos de 1 minuto</p>
              <button type="button" onClick={start} className="btn btn-primary sheen mt-9">
                Iniciar experiência <ArrowRight className="size-4" />
              </button>
            </div>
            <div aria-hidden className="relative mx-auto flex h-64 w-full max-w-sm items-end justify-center md:h-80">
              {(["halo", "eclipse", "ember"] as FragranceId[]).map((id, i) => (
                <div
                  key={id}
                  className={cn(
                    "overflow-hidden rounded-t-full rounded-b-2xl border border-white/10",
                    i === 1 ? "relative z-10 h-full w-[42%]" : "absolute bottom-0 h-[75%] w-[34%] opacity-60",
                    i === 0 && "left-[2%]",
                    i === 2 && "right-[2%]",
                  )}
                >
                  <FragranceVisual id={id} sizes="200px" className="h-full w-full" decorative />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {phase.kind === "question" && (
          <motion.div
            key={`q-${phase.index}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease }}
            className="p-7 sm:p-10 md:p-16"
          >
            {(() => {
              const q = quizQuestions[phase.index];
              return (
                <fieldset>
                  <div className="flex items-center justify-between gap-4">
                    <p className="t-eyebrow text-steel">
                      Etapa {q.step} de {quizQuestions.length}
                    </p>
                    {phase.index > 0 && (
                      <button
                        type="button"
                        onClick={() => setPhase({ kind: "question", index: phase.index - 1 })}
                        className="inline-flex min-h-11 items-center gap-2 text-xs uppercase tracking-[0.2em] text-steel hover:text-paper"
                      >
                        <ArrowLeft className="size-3.5" /> Voltar
                      </button>
                    )}
                  </div>
                  <div
                    className="mt-4 h-px w-full bg-white/10"
                    role="progressbar"
                    aria-label="Progresso do quiz"
                    aria-valuemin={0}
                    aria-valuemax={quizQuestions.length}
                    aria-valuenow={q.step}
                  >
                    <motion.div
                      className="h-px bg-gradient-to-r from-chrome to-paper"
                      initial={false}
                      animate={{ width: `${(q.step / quizQuestions.length) * 100}%` }}
                      transition={{ duration: 0.6, ease }}
                    />
                  </div>
                  <legend className="contents">
                    <span tabIndex={-1} data-step-focus className="t-h2 mt-10 block max-w-[20ch] focus:outline-none">
                      {q.question}
                    </span>
                  </legend>

                  <div className={cn("mt-10 grid gap-3", q.visual ? "sm:grid-cols-3 sm:gap-4" : "md:grid-cols-3 md:gap-4")}>
                    {q.options.map((o) => {
                      const selected = answers[q.id] === o.points;
                      return (
                        <button
                          key={o.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => choose(q.id, o.points, phase.index)}
                          className={cn(
                            "group relative overflow-hidden rounded-2xl border text-left transition-all duration-500",
                            selected ? "border-paper bg-white/[0.06]" : "border-white/12 hover:border-chrome/50 hover:bg-white/[0.03]",
                          )}
                        >
                          {q.visual && o.visual && (
                            <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[4/5]">
                              <FragranceVisual
                                id={o.visual}
                                sizes="(max-width: 640px) 90vw, 30vw"
                                className="absolute inset-0"
                                imgClassName="scale-[1.6] transition-transform duration-[1.2s] group-hover:scale-[1.7]"
                                decorative
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                            </div>
                          )}
                          <span className="flex items-start gap-4 p-5 md:p-6">
                            <span
                              className={cn(
                                "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border font-display text-xs uppercase",
                                selected ? "border-paper bg-paper text-ink" : "border-white/25 text-chrome",
                              )}
                            >
                              {selected ? <Check className="size-3.5" /> : o.id}
                            </span>
                            <span className="text-base leading-snug text-paper md:text-lg">{o.label}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })()}
          </motion.div>
        )}

        {phase.kind === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease }}
            className="grid gap-10 p-7 sm:p-10 md:grid-cols-[0.85fr_1.15fr] md:items-center md:p-16"
          >
            {(() => {
              const { result } = phase;
              const f = fragrances[result.fragranceId];
              return (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease, delay: 0.1 }}
                    className="relative mx-auto w-full max-w-[340px]"
                  >
                    <div aria-hidden className="absolute -inset-8 rounded-full blur-3xl" style={{ background: `radial-gradient(closest-side, ${f.palette.accent}55, transparent)` }} />
                    <div className="chrome-border relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[28px]">
                      <FragranceVisual id={f.id} sizes="340px" className="absolute inset-0" />
                    </div>
                  </motion.div>
                  <div>
                    <p className="t-eyebrow text-accent">{phase.shared ? "Uma aura compartilhada com você" : "Seu resultado"}</p>
                    <p tabIndex={-1} data-step-focus className="t-display mt-5 focus:outline-none" role="status">
                      Sua aura é<br />
                      <span className="text-accent">{f.name}.</span>
                    </p>
                    <p className="t-lead mt-6 max-w-md">{result.description}</p>
                    <p className="t-name mt-5 text-sm text-chrome">“{f.tagline}”</p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <Link href={`/fragrancias/${f.id}`} className="btn btn-primary sheen">
                        Explorar minha fragrância <ArrowRight className="size-4" />
                      </Link>
                      <button type="button" onClick={start} className="btn btn-ghost">
                        <RotateCcw className="size-4" /> {phase.shared ? "Descobrir a minha" : "Refazer experiência"}
                      </button>
                      {!phase.shared && (
                        <button type="button" onClick={() => share(f.id)} className="btn btn-ghost">
                          {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
                          {copied ? "Link copiado" : "Compartilhar"}
                        </button>
                      )}
                    </div>
                    <p className="mt-8 max-w-md text-xs leading-relaxed text-steel">
                      Uma sugestão estética a partir das suas escolhas, não uma análise de personalidade. As três fragrâncias
                      continuam à sua disposição.
                    </p>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
