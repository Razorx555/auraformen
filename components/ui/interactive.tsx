"use client";

import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/** Efeito magnético muito sutil — apenas desktop com mouse. Nunca afeta a área de clique. */
export function Magnetic({ children, strength = 0.18, className }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`inline-flex ${className ?? ""}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/** Card com reflexo de luz que acompanha o cursor (spotlight). */
export function Spotlight({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Tag
      ref={ref as never}
      onPointerMove={onMove}
      className={`spotlight relative ${className ?? ""}`}
    >
      {children}
    </Tag>
  );
}

/** Trava o scroll do body enquanto um overlay estiver aberto. */
export function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = sbw ? `${sbw}px` : "";
    return () => {
      document.body.style.overflow = prev;
      document.body.style.paddingRight = "";
    };
  }, [active]);
}

/** Foco preso dentro do diálogo + Esc para fechar + retorno do foco. */
export function useDialogFocus(active: boolean, ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
    const t = window.setTimeout(() => {
      const first = node?.querySelector<HTMLElement>("[data-autofocus]") ?? node?.querySelector<HTMLElement>(selector);
      first?.focus();
    }, 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(selector)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [active, ref]);
}
