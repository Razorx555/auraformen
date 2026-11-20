"use client";

import Link from "next/link";
import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Search, ArrowUpRight } from "lucide-react";
import { mobileNav } from "@/data/site";
import { brand, storeConfig } from "@/data/store-config";
import { useBodyLock, useDialogFocus } from "@/components/ui/interactive";
import { BrandLogo, BrandSymbol } from "@/components/ui/brand";

const ease = [0.22, 1, 0.36, 1] as const;

export function MobileMenu({ open, onClose, onSearch }: { open: boolean; onClose: () => void; onSearch: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useBodyLock(open);
  useDialogFocus(open, ref, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-ink md:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease }}
        >
          <div aria-hidden className="pointer-events-none absolute -right-24 bottom-10 w-[85vw] opacity-[0.07]">
            <BrandSymbol sizes="85vw" className="h-auto w-full" />
          </div>
          <div className="container-x flex h-16 items-center justify-between">
            <BrandLogo className="h-auto w-[118px]" />
            <button
              type="button"
              onClick={onClose}
              className="grid size-11 place-items-center rounded-full border border-white/10 text-paper"
              aria-label="Fechar menu"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav aria-label="Menu principal" className="container-x mt-8 flex-1">
            <ul>
              {mobileNav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.05 }}
                  className="border-b border-white/[0.08]"
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-5 font-display text-[2rem] font-semibold uppercase leading-none tracking-[-0.03em] text-paper"
                  >
                    {item.label}
                    <ArrowUpRight className="size-5 text-steel" strokeWidth={1.25} />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <button type="button" onClick={onSearch} className="btn btn-ghost mt-8 w-full">
              <Search className="size-4" strokeWidth={1.5} /> Buscar
            </button>
          </nav>

          <div className="container-x pb-10 pt-12">
            <div className="hairline mb-6" />
            <p className="t-eyebrow text-steel">{brand.signature}</p>
            {storeConfig.social.length > 0 && (
              <ul className="mt-4 flex gap-5">
                {storeConfig.social.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-chrome">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
