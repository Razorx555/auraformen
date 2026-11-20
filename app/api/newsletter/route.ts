import { NextResponse } from "next/server";

/**
 * Cadastro de interesse / newsletter.
 * Configure NEWSLETTER_WEBHOOK_URL (Klaviyo, RD Station, Mailchimp, Zapier,
 * Make etc.) e NEXT_PUBLIC_NEWSLETTER_ENABLED=true. Sem isso, responde
 * "demo" e a interface informa que nada foi salvo.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const consent = body?.consent === true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!consent) return NextResponse.json({ error: "consent_required" }, { status: 400 });

  const hook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!hook) return NextResponse.json({ status: "demo" }, { status: 202 });

  try {
    const r = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source: body?.source ?? "site",
        interest: body?.interest ?? null,
        consentAt: new Date().toISOString(),
      }),
    });
    if (!r.ok) throw new Error(String(r.status));
    return NextResponse.json({ status: "saved" });
  } catch {
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }
}
