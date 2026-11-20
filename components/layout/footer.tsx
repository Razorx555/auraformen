import Link from "next/link";
import { BrandLogo, BrandSymbol } from "@/components/ui/brand";
import { footerNav } from "@/data/site";
import { brand, storeConfig } from "@/data/store-config";
import { NewsletterForm } from "./newsletter-form";

export function Footer() {
  const c = storeConfig.company;
  const companyLines = [c.legalName, c.cnpj && `CNPJ ${c.cnpj}`, c.address].filter(Boolean) as string[];
  const contactLines = [c.email, c.phone, c.serviceHours].filter(Boolean) as string[];

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink pt-20 md:pt-28" data-aura="neutral">
      <div aria-hidden className="pointer-events-none absolute -bottom-[18%] left-1/2 w-[min(1100px,140vw)] -translate-x-1/2 opacity-[0.05]">
        <BrandSymbol sizes="1100px" className="h-auto w-full" />
      </div>

      <div className="container-x relative">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <div>
            <BrandLogo className="h-auto w-[180px] md:w-[220px]" />
            <p className="t-h2 mt-10 text-chrome">{brand.signature}</p>
            <p className="t-body mt-5 max-w-md">Presença não se explica. Se sente.</p>
          </div>
          <div>
            <h2 className="t-eyebrow text-steel">Primeiro a saber</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-chrome/80">
              Lançamentos, novas fragrâncias e edições especiais. Só o que importa.
            </p>
            <div className="mt-6 max-w-md">
              <NewsletterForm source="footer" />
            </div>
          </div>
        </div>

        <div className="hairline my-14" />

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
          {(
            [
              ["Explorar", footerNav.explorar],
              ["A marca", footerNav.marca],
              ["Políticas", footerNav.politicas],
            ] as const
          ).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h2 className="t-eyebrow text-steel">{title}</h2>
              <ul className="mt-5 space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-chrome/85 transition-colors hover:text-paper">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="t-eyebrow text-steel">Atendimento</h2>
            <ul className="mt-5 space-y-3 text-sm text-chrome/85">
              {contactLines.length ? (
                contactLines.map((l) => <li key={l}>{l}</li>)
              ) : (
                <li>
                  <Link href="/contato" className="hover:text-paper">
                    Fale com a AURA
                  </Link>
                </li>
              )}
            </ul>
            {storeConfig.social.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {storeConfig.social.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-chrome hover:text-paper">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/[0.06] py-8 text-xs text-steel md:flex-row md:items-center md:justify-between">
          <p>
            © {process.env.NEXT_PUBLIC_COPYRIGHT_YEAR ?? "2026"} AURA FOR MEN. Todos os direitos reservados.
          </p>
          {companyLines.length > 0 && <p>{companyLines.join(" · ")}</p>}
        </div>
      </div>
    </footer>
  );
}
