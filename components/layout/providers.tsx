"use client";

import { MotionConfig } from "motion/react";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Header } from "./header";
import { ConsentBanner, DemoNotice } from "./overlays";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <Header />
        {children}
        <CartDrawer />
        <ConsentBanner />
        <DemoNotice />
      </CartProvider>
    </MotionConfig>
  );
}
