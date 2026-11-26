import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowRight } from "lucide-react";
import { fragranceImages, fragrances, fragranceOrder, isFragranceId } from "@/data/fragrances";
import { getProduct } from "@/data/products";
import { storeConfig } from "@/data/store-config";
import { FragranceVisual } from "@/components/products/fragrance-visual";
import { AmbientVideo } from "@/components/products/ambient-video";
import { Gallery } from "@/components/products/gallery";
import { NotesPanel, PurchasePanel } from "@/components/products/purchase-panel";
import { Reveal, TextReveal } from "@/components/animations/reveal";
import { Eyebrow } from "@/components/ui/brand";
import { JsonLd } from "@/components/ui/json-ld";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return fragranceOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isFragranceId(slug)) return {};
  const f = fragrances[slug];
  const img = fragranceImages[slug];
  return {
    title: `${f.name} — ${f.tagline}`,
    description: `AURA FOR MEN ${f.name}, body splash masculino de 200 ml da Signature Series. ${f.story[1]}`,
    alternates: { canonical: `/fragrancias/${slug}` },
    openGraph: {
      title: `AURA FOR MEN ${f.name} — ${f.tagline}`,
      images: [{ url: img.src, width: img.width, height: img.height, alt: img.alt }],
    },
  };
}

export default async function FragrancePage({ params }: Props) {
  const { slug } = await params;
  if (!isFragranceId(slug)) notFound();
  const f = fragrances[slug];
  const product = getProduct(slug)!;
  const img = fragranceImages[slug];
  const v = product.variants[0];
  const others = fragranceOrder.filter((id) => id !== slug);

  // Product Schema somente com dados verificados. Oferta (preço) só quando real.
  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.fullName,
    brand: { "@type": "Brand", name: "AURA FOR MEN" },
    category: "Body Splash",
    description: product.description,
    image: `${storeConfig.siteUrl}${img.src}`,
    size: "200 ml",
    ...(!product.demo && !storeConfig.demoCommerce
      ? {
          sku: v.sku,
          offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: v.price.amount.toFixed(2),
            availability: v.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${storeConfig.siteUrl}/fragrancias/${slug}`,
          },
        }
      : {}),
  };

  return (
    <article data-aura={slug} style={{ backgroundColor: f.palette.base }}>
      <JsonLd data={productLd} />

      {/* Abertura imersiva */}
      <section className="grain relative isolate flex min-h-[100svh] items-end overflow-hidden pb-14 pt-24 md:items-center md:pb-20">
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image src={img.src} alt="" fill preload sizes="100vw" className="scale-110 object-cover opacity-35 blur-2xl" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${f.palette.base}00 0%, ${f.palette.base}cc 70%, ${f.palette.base} 100%)` }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(60% 60% at 70% 45%, ${f.palette.accent}30, transparent 70%)` }} />
        </div>
        <div className="container-x grid w-full gap-10 md:grid-cols-[1fr_0.9fr] md:items-center lg:gap-16">
          <div className="order-2 md:order-1">
            <Eyebrow>Signature Series · Body Splash 200 ml</Eyebrow>
            <TextReveal as="h1" immediate className="mt-6 font-display text-[clamp(4rem,15vw,11rem)] font-semibold uppercase leading-[0.85] tracking-[-0.04em]" lines={[f.name]} />
            <p className="t-h3 mt-6 text-accent">{f.tagline}</p>
            <p className="t-lead mt-5 max-w-md">{f.story[1]}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#comprar" className="btn btn-primary sheen">
                {storeConfig.mode === "live" ? "Ver detalhes e comprar" : "Quero saber do lançamento"} <ArrowDown className="size-4" />
              </a>
              <a href="#universo" className="btn btn-ghost">
                Explorar o universo
              </a>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="chrome-border relative mx-auto aspect-[4/5] w-[78%] max-w-[480px] overflow-hidden rounded-t-[999px] rounded-b-[32px] shadow-[0_60px_140px_-40px_var(--aura-accent)] md:w-full">
              <FragranceVisual id={slug} preload sizes="(max-width: 768px) 78vw, 40vw" className="absolute inset-0" />
              <AmbientVideo id={slug} className="absolute inset-0 h-full w-full object-cover" eager />
            </div>
          </div>
        </div>
      </section>

      {/* Narrativa */}
      <section id="universo" className="relative scroll-mt-20 py-24 md:py-36">
        <div className="container-x">
          <Eyebrow>O universo {f.name}</Eyebrow>
          <TextReveal as="h2" className="t-display mt-8 max-w-5xl" lines={[f.headline]} />
          <div className="mt-16 grid gap-12 md:grid-cols-[1fr_1fr] md:gap-20">
            <Reveal>
              <ul className="space-y-1">
                {f.concept.map((c, i) => (
                  <li key={c} className="flex items-baseline gap-5 border-b border-white/[0.08] py-4">
                    <span className="font-display text-xs tabular-nums text-steel">0{i + 1}</span>
                    <span className="font-display text-[clamp(1.75rem,3.6vw,3rem)] font-semibold uppercase leading-none tracking-[-0.02em]">
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15} className="md:pt-4">
              <p className="t-lead">{f.story[0]}</p>
              <div className="hairline my-10" />
              <p className="t-name text-lg text-paper">{f.signature}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Compra */}
      <section aria-label={`Comprar ${f.name}`} className="relative py-20 md:py-28">
        <div className="hairline absolute inset-x-0 top-0" />
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Gallery images={product.images} videoUrl={product.videoUrl} name={product.fullName} />
          <div>
            <PurchasePanel handle={slug} />
            {f.notes && (
              <div className="mt-14">
                <h2 className="t-eyebrow mb-5 text-steel">Composição olfativa</h2>
                <NotesPanel handle={slug} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Outros universos */}
      <section className="relative bg-ink py-24 md:py-32" data-aura="neutral">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>Explore outros universos</Eyebrow>
              <h2 className="t-h2 mt-6">Cada versão sua tem uma aura.</h2>
            </div>
            <Link href="/descubra-sua-aura" className="btn-link">
              Em dúvida? Descubra sua aura <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {others.map((id) => (
              <li key={id} data-aura={id}>
                <Link href={`/fragrancias/${id}`} className="group chrome-border relative block overflow-hidden rounded-[28px] bg-graphite">
                  <div className="grid grid-cols-[0.8fr_1fr] items-center">
                    <div className="relative aspect-[4/5]">
                      <FragranceVisual id={id} sizes="(max-width: 640px) 40vw, 22vw" className="absolute inset-0" imgClassName="transition-transform duration-[1.2s] group-hover:scale-105" decorative />
                    </div>
                    <div className="p-6 md:p-10">
                      <p className="font-display text-3xl font-semibold uppercase tracking-[0.08em] md:text-5xl">{fragrances[id].name}</p>
                      <p className="mt-2 text-sm text-chrome">{fragrances[id].tagline}</p>
                      <span className="btn-link mt-6 text-accent">
                        {fragrances[id].cta} <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
