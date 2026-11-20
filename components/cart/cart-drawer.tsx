"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-context";
import { useBodyLock, useDialogFocus } from "@/components/ui/interactive";
import { QuantityStepper } from "./quantity-stepper";
import { CheckoutButton } from "./checkout-button";
import { DemoBadge } from "@/components/ui/brand";
import { formatMoney } from "@/lib/format";
import { storeConfig } from "@/data/store-config";

const ease = [0.22, 1, 0.36, 1] as const;

export function CartDrawer() {
  const { isOpen, close, lines, subtotal, setQuantity, remove } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  useBodyLock(isOpen);
  useDialogFocus(isOpen, ref, close);
  const hasDemo = lines.some((l) => l.demo) && storeConfig.demoCommerce;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90]">
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.aside
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-white/[0.07] bg-graphite"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(60%_100%_at_70%_0%,color-mix(in_srgb,var(--aura-accent)_14%,transparent),transparent)]" />
            <header className="relative flex items-center justify-between px-6 pb-5 pt-6">
              <div>
                <h2 id="cart-title" className="t-h3">Sua bolsa</h2>
                <p className="mt-1 text-sm text-steel">
                  {lines.length ? "Sua escolha está quase pronta." : "Nenhuma fragrância por aqui ainda."}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="grid size-11 place-items-center rounded-full border border-white/10 text-paper hover:border-white/30"
                aria-label="Fechar bolsa"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </header>
            <div className="hairline" />

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
                <ShoppingBag className="size-10 text-steel" strokeWidth={1} aria-hidden />
                <p className="t-body max-w-xs">Três universos esperam por você. Encontre o que combina com a sua presença.</p>
                <div className="flex w-full flex-col gap-3">
                  <Link href="/colecao" onClick={close} className="btn btn-primary">
                    Explorar a coleção
                  </Link>
                  <Link href="/descubra-sua-aura" onClick={close} className="btn btn-ghost">
                    Descobrir minha aura
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-white/[0.06] overflow-y-auto px-6">
                  {lines.map((line) => (
                    <li key={line.id} className="flex gap-4 py-5">
                      <div className="relative h-28 w-[5.6rem] shrink-0 overflow-hidden rounded-lg bg-ink">
                        <Image src={line.imageSrc} alt={line.imageAlt} fill sizes="90px" className="object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="t-name text-sm text-paper">{line.title}</p>
                            <p className="mt-1 text-xs text-steel">{line.variantTitle}</p>
                          </div>
                          <p className="shrink-0 font-display text-sm tabular-nums text-paper">
                            {formatMoney(line.unitPrice.amount * line.quantity)}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-steel">{formatMoney(line.unitPrice)} cada</p>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <QuantityStepper
                            size="sm"
                            value={line.quantity}
                            max={line.maxQuantity}
                            onChange={(q) => setQuantity(line.id, q)}
                            label={line.title}
                          />
                          <button
                            type="button"
                            onClick={() => remove(line.id)}
                            className="text-xs text-steel underline-offset-4 hover:text-paper hover:underline"
                          >
                            Remover<span className="sr-only"> {line.title}</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <footer className="border-t border-white/[0.07] px-6 pb-6 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="t-eyebrow text-steel">Subtotal</span>
                    <span className="font-display text-xl tabular-nums">{formatMoney(subtotal)}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-steel">Frete e eventuais descontos são calculados no checkout.</p>
                  {hasDemo && (
                    <p className="mt-3 flex items-center gap-2 text-xs text-[#e9c46a]/90">
                      <DemoBadge label="Demonstração" /> Preços ilustrativos até a integração da loja.
                    </p>
                  )}
                  <div className="mt-5 grid gap-3">
                    <CheckoutButton />
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={close} className="btn btn-ghost px-3 text-[0.65rem]">
                        Continuar comprando
                      </button>
                      <Link href="/carrinho" onClick={close} className="btn btn-ghost px-3 text-[0.65rem]">
                        Ver carrinho
                      </Link>
                    </div>
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
