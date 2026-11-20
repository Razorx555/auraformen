import { PageHeader, PendingNotice } from "./page-header";

/**
 * Estrutura editável para páginas legais. Enquanto `approvedContent` for null,
 * a página mostra apenas os tópicos a cobrir e um aviso de validação jurídica —
 * nenhum texto genérico é publicado como se estivesse validado.
 */
export function LegalPage({
  title,
  lead,
  topics,
  approvedContent = null,
  updatedAt = null,
}: {
  title: string;
  lead: string;
  topics: { heading: string; note: string }[];
  approvedContent?: { heading: string; body: string[] }[] | null;
  updatedAt?: string | null;
}) {
  return (
    <>
      <PageHeader eyebrow="Políticas" title={[title]} lead={lead} />
      <section className="pb-24 md:pb-32">
        <div className="container-x max-w-3xl">
          {approvedContent ? (
            <div className="space-y-12">
              {updatedAt && <p className="text-sm text-steel">Última atualização: {updatedAt}</p>}
              {approvedContent.map((s) => (
                <section key={s.heading}>
                  <h2 className="t-h3">{s.heading}</h2>
                  {s.body.map((p) => (
                    <p key={p} className="t-body mt-4">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          ) : (
            <>
              <PendingNotice>
                Conteúdo pendente de validação jurídica. O texto oficial será publicado após revisão. Em caso de dúvida,
                fale com a gente pela página de contato.
              </PendingNotice>
              <h2 className="t-eyebrow mt-12 text-steel">O que esta política vai abordar</h2>
              <ol className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                {topics.map((t, i) => (
                  <li key={t.heading} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
                    <span className="font-display text-sm tabular-nums text-steel">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-display text-lg uppercase tracking-wide">{t.heading}</h3>
                      <p className="mt-1 text-sm text-steel">{t.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </section>
    </>
  );
}
