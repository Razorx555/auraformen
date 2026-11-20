import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Política de entrega", alternates: { canonical: "/entrega" } };

export default function Page() {
  return (
    <LegalPage
      title="Política de entrega"
      lead="Prazos, modalidades e acompanhamento dos pedidos AURA FOR MEN."
      topics={[
        { heading: "Área de entrega", note: "Regiões atendidas." },
        { heading: "Prazos e modalidades", note: "Calculados por CEP no checkout, conforme transportadora integrada." },
        { heading: "Prazo de postagem", note: "Tempo de separação após a confirmação do pagamento." },
        { heading: "Rastreamento", note: "Como acompanhar o pedido." },
        { heading: "Tentativas de entrega e extravio", note: "Procedimentos em caso de ausência ou problema no transporte." },
      ]}
    />
  );
}
