import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Trocas e devoluções", alternates: { canonical: "/trocas-e-devolucoes" } };

export default function Page() {
  return (
    <LegalPage
      title="Trocas e devoluções"
      lead="Como solicitar troca, devolução ou exercer o direito de arrependimento."
      topics={[
        { heading: "Direito de arrependimento", note: "Prazo e procedimento para compras on-line, conforme o Código de Defesa do Consumidor." },
        { heading: "Produtos com defeito", note: "Prazos e como acionar a garantia." },
        { heading: "Condições do produto", note: "Critérios para cosméticos abertos ou lacrados." },
        { heading: "Como solicitar", note: "Canal de atendimento e informações necessárias." },
        { heading: "Reembolso", note: "Forma e prazo de estorno." },
        { heading: "Frete de devolução", note: "Responsabilidade pelo custo em cada caso." },
      ]}
    />
  );
}
