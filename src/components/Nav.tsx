import { useEffect, useState } from "react";
import { ArrowUpRightIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import { hero, person } from "../content";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Systems", href: "#systems" },
  { label: "Experience", href: "#experience" },
];

export function Nav() {
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // IntersectionObserver on a sentinel rather than a scroll listener.
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setLifted(!entry.isIntersecting),
      { rootMargin: "0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = lifted || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "border-b border-line bg-bg/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8">
        <a
          href="#top"
          className="font-display text-[15px] font-semibold tracking-tight text-text transition-colors hover:text-accent"
        >
          {person.name}
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex h-11 items-center rounded-full px-3 text-[13px] text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={hero.primaryCta.href}
            className="group inline-flex h-11 items-center gap-1.5 rounded-full bg-accent px-4 text-[13px] font-medium text-bg transition-transform duration-200 hover:brightness-110 active:scale-[0.97]"
          >
            {hero.primaryCta.label}
            <ArrowUpRightIcon
              size={14}
              weight="bold"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          {/* Below md the section links move into a disclosure panel. */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-text md:hidden"
          >
            {open ? <XIcon size={20} /> : <ListIcon size={20} />}
          </button>
        </div>
      </nav>

      <ul id="mobile-nav" hidden={!open} className="px-5 pb-4 md:hidden">
        {LINKS.map((link) => (
          <li key={link.href} className="border-t border-line">
            <a
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center font-display text-lg tracking-tight text-text"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}
