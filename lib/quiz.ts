import type { FragranceId, QuizResult } from "./types";
import { quizQuestions, quizResultCopy } from "@/data/quiz";

/**
 * PONTUAÇÃO DO QUIZ — determinística e transparente
 * ---------------------------------------------------------------
 * Cada resposta soma 1 ponto à fragrância associada.
 * Vence a fragrância com mais pontos.
 *
 * Critério de desempate (documentado): com três perguntas, o único empate
 * possível é 1-1-1. Nesse caso vale a resposta da etapa 3 ("Como você prefere
 * expressar sua presença?"), por ser a pergunta mais direta sobre o estilo.
 *
 * O resultado é uma sugestão estética, não uma análise de personalidade.
 */
export function computeQuizResult(answers: Record<string, FragranceId>): QuizResult {
  const scores: Record<FragranceId, number> = { halo: 0, ember: 0, eclipse: 0 };
  for (const q of quizQuestions) {
    const a = answers[q.id];
    if (a) scores[a] += 1;
  }
  const max = Math.max(...Object.values(scores));
  const leaders = (Object.keys(scores) as FragranceId[]).filter((k) => scores[k] === max);

  let winner: FragranceId = leaders[0];
  let tieBreak = false;
  if (leaders.length > 1) {
    tieBreak = true;
    const decisive = answers[quizQuestions[quizQuestions.length - 1].id];
    winner = decisive && leaders.includes(decisive) ? decisive : leaders[0];
  }
  return { fragranceId: winner, ...quizResultCopy[winner], scores, tieBreak };
}
