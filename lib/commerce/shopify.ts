/**
 * Camada de integração com a Shopify Storefront API.
 * ---------------------------------------------------------------
 * Ativada quando NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN e
 * NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN estiverem definidos.
 *
 * Enquanto não estiver configurada, NENHUM pagamento é simulado: o checkout
 * responde "not_configured" e a interface explica o que falta.
 */

const API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-10";

/**
 * Mapeamento entre as variantes locais e as variantes da Shopify (GIDs).
 * Preencher após cadastrar os produtos na Shopify, ex.:
 *   "var-halo-200": "gid://shopify/ProductVariant/1234567890"
 * Kits: cadastrar como produto próprio (SKU e estoque próprios) ou usar bundles.
 */
export const shopifyVariantMap: Record<string, string> = {
  // "var-halo-200": "",
  // "var-ember-200": "",
  // "var-eclipse-200": "",
  // "kit-signature-trio": "",
  // "kit-duo": "",
};

export function shopifyConfig() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
  return domain && token ? { domain, token } : null;
}

export async function storefrontFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const cfg = shopifyConfig();
  if (!cfg) throw new Error("shopify_not_configured");
  const res = await fetch(`https://${cfg.domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": cfg.token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`shopify_http_${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message ?? "shopify_error");
  return json.data as T;
}

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

export type CheckoutLineInput = {
  merchandiseId: string;
  quantity: number;
  attributes?: { key: string; value: string }[];
};

export async function createShopifyCheckout(lines: CheckoutLineInput[], discountCodes: string[] = []) {
  const data = await storefrontFetch<{
    cartCreate: { cart: { id: string; checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(CART_CREATE, { input: { lines, discountCodes, buyerIdentity: { countryCode: "BR" } } });
  if (data.cartCreate.userErrors.length) throw new Error(data.cartCreate.userErrors[0].message);
  if (!data.cartCreate.cart) throw new Error("cart_not_created");
  return data.cartCreate.cart;
}

/** Consulta de produto real (preço/estoque) — usar ao migrar data/products.ts. */
export const PRODUCT_BY_HANDLE = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      id handle title description
      variants(first: 10) {
        nodes {
          id sku title availableForSale quantityAvailable
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
        }
      }
    }
  }
`;
