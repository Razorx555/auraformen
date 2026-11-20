import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/ui/json-ld";
import { faq } from "@/data/site";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description: "Volume, diferenças entre HALO, EMBER e ECLIPSE, quiz Descubra sua Aura, pagamento, entrega e trocas.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const verified = faq.filter((f) => !f.pending);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: verified.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <PageHeader eyebrow="Ajuda" title={["Perguntas", <span key="f" className="text-chrome">frequentes.</span>]} />
      <section className="pb-24 md:pb-32">
        <div className="container-x max-w-3xl">
          <ul className="border-t border-white/[0.08]">
            {faq.map((f) => (
              <li key={f.q} className="border-b border-white/[0.08]">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                    <h2 className="font-display text-lg uppercase tracking-wide md:text-xl">{f.q}</h2>
                    <Plus className="size-5 shrink-0 text-steel transition-transform duration-300 group-open:rotate-45" aria-hidden />
                  </summary>
                  <div className="pb-7 pr-10">
                    <p className="t-body">{f.a}</p>
                    {f.pending && <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#e9c46a]/80">Informação em definição</p>}
                  </div>
                </details>
              </li>
            ))}
          </ul>
          <p className="t-body mt-12">
            Não encontrou o que procurava?{" "}
            <Link href="/contato" className="text-paper underline underline-offset-4">
              Fale com a gente
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
