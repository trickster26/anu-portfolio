import { Suspense, lazy } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";
import { tenancy } from "../content";

const TenantLattice = lazy(() => import("../three/TenantLattice"));

export function Tenancy() {
  return (
    <section id="writing" className="relative overflow-hidden border-t border-line">
      {/* The lattice bleeds off the right edge but stops above the step row, so
          it never sits behind body copy. The mask fades its edges into the page
          instead of ending on a hard rectangle. */}
      <div className="pointer-events-none absolute right-[-18%] top-0 h-[58%] w-[85%] opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_78%)] md:right-[-6%] md:top-[4%] md:h-[62%] md:w-[55%] md:opacity-100">
        <Suspense fallback={null}>
          <TenantLattice />
        </Suspense>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-8 sm:py-36">
        <Reveal className="max-w-[38ch]">
          <h2 className="font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text">
            {tenancy.headline}
          </h2>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-muted sm:text-base">
            {tenancy.body}
          </p>
          <a
            href={tenancy.link.href}
            className="group mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-line-bright px-6 text-sm font-medium text-text transition-colors duration-200 hover:border-muted active:scale-[0.98]"
          >
            {tenancy.link.label}
            <ArrowUpRightIcon
              size={16}
              weight="bold"
              className="text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {tenancy.steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.07} distance={16}>
              <div className="border-t border-line-bright pt-5">
                <h3 className="font-display text-base font-medium tracking-tight text-text">
                  {step.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
