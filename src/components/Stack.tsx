import { Reveal } from "./Reveal";
import { stack } from "../content";

/**
 * Grouped chunks rather than a spec table. Five clusters, each with one hairline
 * above it, so the eye lands on the group name and scans sideways.
 */
export function Stack() {
  return (
    <section className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="max-w-[16ch] font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text">
              The tools, grouped by what they are for.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2 lg:col-span-8 lg:col-start-6">
            {stack.map((group, index) => (
              <Reveal key={group.group} delay={index * 0.05} distance={16}>
                <div className="border-t border-line-bright pt-5">
                  <h3 className="font-display text-base font-medium tracking-tight text-accent">
                    {group.group}
                  </h3>
                  <p className="mt-4 text-[14px] leading-[1.9] text-muted">
                    {group.items.join(", ")}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
