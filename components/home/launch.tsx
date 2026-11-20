"use client";

import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/ui/brand";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { storeConfig } from "@/data/store-config";

function Countdown({ target }: { target: number }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza com fonte externa (navegador) após a hidratação
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  if (now === null || target <= now) return null;
  const s = Math.floor((target - now) / 1000);
  const parts = [
    ["dias", Math.floor(s / 86400)],
    ["horas", Math.floor((s % 86400) / 3600)],
    ["min", Math.floor((s % 3600) / 60)],
    ["seg", s % 60],
  ] as const;
  return (
    <div className="mt-10 flex gap-6" aria-label="Contagem regressiva para o lançamento">
      {parts.map(([label, v]) => (
        <div key={label} className="text-center">
          <span className="block font-display text-4xl tabular-nums md:text-5xl">{String(v).padStart(2, "0")}</span>
          <span className="t-eyebrow mt-2 block text-steel">{label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Modo pré-lançamento: interesse + contagem regressiva SOMENTE com data real
 * configurada em NEXT_PUBLIC_LAUNCH_DATE.
 */
export function LaunchSection() {
  const target = storeConfig.launchDate ? Date.parse(storeConfig.launchDate) : NaN;
  return (
    <section id="lancamento" aria-labelledby="launch-title" className="relative scroll-mt-20 overflow-hidden bg-ink py-24 md:py-36">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(191,195,204,0.1),transparent)]" />
      <div className="container-x relative max-w-3xl text-center">
        <Eyebrow className="justify-center">Lançamento Signature Series</Eyebrow>
        <h2 id="launch-title" className="t-display mt-6">
          A sua assinatura <span className="text-chrome">começa aqui.</span>
        </h2>
        <p className="t-lead mx-auto mt-6 max-w-xl">
          HALO, EMBER e ECLIPSE estão chegando. Deixe seu e-mail e saiba primeiro quando a coleção estiver disponível.
        </p>
        {Number.isFinite(target) && (
          <div className="flex justify-center">
            <Countdown target={target} />
          </div>
        )}
        <div className="mx-auto mt-10 max-w-lg text-left">
          <NewsletterForm source="pre-lancamento" cta="Quero saber do lançamento" />
        </div>
      </div>
    </section>
  );
}
