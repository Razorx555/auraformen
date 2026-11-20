import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Política de privacidade", alternates: { canonical: "/politica-de-privacidade" } };

export default function Page() {
  return (
    <LegalPage
      title="Política de privacidade"
      lead="Como a AURA FOR MEN coleta, usa e protege dados pessoais, em conformidade com a LGPD."
      topics={[
        { heading: "Controlador e encarregado (DPO)", note: "Razão social, CNPJ e canal de contato do encarregado." },
        { heading: "Dados coletados", note: "Cadastro, pedidos, newsletter, formulário de contato, cookies e navegação." },
        { heading: "Finalidades e bases legais", note: "Execução de contrato, consentimento, legítimo interesse e obrigações legais." },
        { heading: "Cookies e medição", note: "Categorias de cookies e como alterar o consentimento." },
        { heading: "Compartilhamento", note: "Plataforma de e-commerce, pagamento, logística e ferramentas de e-mail." },
        { heading: "Retenção e segurança", note: "Prazos de guarda e medidas de proteção." },
        { heading: "Direitos do titular", note: "Acesso, correção, exclusão, portabilidade e revogação do consentimento." },
      ]}
    />
  );
}
