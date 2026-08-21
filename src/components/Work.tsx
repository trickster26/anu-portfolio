import { useState } from "react";
import { ArrowUpRightIcon, ImageIcon } from "@phosphor-icons/react";
import { Reveal } from "./Reveal";
import { projects, type Project } from "../content";

/**
 * Project media with three real states.
 *
 * loading  a tinted skeleton the exact shape of the final image, so nothing shifts
 * loaded   the screenshot
 * missing  a labelled slot naming the file that belongs there
 *
 * The missing state exists because these screenshots are real captures of real
 * products. A stock photo standing in for a product shot would be a lie on a
 * portfolio, so the slot stays honest until the file is dropped in.
 */
function ProjectMedia({
  src,
  alt,
  caption,
  className = "",
  aspect = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  /** Layout classes for the figure itself: grid placement, margins. */
  className?: string;
  /** Aspect ratio for the frame. Kept off the figure so the caption is
      not counted inside the ratio. */
  aspect?: string;
}) {
  const [state, setState] = useState<"loading" | "loaded" | "missing">("loading");

  return (
    <figure className={className}>
      <div
        className={`relative overflow-hidden rounded-[12px] border border-line bg-surface-2 ${aspect}`}
      >
        {state === "missing" ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <ImageIcon size={20} weight="light" className="text-dim" aria-hidden="true" />
            <span className="tabular text-[11px] leading-relaxed text-dim">{src}</span>
          </div>
        ) : (
          <>
            {state === "loading" && (
              <div
                className="absolute inset-0 animate-pulse bg-surface-2"
                aria-hidden="true"
              />
            )}
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              onLoad={() => setState("loaded")}
              onError={() => setState("missing")}
              className={`h-full w-full object-cover transition-opacity duration-700 ${
                state === "loaded" ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        )}
      </div>

      {caption && state === "loaded" && (
        <figcaption className="tabular mt-3 text-[11px] tracking-[0.04em] text-dim">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function StackRow({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2">
      {items.map((item) => (
        <li key={item} className="tabular text-[11px] tracking-[0.04em] text-dim">
          {item}
        </li>
      ))}
    </ul>
  );
}

function ProjectHeading({ project }: { project: Project }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h3 className="font-display text-xl font-medium tracking-tight text-text sm:text-2xl">
        {project.name}
      </h3>
      <span className="tabular shrink-0 text-[11px] text-dim">{project.year}</span>
    </div>
  );
}

function ProjectLink({ project }: { project: Project }) {
  if (!project.link) return null;
  return (
    <a
      href={project.link.href}
      target="_blank"
      rel="noreferrer noopener"
      className="group mt-5 inline-flex items-center gap-1.5 text-[13px] text-accent transition-colors hover:text-text"
    >
      {project.link.label}
      <ArrowUpRightIcon
        size={13}
        weight="bold"
        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}

export function Work() {
  const [lead, tall, adnosaur, napseo, wide] = projects;

  return (
    <section id="work" className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <h2 className="max-w-[20ch] font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text">
            Five things I built and had to keep running.
          </h2>
        </Reveal>

        {/* The current work opens alone. Nothing sits beside it, so the column
            cannot leave a hole where an image would otherwise have gone. */}
        <Reveal as="article" className="mt-14 max-w-[64ch]" distance={20}>
          <ProjectHeading project={lead} />
          <p className="mt-4 text-[17px] leading-relaxed text-text">{lead.summary}</p>
          <p className="mt-4 text-[14px] leading-relaxed text-muted">{lead.detail}</p>
          <StackRow items={lead.stack} />
          <ProjectLink project={lead} />
        </Reveal>

        {/* The one project with something real to photograph gets the picture. */}
        <Reveal
          as="article"
          className="mt-16 grid grid-cols-1 gap-10 border-t border-line pt-16 md:grid-cols-12 md:items-center"
          distance={20}
        >
          {tall.image && (
            <ProjectMedia
              src={tall.image}
              alt={tall.imageAlt ?? tall.name}
              caption={tall.imageCaption}
              className="md:col-span-5"
              aspect="aspect-[4/5]"
            />
          )}
          <div className={tall.image ? "md:col-span-6 md:col-start-7" : "md:col-span-8"}>
            <ProjectHeading project={tall} />
            <p className="mt-4 text-[17px] leading-relaxed text-text">{tall.summary}</p>
            <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-muted">
              {tall.detail}
            </p>
            <StackRow items={tall.stack} />
            <ProjectLink project={tall} />
          </div>
        </Reveal>

        {/* Two of equal weight, side by side. */}
        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 border-t border-line pt-16 md:grid-cols-12">
          {[adnosaur, napseo].map((project, i) => (
            <Reveal
              key={project.id}
              as="article"
              className="md:col-span-6"
              delay={i * 0.08}
              distance={20}
            >
              {project.image && (
                <ProjectMedia
                  src={project.image}
                  alt={project.imageAlt ?? project.name}
                  caption={project.imageCaption}
                  className="mb-7"
                  aspect="aspect-[3/2]"
                />
              )}
              <ProjectHeading project={project} />
              <p className="mt-4 text-[15px] leading-relaxed text-text">{project.summary}</p>
              <p className="mt-3 max-w-[50ch] text-[14px] leading-relaxed text-muted">
                {project.detail}
              </p>
              <StackRow items={project.stack} />
              <ProjectLink project={project} />
            </Reveal>
          ))}
        </div>

        {/* The oldest project closes the section as a single quiet line of type. */}
        <Reveal as="article" className="mt-16 border-t border-line pt-16" distance={20}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-baseline">
            {wide.image && (
              <ProjectMedia
                src={wide.image}
                alt={wide.imageAlt ?? wide.name}
                caption={wide.imageCaption}
                className="md:col-span-4"
                aspect="aspect-[16/9]"
              />
            )}
            <div className={wide.image ? "md:col-span-7 md:col-start-6" : "md:col-span-5"}>
              <ProjectHeading project={wide} />
              <p className="mt-4 text-[15px] leading-relaxed text-text">{wide.summary}</p>
            </div>
            <div className={wide.image ? "md:col-span-12" : "md:col-span-6 md:col-start-7"}>
              <p className="max-w-[50ch] text-[14px] leading-relaxed text-muted">
                {wide.detail}
              </p>
              <StackRow items={wide.stack} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
