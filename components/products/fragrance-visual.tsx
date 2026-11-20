import Image from "next/image";
import { fragranceImages } from "@/data/fragrances";
import type { FragranceId } from "@/lib/types";

/**
 * Imagem oficial da fragrância em moldura responsiva.
 * Sempre object-cover com foco no frasco; molduras verticais preservam o rótulo.
 */
export function FragranceVisual({
  id,
  sizes,
  className,
  imgClassName,
  preload = false,
  decorative = false,
}: {
  id: FragranceId;
  sizes: string;
  className?: string;
  imgClassName?: string;
  preload?: boolean;
  decorative?: boolean;
}) {
  const img = fragranceImages[id];
  return (
    <div className={`overflow-hidden ${className?.includes("absolute") ? "" : "relative"} ${className ?? ""}`}>
      <Image
        src={img.src}
        alt={decorative ? "" : img.alt}
        fill
        sizes={sizes}
        loading={preload ? "eager" : undefined}
        fetchPriority={preload ? "high" : undefined}
        className={`object-cover ${imgClassName ?? ""}`}
        style={{ objectPosition: img.focal }}
      />
    </div>
  );
}
