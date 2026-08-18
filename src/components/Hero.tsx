import { Suspense, lazy } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { hero } from "../content";

// The three.js bundle is split out and mounted after the text has painted, so
// the headline is the LCP element rather than a canvas.
const AgentGraph = lazy(() => import("../three/AgentGraph"));

export function Hero() {
  const reduced = useReducedMotion();

  const line = (index: number) => ({
    initial: reduced ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: 0.05 + index * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-24 pb-16"
    >
      {/* The graph occupies the right of the composition on desktop and sits
          behind the text, at low opacity, on small screens. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_58%,transparent_88%)] md:w-[58%] md:opacity-100">
        <Suspense fallback={null}>
          <AgentGraph />
        </Suspense>
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-6 lg:col-span-5">
            <h1 className="font-display text-[clamp(2.4rem,6.2vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-text">
              {hero.headline.map((text, index) => (
                <motion.span key={text} className="block" {...line(index)}>
                  {text}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="mt-7 max-w-[46ch] text-[15px] leading-relaxed text-muted sm:text-base"
              {...line(2)}
            >
              {hero.subtext}
            </motion.p>

            <motion.div className="mt-10 flex flex-wrap items-center gap-3" {...line(3)}>
              <a
                href={hero.primaryCta.href}
                className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition-transform duration-200 hover:brightness-110 active:scale-[0.98]"
              >
                {hero.primaryCta.label}
                <ArrowUpRightIcon
                  size={16}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              <a
                href={hero.secondaryCta.href}
                className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line-bright px-6 py-3 text-sm font-medium text-text transition-colors duration-200 hover:border-muted active:scale-[0.98]"
              >
                {hero.secondaryCta.label}
                <ArrowDownIcon
                  size={16}
                  weight="bold"
                  className="text-muted transition-transform duration-200 group-hover:translate-y-0.5"
                />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <div id="nav-sentinel" className="absolute bottom-0 h-px w-full" aria-hidden="true" />
    </section>
  );
}
