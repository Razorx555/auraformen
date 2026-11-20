import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page";
import { Eyebrow } from "@/components/ui/brand";

export const metadata: Metadata = {
  title: "Sua bolsa",
  description: "Revise suas fragrâncias AURA FOR MEN e finalize a compra.",
  alternates: { canonical: "/carrinho" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <section className="pb-24 pt-28 md:pb-32 md:pt-40">
      <div className="container-x">
        <Eyebrow>Sua escolha está quase pronta</Eyebrow>
        <h1 className="t-display mt-6">Sua bolsa.</h1>
        <div className="mt-12">
          <CartPageClient />
        </div>
      </div>
    </section>
  );
}
