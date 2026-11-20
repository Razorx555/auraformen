import type { Metadata } from "next";
import { AuraQuiz } from "@/components/quiz/aura-quiz";

export const metadata: Metadata = {
  title: "Descubra sua Aura",
  description:
    "Três perguntas rápidas para encontrar a fragrância AURA FOR MEN que combina com o seu estilo: HALO, EMBER ou ECLIPSE.",
  alternates: { canonical: "/descubra-sua-aura" },
};

export default function QuizPage() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pb-24 pt-28 md:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(191,195,204,0.08),transparent)]" />
      <div className="container-x relative">
        <AuraQuiz readSharedResult headingLevel="h1" />
        <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-steel">
          Como funciona: cada resposta soma um ponto para uma fragrância e a mais pontuada é sugerida. Em caso de empate,
          vale a resposta da última pergunta. Nenhum dado pessoal é coletado.
        </p>
      </div>
    </section>
  );
}
