"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { useCart } from "./cart-context";
import { QuantityStepper } from "./quantity-stepper";
import { CheckoutButton } from "./checkout-button";
import { CepCheck } from "@/components/products/purchase-panel";
import { DemoBadge } from "@/components/ui/brand";
import { formatMoney } from "@/lib/format";
import { storeConfig } from "@/data/store-config";

function CouponField({ onApply, applied }: { onApply: (code: string | null) => void; applied: string | null }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c) return;
    if (storeConfig.shopify.configured) {
      onApply(c);
      setMsg({ ok: true, text: `Cupom ${c} será validado pela loja no checkout.` });
      return;
    }
    const found = storeConfig.coupons.find((x) => x.code === c);
    if (found) {
      onApply(c);
      setMsg({ ok: true, text: found.description });
    } else {
      setMsg({ ok: false, text: "Cupom não encontrado ou sem promoção ativa no momento." });
    }
  };
  return (
    <form onSubmit={submit} noValidate className="mt-6">
      <label htmlFor="coupon" className="t-eyebrow text-steel">
        Cupom de desconto
      </label>
      {applied ? (
        <p className="mt-3 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm">
          {applied}
          <button type="button" onClick={() => { onApply(null); setMsg(null); setCode(""); }} aria-label="Remover cupom" className="text-steel hover:text-paper">
            <X className="size-4" />
          </button>
        </p>
      ) : (
        <div className="mt-3 flex gap-2">
          <input id="coupon" value={code} onChange={(e) => { setCode(e.target.value); setMsg(null); }} className="field uppercase" placeholder="Código" autoComplete="off" aria-describedby={msg ? "coupon-msg" : undefined} />
          <button type="submit" className="btn btn-ghost shrink-0 px-5">
            Aplicar
          </button>
        </div>
      )}
      {msg && (
        <p id="coupon-msg" role="status" className={`mt-2 text-xs ${msg.ok ? "text-chrome" : "text-[#f0a597]"}`}>
          {msg.text}
        </p>
      )}
    </form>
  );
}

export function CartPageClient() {
  const { lines, hydrated, subtotal, setQuantity, remove, count } = useCart();
  const [coupon, setCoupon] = useState<string | null>(null);
  const hasDemo = lines.some((l) => l.demo) && storeConfig.demoCommerce;

  if (!hydrated) return <div className="h-64" aria-busy="true" />;

  if (lines.length === 0)
    return (
      <div className="flex flex-col items-center gap-6 rounded-[28px] border border-white/10 px-6 py-20 text-center">
        <ShoppingBag className="size-10 text-steel" strokeWidth={1} aria-hidden />
        <h2 className="t-h3">Sua bolsa está vazia.</h2>
        <p className="t-body max-w-sm">Três universos esperam por você. Encontre a fragrância que combina com a sua presença.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/colecao" className="btn btn-primary">
            Explorar a coleção
          </Link>
          <Link href="/descubra-sua-aura" className="btn btn-ghost">
            Descobrir minha aura
          </Link>
        </div>
      </div>
    );

  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      <div>
        <p className="t-eyebrow text-steel">
          {count} {count === 1 ? "item" : "itens"}
        </p>
        <ul className="mt-4 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {lines.map((l) => (
            <li key={l.id} className="grid grid-cols-[6rem_1fr] gap-5 py-6 sm:grid-cols-[8rem_1fr]">
              <Link href={l.kind === "kit" ? "/kits" : `/fragrancias/${l.handle}`} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-graphite">
                <Image src={l.imageSrc} alt={l.imageAlt} fill sizes="128px" className="object-cover" />
              </Link>
              <div className="flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="t-name text-base">{l.title}</p>
                    <p className="mt-1 text-sm text-steel">{l.variantTitle}</p>
                    <p className="mt-1 text-sm text-steel">{formatMoney(l.unitPrice)} cada</p>
                  </div>
                  <p className="font-display text-lg tabular-nums">{formatMoney(l.unitPrice.amount * l.quantity)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <QuantityStepper size="sm" value={l.quantity} max={l.maxQuantity} onChange={(q) => setQuantity(l.id, q)} label={l.title} />
                  <button type="button" onClick={() => remove(l.id)} className="text-sm text-steel underline-offset-4 hover:text-paper hover:underline">
                    Remover<span className="sr-only"> {l.title}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/colecao" className="btn-link mt-8">
          Continuar comprando <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <aside aria-label="Resumo do pedido" className="lg:sticky lg:top-28 lg:self-start">
        <div className="chrome-border rounded-[28px] bg-graphite/70 p-6 md:p-8">
          <h2 className="t-h3">Resumo</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-steel">Subtotal</dt>
              <dd className="tabular-nums">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel">Frete</dt>
              <dd className="text-steel">Calculado no checkout</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel">Descontos</dt>
              <dd className="text-steel">{coupon ? "Aplicados no checkout" : "—"}</dd>
            </div>
          </dl>
          <div className="hairline my-6" />
          <div className="flex items-baseline justify-between">
            <span className="t-eyebrow text-steel">Total parcial</span>
            <span className="font-display text-2xl tabular-nums">{formatMoney(subtotal)}</span>
          </div>
          {hasDemo && (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#e9c46a]/90">
              <DemoBadge label="Demonstração" /> Preços ilustrativos até a integração da loja.
            </p>
          )}
          <CouponField onApply={setCoupon} applied={coupon} />
          <CepCheck />
          <div className="mt-8">
            <CheckoutButton discountCodes={coupon ? [coupon] : []} />
          </div>
          <p className="mt-4 text-center text-xs text-steel">Pagamento processado pela plataforma de checkout da loja.</p>
        </div>
      </aside>
    </div>
  );
}
