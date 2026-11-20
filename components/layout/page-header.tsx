import { TextReveal } from "@/components/animations/reveal";
import { Eyebrow } from "@/components/ui/brand";

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode[];
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden pb-14 pt-32 md:pb-20 md:pt-44">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_80%_0%,color-mix(in_srgb,var(--aura-accent)_10%,transparent),transparent)]" />
      <div className="container-x relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <TextReveal as="h1" immediate className="t-display mt-6 max-w-5xl" lines={title} />
        {lead && <p className="t-lead mt-7 max-w-2xl">{lead}</p>}
        {children}
      </div>
    </header>
  );
}

/** Aviso padrão para conteúdo que aguarda dados oficiais. */
export function PendingNotice({ children }: { children: React.ReactNode }) {
  return (
    <div role="note" className="rounded-2xl border border-[#e9c46a]/30 bg-[#e9c46a]/[0.04] p-5 text-sm leading-relaxed text-[#e9c46a]">
      {children}
    </div>
  );
}
