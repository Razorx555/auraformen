"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand";
import { mainNav } from "@/data/site";
import { storeConfig } from "@/data/store-config";
import { useCart } from "@/components/cart/cart-context";
import { MobileMenu } from "./mobile-menu";
import { SearchDialog } from "./search-dialog";
import { cn } from "@/lib/format";

export function Header() {
  const pathname = usePathname();
  const { count, open, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const live = storeConfig.mode === "live";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Atalho "/" ou Ctrl/Cmd+K para busca
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest("input, textarea, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
          scrolled || menuOpen
            ? "border-b border-white/[0.06] bg-ink/75 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-x flex h-16 items-center justify-between gap-6 md:h-20">
          <Link href="/" aria-label="AURA FOR MEN — página inicial" className="relative z-10 shrink-0">
            <BrandLogo preload className="h-auto w-[118px] md:w-[148px]" />
          </Link>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-10">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "t-eyebrow relative py-2 transition-colors duration-300 hover:text-paper",
                      isActive(item.href) ? "text-paper" : "text-chrome/80",
                    )}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-chrome to-transparent"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid size-11 place-items-center rounded-full text-chrome transition hover:bg-white/5 hover:text-paper"
              aria-label="Buscar"
            >
              <Search className="size-[18px]" strokeWidth={1.5} />
            </button>
            {live && (
              <button
                type="button"
                onClick={open}
                className="relative grid size-11 place-items-center rounded-full text-chrome transition hover:bg-white/5 hover:text-paper"
                aria-label={`Abrir bolsa${hydrated && count ? `, ${count} ${count === 1 ? "item" : "itens"}` : ", vazia"}`}
              >
                <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
                <AnimatePresence>
                  {hydrated && count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      className="absolute right-1 top-1 grid min-w-[18px] place-items-center rounded-full bg-paper px-1 font-display text-[10px] font-semibold leading-[18px] text-ink"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-11 place-items-center rounded-full text-chrome transition hover:bg-white/5 hover:text-paper md:hidden"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSearch={() => { setMenuOpen(false); setSearchOpen(true); }} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
