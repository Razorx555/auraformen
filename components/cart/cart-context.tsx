"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, FragranceId, Money } from "@/lib/types";
import { getKit, getProduct } from "@/data/products";
import { fragranceImages, fragrances } from "@/data/fragrances";
import { brand, storeConfig } from "@/data/store-config";
import { kitPricing, money } from "@/lib/format";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "aura-cart-v1";

type AddResult = { ok: true } | { ok: false; error: string };

export type CheckoutResult =
  | { status: "redirect"; url: string }
  | { status: "not_configured"; missing: string[] }
  | { status: "error"; message: string };

type CartContextValue = {
  lines: CartLine[];
  hydrated: boolean;
  count: number;
  subtotal: Money;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addProduct: (handle: string, quantity?: number) => AddResult;
  addKit: (handle: string, selection: FragranceId[], quantity?: number) => AddResult;
  setQuantity: (lineId: string, quantity: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  checkout: (discountCodes?: string[]) => Promise<CheckoutResult>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Restaura o carrinho salvo (persistência entre navegações e visitas)
  useEffect(() => {
    let saved: CartLine[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as { lines: CartLine[] }) : null;
      if (parsed && Array.isArray(parsed.lines)) saved = parsed.lines;
    } catch {}
    /* eslint-disable react-hooks/set-state-in-effect -- restaura dados do navegador após a hidratação */
    setLines(saved);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, updatedAt: Date.now() }));
    } catch {}
  }, [lines, hydrated]);

  // Sincroniza entre abas
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        setLines(JSON.parse(e.newValue).lines ?? []);
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const upsert = useCallback((line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === line.id);
      if (!existing) return [...prev, line];
      return prev.map((l) =>
        l.id === line.id ? { ...l, quantity: Math.min(l.maxQuantity, l.quantity + line.quantity) } : l,
      );
    });
  }, []);

  const addProduct = useCallback(
    (handle: string, quantity = 1): AddResult => {
      if (storeConfig.mode !== "live") return { ok: false, error: "As vendas ainda não foram abertas." };
      const product = getProduct(handle);
      const variant = product?.variants[0];
      if (!product || !variant) return { ok: false, error: "Produto não encontrado." };
      if (!variant.availableForSale) return { ok: false, error: "Produto indisponível no momento." };
      const max = Math.min(storeConfig.maxQuantityPerLine, variant.quantityAvailable ?? Infinity);
      const current = lines.find((l) => l.id === variant.id)?.quantity ?? 0;
      if (current + quantity > max) return { ok: false, error: `Limite de ${max} unidades por item.` };
      const img = product.images[0];
      upsert({
        id: variant.id,
        merchandiseId: variant.id,
        kind: "single",
        handle: product.handle,
        title: `AURA ${product.title}`,
        variantTitle: `${product.category} · ${variant.title}`,
        imageSrc: img.src,
        imageAlt: img.alt,
        unitPrice: variant.price,
        quantity,
        attributes: [],
        maxQuantity: max,
        demo: product.demo,
      });
      track("add_to_cart", {
        currency: "BRL",
        value: variant.price.amount * quantity,
        items: [{ item_id: variant.sku, item_name: product.fullName, quantity, price: variant.price.amount }],
      });
      return { ok: true };
    },
    [lines, upsert],
  );

  const addKit = useCallback(
    (handle: string, selection: FragranceId[], quantity = 1): AddResult => {
      if (storeConfig.mode !== "live") return { ok: false, error: "As vendas ainda não foram abertas." };
      const kit = getKit(handle);
      if (!kit) return { ok: false, error: "Kit não encontrado." };
      if (!kit.availableForSale) return { ok: false, error: "Kit indisponível no momento." };
      const needed = kit.rule.type === "fixed" ? kit.rule.components.length : kit.rule.count;
      const unique = Array.from(new Set(selection));
      if (unique.length !== needed) return { ok: false, error: `Selecione ${needed} fragrâncias diferentes.` };
      const ordered = (["halo", "ember", "eclipse"] as FragranceId[]).filter((f) => unique.includes(f));
      const { price } = kitPricing(kit, ordered);
      const names = ordered.map((f) => fragrances[f].name).join(" + ");
      const lineId = `${kit.id}:${ordered.join("-")}`;
      const max = Math.min(storeConfig.maxQuantityPerLine, kit.quantityAvailable ?? Infinity);
      const current = lines.find((l) => l.id === lineId)?.quantity ?? 0;
      if (current + quantity > max) return { ok: false, error: `Limite de ${max} unidades por item.` };
      upsert({
        id: lineId,
        merchandiseId: kit.id,
        kind: "kit",
        handle: kit.handle,
        title: kit.title,
        variantTitle: names,
        imageSrc: ordered.length ? fragranceImages[ordered[0]].src : brand.symbol.src,
        imageAlt: `Kit ${kit.title}: ${names}`,
        unitPrice: price,
        quantity,
        attributes: [{ key: "Fragrâncias", value: names }],
        maxQuantity: max,
        demo: kit.demo,
      });
      track("add_to_cart", {
        currency: "BRL",
        value: price.amount * quantity,
        items: [{ item_id: kit.sku, item_name: `${kit.title} (${names})`, quantity, price: price.amount }],
      });
      return { ok: true };
    },
    [lines, upsert],
  );

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.id === lineId ? { ...l, quantity: Math.max(0, Math.min(l.maxQuantity, quantity)) } : l))
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const remove = useCallback((lineId: string) => setLines((p) => p.filter((l) => l.id !== lineId)), []);
  const clear = useCallback(() => setLines([]), []);

  const subtotal = useMemo(
    () => money(lines.reduce((acc, l) => acc + l.unitPrice.amount * l.quantity, 0)),
    [lines],
  );
  const count = useMemo(() => lines.reduce((a, l) => a + l.quantity, 0), [lines]);

  const checkout = useCallback(
    async (discountCodes: string[] = []): Promise<CheckoutResult> => {
      track("begin_checkout", { currency: "BRL", value: subtotal.amount, items_count: count });
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lines: lines.map((l) => ({
              merchandiseId: l.merchandiseId,
              quantity: l.quantity,
              attributes: l.attributes,
            })),
            discountCodes,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.checkoutUrl) return { status: "redirect", url: data.checkoutUrl };
        if (data.error === "not_configured") return { status: "not_configured", missing: data.missing ?? [] };
        if (data.error === "unmapped_variants")
          return { status: "error", message: "Alguns itens ainda não foram vinculados à plataforma de pagamento." };
        return { status: "error", message: data.message ?? "Não foi possível iniciar o checkout. Tente novamente." };
      } catch {
        return { status: "error", message: "Falha de conexão. Verifique sua internet e tente novamente." };
      }
    },
    [lines, subtotal.amount, count],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      hydrated,
      count,
      subtotal,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addProduct,
      addKit,
      setQuantity,
      remove,
      clear,
      checkout,
    }),
    [lines, hydrated, count, subtotal, isOpen, addProduct, addKit, setQuantity, remove, clear, checkout],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
