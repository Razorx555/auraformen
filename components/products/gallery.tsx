"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/format";
import type { ImageAsset } from "@/lib/types";

/**
 * Galeria preparada para: frontal, lateral, detalhe, ambiente e vídeo oficial.
 * Exibe SOMENTE mídias reais cadastradas em data/products.ts (ou na Shopify).
 * Mobile: deslize horizontal (gestos nativos com scroll-snap).
 */
export function Gallery({ images, videoUrl, name }: { images: ImageAsset[]; videoUrl?: string | null; name: string }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const total = images.length + (videoUrl ? 1 : 0);

  const goTo = (i: number) => {
    setActive(i);
    const el = track.current;
    if (el) el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  };

  return (
    <div className="lg:sticky lg:top-28">
      <div
        ref={track}
        onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="no-scrollbar chrome-border flex snap-x snap-mandatory overflow-x-auto rounded-[28px]"
        aria-roledescription="galeria"
        aria-label={`Imagens de ${name}`}
      >
        {images.map((img, i) => (
          <div key={img.src} className="relative aspect-[4/5] w-full shrink-0 snap-center" aria-label={`${i + 1} de ${total}`}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={85}
              className="object-cover"
              style={{ objectPosition: img.focal }}
            />
          </div>
        ))}
        {videoUrl && (
          <div className="relative aspect-[4/5] w-full shrink-0 snap-center bg-ink">
            <video src={videoUrl} controls playsInline preload="metadata" className="h-full w-full object-cover" aria-label={`Vídeo oficial ${name}`} />
          </div>
        )}
      </div>
      {total > 1 && (
        <div className="mt-4 flex gap-3" role="group" aria-label="Escolher imagem">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver imagem ${i + 1}`}
              aria-current={active === i}
              className={cn(
                "relative aspect-[4/5] w-16 overflow-hidden rounded-lg border transition",
                active === i ? "border-paper" : "border-white/10 opacity-60 hover:opacity-100",
              )}
            >
              <Image src={img.src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
