"use client";

import { useState } from "react";
import { LoaderCircle, Check } from "lucide-react";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "sent" | "demo" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const errs: Errors = {};
    if ((data.name ?? "").trim().length < 2) errs.name = "Informe seu nome.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((data.email ?? "").trim())) errs.email = "Informe um e-mail válido.";
    if ((data.message ?? "").trim().length < 10) errs.message = "Escreva sua mensagem (mínimo de 10 caracteres).";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("loading");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await r.json().catch(() => ({}));
      setState(json.status === "sent" ? "sent" : json.status === "demo" ? "demo" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "sent")
    return (
      <p role="status" className="flex items-center gap-3 rounded-2xl border border-white/10 p-6 text-paper">
        <Check className="size-5 text-accent" /> Mensagem enviada. Responderemos pelo e-mail informado.
      </p>
    );
  if (state === "demo")
    return (
      <p role="status" className="rounded-2xl border border-[#e9c46a]/30 p-6 text-sm leading-relaxed text-[#e9c46a]">
        Modo demonstração: o canal de atendimento ainda não foi conectado, então esta mensagem <strong>não foi enviada</strong>.
      </p>
    );

  const field = (name: keyof Errors, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label htmlFor={`c-${name}`} className="t-eyebrow text-steel">
        {label}
      </label>
      <input id={`c-${name}`} name={name} className="field mt-2" aria-invalid={!!errors[name] || undefined} aria-describedby={errors[name] ? `c-${name}-err` : undefined} {...props} />
      {errors[name] && (
        <p id={`c-${name}-err`} className="mt-1.5 text-xs text-[#f0a597]">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Nome", { autoComplete: "name" })}
        {field("email", "E-mail", { type: "email", autoComplete: "email", inputMode: "email" })}
      </div>
      <div>
        <label htmlFor="c-subject" className="t-eyebrow text-steel">
          Assunto
        </label>
        <select id="c-subject" name="subject" className="field mt-2">
          <option>Dúvida sobre produto</option>
          <option>Pedido e entrega</option>
          <option>Trocas e devoluções</option>
          <option>Parcerias e imprensa</option>
          <option>Outro</option>
        </select>
      </div>
      <div>
        <label htmlFor="c-message" className="t-eyebrow text-steel">
          Mensagem
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={5}
          className="field mt-2 min-h-36 py-3"
          aria-invalid={!!errors.message || undefined}
          aria-describedby={errors.message ? "c-message-err" : undefined}
        />
        {errors.message && (
          <p id="c-message-err" className="mt-1.5 text-xs text-[#f0a597]">
            {errors.message}
          </p>
        )}
      </div>
      {state === "error" && (
        <p role="alert" className="text-sm text-[#f0a597]">
          Não foi possível enviar agora. Tente novamente em instantes.
        </p>
      )}
      <button type="submit" disabled={state === "loading"} className="btn btn-primary">
        {state === "loading" ? <LoaderCircle className="size-4 animate-spin" /> : "Enviar mensagem"}
      </button>
    </form>
  );
}
