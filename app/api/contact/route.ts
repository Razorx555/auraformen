import { NextResponse } from "next/server";

/**
 * Formulário de contato. Configure CONTACT_WEBHOOK_URL e
 * NEXT_PUBLIC_CONTACT_ENABLED=true para encaminhar as mensagens.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();
  if (name.length < 2) return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  if (message.length < 10) return NextResponse.json({ error: "invalid_message" }, { status: 400 });

  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (!hook) return NextResponse.json({ status: "demo" }, { status: 202 });
  try {
    const r = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject: body?.subject ?? null, message }),
    });
    if (!r.ok) throw new Error(String(r.status));
    return NextResponse.json({ status: "sent" });
  } catch {
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }
}
