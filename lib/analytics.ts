"use client";

/**
 * Eventos de analytics preparados para GA4 / Meta / TikTok via dataLayer.
 * Só são enviados após consentimento explícito de cookies analíticos.
 * Nenhum dado pessoal (e-mail, nome, CEP) é enviado nos eventos.
 */

export type AnalyticsEvent =
  | "view_item"
  | "quiz_start"
  | "quiz_complete"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase";

export const CONSENT_KEY = "aura-consent-v1";

export type ConsentState = "granted" | "denied" | null;

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: Exclude<ConsentState, null>) {
  try {
    window.localStorage.setItem(CONSENT_KEY, v);
  } catch {}
  window.dispatchEvent(new CustomEvent("aura:consent", { detail: v }));
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (getConsent() !== "granted") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

/**
 * "purchase" deve ser disparado somente pela página/webhook de confirmação
 * quando a plataforma retornar o pedido como pago. Não chamar em outro ponto.
 */
export const trackPurchase = (orderId: string, value: number) =>
  track("purchase", { transaction_id: orderId, value, currency: "BRL" });
