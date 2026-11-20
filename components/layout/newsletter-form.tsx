"use client";

import { useId, useState } from "react";
import { ArrowRight, LoaderCircle, Check } from "lucide-react";

type State = "idle" | "loading" | "saved" | "demo" | "error";

/**
 * Formulário de interesse/newsletter conectável (ver /api/newsletter).
 * Sem provedor configurado, avisa que o cadastro NÃO foi salvo.
 */
export function NewsletterForm({
  source,
  cta = "Inscrever",
  interest,
  compact = false,
}: {
  source: string;
  cta?: string;
  interest?: string;
  compact?: boolean;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Digite um e-mail válido, por exemplo nome@email.com.");
      return;
    }
    if (!consent) {
      setError("Para continuar, autorize o envio de comunicações.");
      return;
    }
    setState("loading");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, source, interest }),
      });
      const data = await r.json().catch(() => ({}));
      if (data.status === "saved") setState("saved");
      else if (data.status === "demo") setState("demo");
      else {
        setState("error");
        setError("Não foi possível concluir agora. Tente novamente em instantes.");
      }
    } catch {
      setState("error");
      setError("Falha de conexão. Verifique sua internet e tente novamente.");
    }
  };

  if (state === "saved")
    return (
      <p role="status" className="flex items-center gap-3 text-sm text-paper">
        <Check className="size-4 text-accent" /> Tudo certo. Você vai saber das novidades da AURA primeiro.
      </p>
    );

  if (state === "demo")
    return (
      <p role="status" className="rounded-lg border border-[#e9c46a]/30 px-4 py-3 text-sm leading-relaxed text-[#e9c46a]">
        Modo demonstração: o serviço de e-mail ainda não foi conectado, então este cadastro <strong>não foi salvo</strong>.
      </p>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <div className={`flex gap-2 ${compact ? "flex-row" : "flex-col sm:flex-row"}`}>
        <label htmlFor={`${id}-email`} className="sr-only">
          Seu e-mail
        </label>
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error && !consent ? undefined : !!error || undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className="field min-w-0 flex-1 rounded-full"
        />
        <button type="submit" disabled={state === "loading"} className="btn btn-primary shrink-0">
          {state === "loading" ? <LoaderCircle className="size-4 animate-spin" aria-label="Enviando" /> : (
            <>
              {cta} <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </div>
      <label className="mt-3 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-steel">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--aura-accent)]"
        />
        <span>
          Aceito receber comunicações da AURA FOR MEN. Posso cancelar quando quiser. Veja a{" "}
          <a href="/politica-de-privacidade" className="underline underline-offset-2 hover:text-paper">
            Política de privacidade
          </a>
          .
        </span>
      </label>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-2 text-xs text-[#f0a597]">
          {error}
        </p>
      )}
    </form>
  );
}
