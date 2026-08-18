/**
 * Scroll reveal primitive.
 *
 * Motivation for the motion: content enters in reading order as it comes into
 * view, which sets hierarchy on a long page. It is a one-shot entrance, not a
 * loop, and it collapses to nothing under prefers-reduced-motion.
 */

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Distance travelled on entry. Larger for headline blocks, smaller for rows. */
  distance?: number;
  as?: "div" | "li" | "section" | "article" | "header";
};

export function Reveal({
  children,
  delay = 0,
  className,
  distance = 24,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduced ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}
