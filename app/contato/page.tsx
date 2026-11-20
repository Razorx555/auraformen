import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/layout/contact-form";
import { storeConfig } from "@/data/store-config";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a AURA FOR MEN: dúvidas sobre produtos, pedidos, trocas e parcerias.",
  alternates: { canonical: "/contato" },
};

export default function ContactPage() {
  const c = storeConfig.company;
  const channels = [
    c.email && { label: "E-mail", value: c.email, href: `mailto:${c.email}` },
    c.whatsapp && { label: "WhatsApp", value: c.whatsapp, href: `https://wa.me/${c.whatsapp.replace(/\D/g, "")}` },
    c.phone && { label: "Telefone", value: c.phone, href: `tel:${c.phone.replace(/\s/g, "")}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <>
      <PageHeader eyebrow="Atendimento" title={["Fale com", <span key="c" className="text-chrome">a AURA.</span>]} lead="Dúvidas sobre fragrâncias, pedidos ou parcerias. Escreva para a gente." />
      <section className="pb-24 md:pb-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
          <ContactForm />
          <aside className="space-y-8">
            {channels.length > 0 && (
              <div>
                <h2 className="t-eyebrow text-steel">Canais</h2>
                <ul className="mt-4 space-y-3">
                  {channels.map((ch) => (
                    <li key={ch.label}>
                      <a href={ch.href} className="group block rounded-2xl border border-white/10 p-5 hover:border-white/25">
                        <span className="t-eyebrow text-steel">{ch.label}</span>
                        <span className="mt-1 block text-lg text-paper">{ch.value}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {c.serviceHours && (
              <div>
                <h2 className="t-eyebrow text-steel">Horário de atendimento</h2>
                <p className="mt-3 text-paper">{c.serviceHours}</p>
              </div>
            )}
            {(c.legalName || c.cnpj || c.address) && (
              <div className="text-sm text-steel">
                {c.legalName && <p>{c.legalName}</p>}
                {c.cnpj && <p>CNPJ {c.cnpj}</p>}
                {c.address && <p>{c.address}</p>}
              </div>
            )}
            <div>
              <h2 className="t-eyebrow text-steel">Respostas rápidas</h2>
              <p className="t-body mt-3">
                Volume, diferenças entre as fragrâncias e como funciona o quiz estão nas{" "}
                <a href="/faq" className="text-paper underline underline-offset-4">perguntas frequentes</a>.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
