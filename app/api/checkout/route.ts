import { NextResponse } from "next/server";
import { createShopifyCheckout, shopifyConfig, shopifyVariantMap } from "@/lib/commerce/shopify";

type Body = {
  lines: { merchandiseId: string; quantity: number; attributes?: { key: string; value: string }[] }[];
  discountCodes?: string[];
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (!Array.isArray(body.lines) || body.lines.length === 0) {
    return NextResponse.json({ error: "empty_cart" }, { status: 400 });
  }

  if (!shopifyConfig()) {
    return NextResponse.json(
      {
        error: "not_configured",
        message: "Checkout ainda não conectado a uma plataforma de pagamento.",
        missing: ["NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN", "NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN", "shopifyVariantMap"],
      },
      { status: 503 },
    );
  }

  const unmapped = body.lines.filter((l) => !shopifyVariantMap[l.merchandiseId]);
  if (unmapped.length) {
    return NextResponse.json(
      { error: "unmapped_variants", items: unmapped.map((l) => l.merchandiseId) },
      { status: 422 },
    );
  }

  try {
    const cart = await createShopifyCheckout(
      body.lines.map((l) => ({
        merchandiseId: shopifyVariantMap[l.merchandiseId],
        quantity: Math.max(1, Math.min(10, Math.floor(l.quantity))),
        attributes: l.attributes,
      })),
      body.discountCodes ?? [],
    );
    return NextResponse.json({ checkoutUrl: cart.checkoutUrl });
  } catch (e) {
    return NextResponse.json(
      { error: "checkout_failed", message: e instanceof Error ? e.message : "Erro desconhecido" },
      { status: 502 },
    );
  }
}
