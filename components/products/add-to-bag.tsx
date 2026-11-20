"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { getProduct } from "@/data/products";
import { cn } from "@/lib/format";
import type { FragranceId } from "@/lib/types";

type Props = {
  className?: string;
  quantity?: number;
  label?: string;
  variant?: "primary" | "ghost";
  openDrawer?: boolean;
  buyNow?: boolean;
} & ({ handle: string; kit?: never; selection?: never } | { kit: string; selection: FragranceId[]; handle?: never });

/** Botão de compra com estados reais: indisponível, sucesso e erro. */
export function AddToBag({
  className,
  quantity = 1,
  label = "Adicionar à bolsa",
  variant = "primary",
  openDrawer = true,
  buyNow = false,
  ...target
}: Props) {
  const { addProduct, addKit, open } = useCart();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const unavailable = target.handle ? !getProduct(target.handle)?.variants[0]?.availableForSale : false;

  useEffect(() => {
    if (state !== "success") return;
    const t = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(t);
  }, [state]);

  const onClick = () => {
    setError("");
    const r = target.handle ? addProduct(target.handle, quantity) : addKit(target.kit!, target.selection!, quantity);
    if (!r.ok) {
      setState("error");
      setError(r.error);
      return;
    }
    setState("success");
    if (buyNow) router.push("/carrinho");
    else if (openDrawer) open();
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={unavailable}
        className={cn("btn w-full", variant === "primary" ? "btn-primary sheen" : "btn-ghost")}
        aria-describedby={error ? `${target.handle ?? target.kit}-add-err` : undefined}
      >
        {unavailable ? (
          "Indisponível no momento"
        ) : state === "success" && !buyNow ? (
          <>
            <Check className="size-4" /> Adicionado
          </>
        ) : (
          <>
            {!buyNow && <ShoppingBag className="size-4" strokeWidth={1.75} />} {label}
          </>
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "success" ? "Produto adicionado à bolsa." : ""}
      </span>
      {error && (
        <p id={`${target.handle ?? target.kit}-add-err`} role="alert" className="mt-2 text-xs text-[#f0a597]">
          {error}
        </p>
      )}
    </div>
  );
}
