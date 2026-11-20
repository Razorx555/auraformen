import type { FragranceId, Kit, Money } from "./types";
import { getProduct } from "@/data/products";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatMoney = (m: Money | number) =>
  brl.format(typeof m === "number" ? m : m.amount);

export const money = (amount: number): Money => ({
  amount: Math.round(amount * 100) / 100,
  currencyCode: "BRL",
});

/** Soma dos preços vigentes das unidades que compõem o kit. */
export function componentsTotal(ids: FragranceId[]): Money {
  return money(ids.reduce((acc, id) => acc + (getProduct(id)?.variants[0].price.amount ?? 0), 0));
}

/**
 * Preço do kit e economia REAL: compara o preço do kit com a soma dos preços
 * vigentes das unidades. Sem preço próprio, o kit custa a soma (economia 0).
 */
export function kitPricing(kit: Kit, selection: FragranceId[]) {
  const total = componentsTotal(selection);
  const price = kit.price ?? total;
  const savings = Math.max(0, Math.round((total.amount - price.amount) * 100) / 100);
  return { price, componentsTotal: total, savings: savings > 0 ? money(savings) : null };
}

export const onlyDigits = (s: string) => s.replace(/\D/g, "");

export const formatCep = (s: string) => {
  const d = onlyDigits(s).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

/** CEP válido: 8 dígitos e não composto de um único dígito repetido. */
export const isValidCep = (s: string) => {
  const d = onlyDigits(s);
  return d.length === 8 && !/^(\d)\1{7}$/.test(d);
};

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
