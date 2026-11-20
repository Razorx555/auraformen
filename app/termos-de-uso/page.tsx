import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Termos de uso", alternates: { canonical: "/termos-de-uso" } };

export default function Page() {
  return (
    <LegalPage
      title="Termos de uso"
      lead="Condições de uso do site e de compra na loja AURA FOR MEN."
      topics={[
        { heading: "Identificação da empresa", note: "Razão social, CNPJ, endereço e contato (Decreto 7.962/2013)." },
        { heading: "Uso do site", note: "Regras de acesso e conduta." },
        { heading: "Produtos, preços e disponibilidade", note: "Como preços, estoque e ofertas são exibidos." },
        { heading: "Pedidos e pagamento", note: "Confirmação, meios de pagamento e cancelamento." },
        { heading: "Propriedade intelectual", note: "Marca, imagens e conteúdos da AURA FOR MEN." },
        { heading: "Foro e legislação aplicável", note: "Definido pela assessoria jurídica." },
      ]}
    />
  );
}
