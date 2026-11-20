"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X, ArrowRight } from "lucide-react";
import { searchIndex } from "@/data/site";
import { useBodyLock, useDialogFocus } from "@/components/ui/interactive";

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const suggestions = ["HALO", "EMBER", "ECLIPSE", "Kit", "Frete"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  useBodyLock(open);
  useDialogFocus(open, ref, onClose);

  const results = useMemo(() => {
    const terms = normalize(q).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return searchIndex.filter((item) => {
      const hay = normalize(`${item.title} ${item.kind} ${item.text}`);
      return terms.every((t) => hay.includes(t));
    });
  }, [q]);

  const close = () => {
    onClose();
    setQ("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-ink/80 px-4 pt-[12vh] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Buscar no site"
            className="chrome-border w-full max-w-2xl rounded-2xl bg-graphite/95 shadow-2xl"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-5">
              <Search className="size-5 shrink-0 text-steel" strokeWidth={1.5} aria-hidden />
              <label htmlFor="site-search" className="sr-only">
                Buscar fragrâncias, kits e páginas
              </label>
              <input
                id="site-search"
                data-autofocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar fragrâncias, kits, ajuda…"
                className="h-16 w-full bg-transparent text-lg text-paper placeholder:text-steel/70 focus:outline-none"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={close}
                className="grid size-10 shrink-0 place-items-center rounded-full text-steel hover:text-paper"
                aria-label="Fechar busca"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="max-h-[55vh] overflow-y-auto p-3" aria-live="polite">
              {!q && (
                <div className="p-3">
                  <p className="t-eyebrow mb-3 text-steel">Sugestões</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQ(s)}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm text-chrome hover:border-chrome/50 hover:text-paper"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {q && results.length === 0 && (
                <p className="p-4 text-sm text-steel">Nenhum resultado para “{q}”. Tente “HALO”, “kit” ou “frete”.</p>
              )}
              <ul>
                {results.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      onClick={close}
                      className="group flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 hover:bg-white/[0.04] focus-visible:bg-white/[0.04]"
                    >
                      <span>
                        <span className="block font-display text-base uppercase tracking-wide text-paper">{r.title}</span>
                        <span className="text-xs text-steel">{r.kind}</span>
                      </span>
                      <ArrowRight className="size-4 text-steel transition group-hover:translate-x-1 group-hover:text-paper" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
