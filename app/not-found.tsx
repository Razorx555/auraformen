import Link from "next/link";
import { BrandSymbol } from "@/components/ui/brand";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[90svh] place-items-center overflow-hidden px-6 pt-20 text-center">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 w-[min(560px,90vw)] -translate-x-1/2 -translate-y-1/2 opacity-[0.07]">
        <BrandSymbol sizes="560px" className="h-auto w-full" />
      </div>
      <div className="relative">
        <p className="t-eyebrow text-steel">Erro 404</p>
        <h1 className="t-display mt-6">Esta página<br /><span className="text-chrome">não existe.</span></h1>
        <p className="t-lead mx-auto mt-6 max-w-md">Mas a sua aura continua aqui. Volte para a coleção.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">Página inicial</Link>
          <Link href="/colecao" className="btn btn-ghost">Ver coleção</Link>
        </div>
      </div>
    </section>
  );
}
