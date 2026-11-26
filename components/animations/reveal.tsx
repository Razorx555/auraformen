"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "p" | "span";
  amount?: number;
};

/** Scroll reveal: opacidade + pequeno deslocamento vertical (transform). */
export function Reveal({ children, delay = 0, y = 24, className, as = "div", amount = 0.25 }: RevealProps) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </M>
  );
}

const motionTags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, div: motion.div };

/**
 * Text reveal por linha: cada linha sobe de dentro de uma máscara.
 * O gatilho de visibilidade fica no elemento pai (as linhas mascaradas
 * não interceptam a viewport enquanto estão escondidas).
 */
export function TextReveal({
  lines,
  as = "h2",
  className,
  lineClassName,
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[];
  as?: keyof typeof motionTags;
  className?: string;
  lineClassName?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motionTags[as];
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : "hidden"}
      {...(immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.4 } })}
      transition={{ staggerChildren: 0.09, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="-my-[0.14em] block overflow-hidden py-[0.14em]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 1, ease } } }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
