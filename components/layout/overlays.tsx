"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FlaskConical, X } from "lucide-react";
import { getConsent, setConsent, type ConsentState } from "@/lib/analytics";
import { storeConfig } from "@/data/store-config";

/** Banner de consentimento (LGPD). Analytics só dispara com "Aceitar". */
export function ConsentBanner() {
  const [state, setState] = useState<ConsentState | "loading">("loading");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lê o consentimento salvo no navegador após a hidratação
    setState(getConsent());
  }, []);
  const decide = (v: "granted" | "denied") => {
    setConsent(v);
    setState(v);
  };
  return (
    <AnimatePresence>
      {state === null && (
        <motion.div
          role="region"
          aria-label="Preferências de cookies"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.6 }}
          className="fixed inset-x-3 bottom-3 z-[60] md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md"
        >
          <div className="chrome-border rounded-2xl bg-graphite/95 p-5 shadow-2xl backdrop-blur-xl">
            <p className="text-sm leading-relaxed text-chrome">
              Usamos cookies essenciais para o site funcionar e, com a sua permissão, cookies de medição para melhorar a
              experiência. Saiba mais na{" "}
              <Link href="/politica-de-privacidade" className="text-paper underline underline-offset-2">
                Política de privacidade
              </Link>
              .
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => decide("granted")} className="btn btn-primary min-h-11 flex-1 px-4">
                Aceitar
              </button>
              <button type="button" onClick={() => decide("denied")} className="btn btn-ghost min-h-11 flex-1 px-4">
                Só essenciais
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Aviso discreto de ambiente de demonstração com as integrações pendentes. */
export function DemoNotice() {
  const [open, setOpen] = useState(false);
  const pending = [
    storeConfig.demoCommerce && "Preços, SKUs e estoque são demonstrativos",
    !storeConfig.shopify.configured && "Checkout (Shopify Storefront API) não conectado",
    !storeConfig.newsletterConfigured && "Serviço de e-mail/newsletter não conectado",
    !storeConfig.contactConfigured && "Formulário de contato não conectado",
    "Frete e cupons dependem da plataforma de e-commerce",
    "Textos legais aguardam validação jurídica",
  ].filter(Boolean) as string[];
  if (!storeConfig.demoCommerce && storeConfig.shopify.configured) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[55] hidden md:block">
      <AnimatePresence>
        {open && (
          <motion.div
            id="demo-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="chrome-border mb-2 w-80 rounded-xl bg-graphite/95 p-4 text-xs leading-relaxed text-chrome shadow-2xl backdrop-blur"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="t-eyebrow text-[#e9c46a]">Ambiente de demonstração</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar aviso" className="text-steel hover:text-paper">
                <X className="size-4" />
              </button>
            </div>
            <ul className="list-disc space-y-1 pl-4">
              {pending.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="demo-panel"
        className="flex items-center gap-2 rounded-full border border-[#e9c46a]/30 bg-ink/80 px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] text-[#e9c46a] backdrop-blur hover:border-[#e9c46a]/60"
      >
        <FlaskConical className="size-3.5" /> Demonstração
      </button>
    </div>
  );
}
