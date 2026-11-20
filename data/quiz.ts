import type { QuizQuestion } from "@/lib/types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "atmosfera",
    step: 1,
    question: "Qual atmosfera mais combina com você?",
    visual: false,
    options: [
      { id: "a", label: "Leveza e elegância.", points: "halo" },
      { id: "b", label: "Calor e intensidade.", points: "ember" },
      { id: "c", label: "Mistério e personalidade.", points: "eclipse" },
    ],
  },
  {
    id: "cenario",
    step: 2,
    question: "Qual cenário representa seu estilo?",
    visual: true,
    options: [
      { id: "a", label: "Um ambiente moderno, claro e sofisticado.", points: "halo", visual: "halo" },
      { id: "b", label: "Uma noite envolvente, iluminada em tons quentes.", points: "ember", visual: "ember" },
      { id: "c", label: "Uma atmosfera noturna, minimalista e misteriosa.", points: "eclipse", visual: "eclipse" },
    ],
  },
  {
    id: "expressao",
    step: 3,
    question: "Como você prefere expressar sua presença?",
    visual: false,
    options: [
      { id: "a", label: "De maneira natural.", points: "halo" },
      { id: "b", label: "Com intensidade.", points: "ember" },
      { id: "c", label: "Com personalidade marcante.", points: "eclipse" },
    ],
  },
];

export const quizResultCopy = {
  halo: {
    title: "Sua aura é HALO.",
    description: "Você se identifica com uma elegância natural e uma atmosfera de frescor e leveza.",
  },
  ember: {
    title: "Sua aura é EMBER.",
    description: "Você se identifica com intensidade, calor e uma presença envolvente.",
  },
  eclipse: {
    title: "Sua aura é ECLIPSE.",
    description: "Você prefere o contraste, o mistério e uma identidade visual marcante.",
  },
} as const;
