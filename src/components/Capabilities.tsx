import { CheckIcon } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";
import { capabilities } from "../content";

export function Capabilities() {
  return (
    <section className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* The lead capability gets the weight. The other two support it. */}
          <Reveal className="lg:col-span-7">
            <h2 className="font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text">
              {capabilities.lead.title}
            </h2>
            <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-muted sm:text-base">
              {capabilities.lead.body}
            </p>

            <ul className="mt-9 flex flex-col gap-3">
              {capabilities.lead.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px] text-text">
                  <CheckIcon
                    size={16}
                    weight="bold"
                    className="mt-1 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="flex flex-col gap-10 lg:col-span-5 lg:pt-3">
            {capabilities.supporting.map((item, index) => (
              <Reveal key={item.title} delay={0.08 + index * 0.08} distance={18}>
                <div className="border-t border-line pt-6">
                  <h3 className="font-display text-lg font-medium tracking-tight text-text">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                    {item.body}
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
