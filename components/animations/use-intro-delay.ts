"use client";

import { useState } from "react";

/**
 * Atraso base das animações do hero: espera a abertura (≈1,1 s) só quando ela
 * realmente vai tocar. Em visitas repetidas na sessão ou com movimento
 * reduzido, o conteúdo surge imediatamente.
 */
export function useIntroDelay() {
  const [delay] = useState(() => {
    if (typeof window === "undefined") return 1.05;
    const skipped = document.documentElement.dataset.intro === "skip";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return skipped || reduced ? 0.05 : 1.05;
  });
  return delay;
}
