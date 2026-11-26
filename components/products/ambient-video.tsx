"use client";

import { useEffect, useRef, useState } from "react";
import { fragranceVideos } from "@/data/fragrances";
import type { FragranceId } from "@/lib/types";

/**
 * Loop cinematográfico sobre a imagem oficial.
 * - A foto oficial continua por baixo (poster/LCP); o vídeo só aparece quando já pode tocar.
 * - Não toca com prefers-reduced-motion nem com economia de dados (Save-Data).
 * - Pausa fora da tela para poupar bateria e CPU.
 */
export function AmbientVideo({ id, className, eager = false }: { id: FragranceId; className?: string; eager?: boolean }) {
  const src = fragranceVideos[id];
  const ref = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depende de preferências do navegador
    if (!reduce && !saveData && src) setAllowed(true);
  }, [src]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !allowed) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [allowed]);

  if (!src || !allowed || failed) return null;
  return (
    <video
      ref={ref}
      className={`pointer-events-none transition-opacity duration-[1.2s] ${ready ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload={eager ? "auto" : "metadata"}
      aria-hidden
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
      onError={() => setFailed(true)}
    />
  );
}
