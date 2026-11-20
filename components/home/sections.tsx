import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, TextReveal } from "@/components/animations/reveal";
import { AuraQuiz } from "@/components/quiz/aura-quiz";
import { BrandSymbol, Eyebrow, Price } from "@/components/ui/brand";
import { FragranceVisual } from "@/components/products/fragrance-visual";
import { AddToBag } from "@/components/products/add-to-bag";
import { KitTrioFeature } from "@/components/products/kit-feature";
import { fragranceImages, fragrances, fragranceOrder } from "@/data/fragrances";
import { getProduct } from "@/data/products";
import { storeConfig } from "@/data/store-config";

/* Cena 3 — Descoberta */
export function QuizSection() {
  return (
    <section id="descubra" aria-label="Descubra sua aura" className="relative scroll-mt-20 bg-ink py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="t-eyebrow mb-8 text-center text-steel">Seu estilo diz muito. Sua escolha também.</p>
          <AuraQuiz />
        </Reveal>
      </div>
    </section>
  );
}

/* Cena 4 — Desejo: detalhes reais do produto (somente o que está no rótulo oficial) */
export function DetailsSection() {
  const details = [
    { k: "200 ml", v: "Frasco de 200 ml (6,76 fl. oz.) para acompanhar sua rotina." },
    { k: "Spray", v: "Body splash com válvula spray: aplicação leve e uniforme." },
    { k: "Assinatura", v: "Frasco preto com a tipografia AURA em acabamento iridescente." },
    { k: "Selo", v: "Authentic Aura · Signature Series em cada frasco." },
  ];
  const img = fragranceImages.ember;
  return (
    <section aria-labelledby="details-title" className="relative overflow-hidden bg-ink py-24 md:py-36" data-aura="ember">
      <div className="container-x grid gap-14 md:grid-cols-2 md:items-center lg:gap-24">
        <Reveal className="relative">
          <div className="chrome-border relative aspect-[4/5] overflow-hidden rounded-[28px]">
            <Image
              src={img.src}
              alt="Detalhe do rótulo do frasco AURA FOR MEN EMBER: nome, volume de 200 ml e selo Authentic Aura Signature Series"
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
              style={{ transform: "scale(1.7)", transformOrigin: "50% 78%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </div>
          <p className="t-eyebrow mt-4 text-steel">Detalhe · EMBER</p>
        </Reveal>
        <div>
          <Eyebrow>Os detalhes também contam sua história</Eyebrow>
          <TextReveal as="h2" className="t-h2 mt-6" lines={["Feito para", "ser notado", <span key="d" className="text-chrome">nos detalhes.</span>]} />
          <ul className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {details.map((d, i) => (
              <Reveal as="li" key={d.k} delay={i * 0.08} className="grid grid-cols-[7.75rem_1fr] items-baseline gap-4 py-5">
                <span className="font-display text-lg uppercase tracking-wider text-accent">{d.k}</span>
                <span className="t-body text-chrome/85">{d.v}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* Comparação: proposta estética, não desempenho */
export function ComparisonSection() {
  const rows: { key: keyof (typeof fragrances)["halo"]["aesthetic"]; label: string }[] = [
    { key: "atmosfera", label: "Atmosfera" },
    { key: "estilo", label: "Estilo" },
    { key: "identidade", label: "Identidade" },
  ];
  return (
    <section aria-labelledby="compare-title" className="relative bg-graphite/40 py-24 md:py-32">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="container-x">
        <div className="max-w-3xl">
          <Eyebrow>Compare</Eyebrow>
          <h2 id="compare-title" className="t-h2 mt-6">
            Qual aura combina com o seu momento?
          </h2>
          <p className="t-body mt-5 max-w-xl">
            Atributos da proposta estética de cada fragrância — o universo visual e a personalidade que ela expressa. Não se
            trata de pirâmide olfativa ou de desempenho do produto.
          </p>
        </div>

        {/* Desktop/tablet: tabela lado a lado */}
        <div className="mt-14 hidden overflow-hidden rounded-3xl border border-white/[0.08] md:block">
          <table className="w-full table-fixed text-left">
            <caption className="sr-only">Comparação estética entre HALO, EMBER e ECLIPSE</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[18%] p-6" />
                {fragranceOrder.map((id) => (
                  <th key={id} scope="col" data-aura={id} className="p-6 align-bottom">
                    <span className="mb-3 block h-1 w-10 rounded-full bg-accent" />
                    <span className="font-display text-2xl font-semibold uppercase tracking-[0.12em]">{fragrances[id].name}</span>
                    <span className="mt-1 block text-sm font-normal text-steel">{fragrances[id].tagline}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-t border-white/[0.07]">
                  <th scope="row" className="t-eyebrow p-6 font-normal text-steel">
                    {r.label}
                  </th>
                  {fragranceOrder.map((id) => (
                    <td key={id} className="p-6 text-lg text-paper">
                      {fragrances[id].aesthetic[r.key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-white/[0.07]">
                <td />
                {fragranceOrder.map((id) => (
                  <td key={id} className="p-6">
                    <Link href={`/fragrancias/${id}`} className="btn-link">
                      Ver {fragrances[id].name} <ArrowRight className="size-3.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile: atributos agrupados, leitura vertical */}
        <div className="mt-12 space-y-8 md:hidden">
          {rows.map((r) => (
            <div key={r.key}>
              <h3 className="t-eyebrow text-steel">{r.label}</h3>
              <ul className="mt-3 divide-y divide-white/[0.07] rounded-2xl border border-white/[0.08]">
                {fragranceOrder.map((id) => (
                  <li key={id} data-aura={id} className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <span className="flex items-center gap-3 font-display text-sm uppercase tracking-[0.14em]">
                      <span className="size-2 rounded-full bg-accent" aria-hidden /> {fragrances[id].name}
                    </span>
                    <span className="text-right text-sm text-paper">{fragrances[id].aesthetic[r.key]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Cena 5 — Escolha */
export function ShopSection() {
  return (
    <section id="comprar" aria-labelledby="shop-title" className="relative scroll-mt-20 bg-ink py-24 md:py-36">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Escolha sua aura</Eyebrow>
            <TextReveal as="h2" className="t-display mt-6" lines={["Três fragrâncias.", <span key="s" className="text-chrome">Encontre a sua.</span>]} />
          </div>
          <Link href="/colecao" className="btn-link self-start md:self-auto">
            Ver coleção completa <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {fragranceOrder.map((id, i) => (
            <Reveal as="li" key={id} delay={i * 0.1}>
              <ProductCard handle={id} />
            </Reveal>
          ))}
        </ul>
        <div className="mt-24 md:mt-32">
          <KitTrioFeature />
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ handle, headingLevel = "h3" }: { handle: string; headingLevel?: "h2" | "h3" }) {
  const p = getProduct(handle)!;
  const f = fragrances[p.fragranceId!];
  const v = p.variants[0];
  const H = headingLevel;
  return (
    <article data-aura={f.id} className="group flex h-full flex-col">
      <Link href={`/fragrancias/${p.handle}`} className="chrome-border relative block overflow-hidden rounded-[24px]" tabIndex={-1} aria-hidden>
        <div className="relative aspect-[4/5]">
          <FragranceVisual id={f.id} sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw" className="absolute inset-0" imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]" decorative />
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <H className="font-display text-2xl font-semibold uppercase tracking-[0.1em]">
              <Link href={`/fragrancias/${p.handle}`} className="hover:text-accent">
                {p.title}
              </Link>
            </H>
            <p className="mt-1 text-sm text-steel">
              {p.category} · {p.volumeMl} ml
            </p>
          </div>
          {storeConfig.mode === "live" && (
            <Price value={v.price} compareAt={v.compareAtPrice} className="flex-col items-end text-lg" />
          )}
        </div>
        <p className="mt-3 text-sm text-chrome/80">{f.tagline}</p>
        {storeConfig.mode === "live" && p.demo && storeConfig.demoCommerce && (
          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#e9c46a]/80">Preço demonstrativo</p>
        )}
        <div className="mt-auto grid grid-cols-[1fr_auto] gap-3 pt-6">
          {storeConfig.mode === "live" ? (
            <AddToBag handle={p.handle} />
          ) : (
            <Link href="/#lancamento" className="btn btn-primary">
              Quero saber do lançamento
            </Link>
          )}
          <Link href={`/fragrancias/${p.handle}`} className="btn btn-ghost px-5" aria-label={`Ver detalhes de ${p.title}`}>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* Cena 6 — Marca */
export function UniverseSection() {
  return (
    <section aria-labelledby="universe-title" className="relative isolate overflow-hidden bg-ink py-28 md:py-44">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[min(1000px,130vw)] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]">
        <div className="sheen-slow relative">
          <BrandSymbol sizes="1000px" className="h-auto w-full" />
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,transparent,#050505_85%)]" />
      <div className="container-x text-center">
        <Reveal>
          <p className="t-eyebrow text-steel">Não é sobre ser igual. É sobre ter identidade.</p>
        </Reveal>
        <TextReveal as="h2" className="t-display mx-auto mt-8 max-w-5xl" lines={["Mais que uma fragrância.", <span key="u" className="text-chrome">Uma identidade.</span>]} />
        <Reveal delay={0.2} className="mx-auto mt-14 max-w-2xl space-y-6">
          <p className="font-display text-xl leading-relaxed text-paper md:text-2xl">
            Existe algo em você que não cabe em uma descrição.
          </p>
          <p className="t-lead">
            Não é só o que veste. Não é só o que diz. Não é apenas como chega. É a sua maneira de estar presente. Seu
            estilo. Seus detalhes. Suas escolhas.
          </p>
          <p className="font-display text-xl uppercase tracking-[0.18em] text-paper">A gente chama isso de AURA.</p>
          <div className="hairline mx-auto my-10 w-40" />
          <p className="t-body mx-auto max-w-xl">
            AURA FOR MEN nasceu para transformar a escolha de uma fragrância em uma expressão de estilo. Cada criação da
            Signature Series apresenta um universo próprio, pensado para quem valoriza os detalhes e a maneira como se
            apresenta ao mundo.
          </p>
          <Link href="/sobre" className="btn btn-ghost mt-6">
            Conheça nossa história <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
