import Image from "next/image";
import { brand, storeConfig } from "@/data/store-config";
import { formatMoney } from "@/lib/format";
import type { Money } from "@/lib/types";

/** Logotipo oficial (recorte com transparência do arquivo enviado pela marca). */
export function BrandLogo({ className, preload = false }: { className?: string; preload?: boolean }) {
  return (
    <Image
      src={brand.logo.src}
      alt={brand.logo.alt}
      width={brand.logo.width}
      height={brand.logo.height}
      preload={preload}
      sizes="(max-width: 768px) 140px, 180px"
      className={className}
    />
  );
}

export function BrandSymbol({ className, sizes = "200px", eager = false }: { className?: string; sizes?: string; eager?: boolean }) {
  return (
    <Image
      src={brand.symbol.src}
      alt=""
      aria-hidden
      width={brand.symbol.width}
      height={brand.symbol.height}
      sizes={sizes}
      loading={eager ? "eager" : undefined}
      fetchPriority={eager ? "high" : undefined}
      className={className}
    />
  );
}

export function DemoBadge({ label = "Valor demonstrativo" }: { label?: string }) {
  return (
    <span className="demo-badge" title="Dado comercial de demonstração — será substituído pelo valor oficial">
      {label}
    </span>
  );
}

export function Price({
  value,
  compareAt,
  demo,
  className,
}: {
  value: Money;
  compareAt?: Money | null;
  demo?: boolean;
  className?: string;
}) {
  const showCompare = compareAt && compareAt.amount > value.amount;
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-3 gap-y-1 ${className ?? ""}`}>
      {showCompare && (
        <s className="text-steel text-sm">
          <span className="sr-only">De </span>
          {formatMoney(compareAt)}
        </s>
      )}
      <span className="font-display tabular-nums tracking-tight">
        {showCompare && <span className="sr-only">por </span>}
        {formatMoney(value)}
      </span>
      {demo && storeConfig.demoCommerce && <DemoBadge />}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`t-eyebrow flex items-center gap-3 text-steel ${className ?? ""}`}>
      <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-chrome/60" />
      {children}
    </p>
  );
}
