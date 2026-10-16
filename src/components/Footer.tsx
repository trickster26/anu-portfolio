import { person } from "../content";

// The trust-anchor pages live outside the single-page app. They are linked from
// here so a crawler following the homepage actually reaches them, and so a
// person looking for a privacy statement finds one where they expect to.
const PAGES = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-display text-[15px] font-medium tracking-tight text-text">
          {person.name}
        </p>

        <nav aria-label="Site" className="-mx-2 flex items-center">
          {PAGES.map((page) => (
            <a
              key={page.href}
              href={page.href}
              className="inline-flex min-h-11 items-center px-2 text-[13px] text-dim transition-colors hover:text-text"
            >
              {page.label}
            </a>
          ))}
        </nav>

        <p className="text-[13px] text-dim">
          {person.role}. {person.location}.
        </p>
      </div>
    </footer>
  );
}
