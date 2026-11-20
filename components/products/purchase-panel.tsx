"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Truck } from "lucide-react";
import { AddToBag } from "./add-to-bag";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { Price } from "@/components/ui/brand";
import { getProduct } from "@/data/products";
import { fragrances } from "@/data/fragrances";
import { storeConfig } from "@/data/store-config";
import { formatCep, isValidCep, formatMoney } from "@/lib/format";
import { track } from "@/lib/analytics";

/** Consulta de CEP: valida o formato. O cálculo de frete só com serviço real integrado. */
export function CepCheck() {
  const [cep, setCep] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidCep(cep)) {
      setMsg({ ok: false, text: "CEP inválido. Digite os 8 números, por exemplo 01310-100." });
      return;
    }
    setMsg({
      ok: true,
      text: storeConfig.shopify.configured
        ? "CEP válido. Prazo e valor do frete são calculados no checkout."
        : "CEP válido. O cálculo de frete será liberado quando o serviço de entrega for integrado.",
    });
  };
  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 border-t border-white/10 pt-6">
      <label htmlFor="cep" className="t-eyebrow flex items-center gap-2 text-steel">
        <Truck className="size-4" strokeWidth={1.5} /> Consultar frete
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id="cep"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => {
            setCep(formatCep(e.target.value));
            setMsg(null);
          }}
          aria-invalid={msg ? !msg.ok : undefined}
          aria-describedby={msg ? "cep-msg" : undefined}
          className="field"
          maxLength={9}
        />
        <button type="submit" className="btn btn-ghost shrink-0 px-5">
          Consultar
        </button>
      </div>
      {msg && (
        <p id="cep-msg" role="status" className={`mt-2 text-xs ${msg.ok ? "text-chrome" : "text-[#f0a597]"}`}>
          {msg.text}
        </p>
      )}
    </form>
  );
}

export function PurchasePanel({ handle }: { handle: string }) {
  const product = getProduct(handle)!;
  const f = fragrances[product.fragranceId!];
  const v = product.variants[0];
  const [qty, setQty] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const live = storeConfig.mode === "live";
  const max = Math.min(storeConfig.maxQuantityPerLine, v.quantityAvailable ?? Infinity);

  useEffect(() => {
    track("view_item", {
      currency: "BRL",
      value: v.price.amount,
      items: [{ item_id: v.sku, item_name: product.fullName, price: v.price.amount }],
    });
  }, [product.fullName, v.price.amount, v.sku]);

  // Barra fixa no mobile: aparece quando o painel de compra sai da tela
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={ref} id="comprar" className="scroll-mt-28">
        <p className="t-eyebrow text-accent">Faça desta a sua aura</p>
        <h2 className="mt-4 font-display text-3xl font-semibold uppercase tracking-[0.06em] md:text-4xl">{product.fullName}</h2>
        <dl className="mt-6 grid grid-cols-2 gap-y-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-steel">Categoria</dt>
            <dd className="mt-1 text-paper">{product.category}</dd>
          </div>
          <div>
            <dt className="text-steel">Volume</dt>
            <dd className="mt-1 text-paper">{product.volumeMl} ml (6,76 fl. oz.)</dd>
          </div>
          <div>
            <dt className="text-steel">Coleção</dt>
            <dd className="mt-1 text-paper">Signature Series</dd>
          </div>
        </dl>
        <p className="t-body mt-6">{product.description}</p>

        {live ? (
          <>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Price value={v.price} compareAt={v.compareAtPrice} demo={product.demo} className="text-3xl" />
            </div>
            <p className="mt-2 text-sm text-steel">
              {!v.availableForSale
                ? "Indisponível no momento."
                : v.quantityAvailable !== null
                  ? `Em estoque: ${v.quantityAvailable} unidades.`
                  : storeConfig.demoCommerce
                    ? "Disponibilidade sujeita à confirmação do estoque (demonstração)."
                    : "Disponível."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <QuantityStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} max={max} label={product.title} />
              <AddToBag handle={handle} quantity={qty} className="flex-1" />
            </div>
            <AddToBag handle={handle} quantity={qty} label="Comprar agora" variant="ghost" buyNow className="mt-3" />
            <CepCheck />
          </>
        ) : (
          <div className="mt-8">
            <p className="t-body mb-5 text-chrome">As vendas abrem em breve. Seja avisado assim que {f.name} estiver disponível.</p>
            <NewsletterForm source={`produto-${handle}`} interest={handle} cta="Quero saber do lançamento" />
          </div>
        )}
      </div>

      {live && (
        <AnimatePresence>
          {showSticky && (
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              exit={{ y: "110%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"
            >
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="t-name truncate text-sm">{product.title} · 200 ml</p>
                  <p className="font-display text-sm tabular-nums text-chrome">{formatMoney(v.price)}</p>
                </div>
                <AddToBag handle={handle} label="Adicionar" className="w-auto" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

export function NotesPanel({ handle }: { handle: string }) {
  const f = fragrances[getProduct(handle)!.fragranceId!];
  if (!f.notes) return null;
  const layers = [
    ["Topo", f.notes.topo],
    ["Coração", f.notes.coracao],
    ["Fundo", f.notes.fundo],
  ] as const;
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {layers.map(([k, v]) => (
        <div key={k} className="rounded-2xl border border-white/10 p-6">
          <p className="t-eyebrow text-accent">{k}</p>
          <p className="mt-3 text-paper">{v.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

