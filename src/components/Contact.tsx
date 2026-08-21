import {
  ArrowUpRightIcon,
  EnvelopeSimpleIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react";
import { Reveal } from "./Reveal";
import { contact, person } from "../content";

const CHANNELS = [
  { label: person.email, href: `mailto:${person.email}`, Icon: EnvelopeSimpleIcon },
  { label: `github.com/${person.githubHandle}`, href: person.github, Icon: GithubLogoIcon },
  { label: "linkedin.com/in/anukumar0", href: person.linkedin, Icon: LinkedinLogoIcon },
];

export function Contact() {
  return (
    <section id="contact" className="border-t border-line py-28 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="max-w-[24ch] font-display text-[clamp(2rem,3.9vw,3.1rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-text">
                {contact.headline}
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-7 max-w-[52ch] text-[15px] leading-relaxed text-muted sm:text-base">
                {contact.body}
              </p>

              <a
                href={contact.cta.href}
                className="group mt-10 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-bg transition-transform duration-200 hover:brightness-110 active:scale-[0.98]"
              >
                {contact.cta.label}
                <ArrowUpRightIcon
                  size={16}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Reveal>
          </div>

          {/* The channels take the right column rather than a row underneath, so
              the section reads as two balanced blocks instead of one tall one. */}
          <Reveal delay={0.14} className="lg:col-span-4 lg:col-start-9 lg:pt-3">
            <ul className="flex flex-col">
              {CHANNELS.map(({ label, href, Icon }) => (
                <li key={href} className="border-t border-line py-5">
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer noopener"
                    className="group flex items-center gap-3 text-[14px] text-muted transition-colors hover:text-text"
                  >
                    <Icon size={16} weight="regular" className="shrink-0 text-dim" aria-hidden="true" />
                    <span className="break-all">{label}</span>
                    <ArrowUpRightIcon
                      size={13}
                      weight="bold"
                      className="ml-auto shrink-0 text-dim opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
