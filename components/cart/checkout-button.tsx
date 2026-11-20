"use client";

import { useState } from "react";
import { LoaderCircle, Lock } from "lucide-react";
import { useCart } from "./cart-context";

/**
 * Inicia o checkout real (Shopify). Sem integração configurada, NÃO simula
 * pagamento: informa claramente o que falta configurar.
 */
export function CheckoutButton({ discountCodes = [] }: { discountCodes?: string[] }) {
  const { checkout, lines } = useCart();
  const [state, setState] = useState<"idle" | "loading" | "not_configured" | "error">("idle");
  const [message, setMessage] = useState("");

  const onClick = async () => {
    setState("loading");
    const r = await checkout(discountCodes);
    if (r.status === "redirect") {
      window.location.assign(r.url);
      return;
    }
    if (r.status === "not_configured") {
      setState("not_configured");
      setMessage("Checkout em modo demonstração: a plataforma de pagamento ainda não foi conectada. Nenhum pedido foi criado e nenhuma cobrança foi feita.");
      return;
    }
    setState("error");
    setMessage(r.message);
  };

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={state === "loading" || lines.length === 0}
        className="btn btn-primary sheen w-full"
        aria-describedby={message ? "checkout-msg" : undefined}
      >
        {state === "loading" ? (
          <>
            <LoaderCircle className="size-4 animate-spin" /> Preparando checkout
          </>
        ) : (
          <>
            <Lock className="size-3.5" strokeWidth={2} /> Finalizar compra
          </>
        )}
      </button>
      {message && (
        <p
          id="checkout-msg"
          role="status"
          className={`mt-3 rounded-lg border px-3 py-2.5 text-xs leading-relaxed ${
            state === "error" ? "border-[#e07a6b]/40 text-[#f0a597]" : "border-[#e9c46a]/30 text-[#e9c46a]"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
