import { Reveal } from "./Reveal";
import { education, experience, person } from "../content";

export function Experience() {
  return (
    <section id="experience" className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <h2 className="max-w-[18ch] font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-text">
            Where the work happened.
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col">
          {experience.map((role, index) => (
            <Reveal key={role.company} delay={index * 0.06} distance={18}>
              <article className="grid grid-cols-1 gap-x-10 gap-y-4 border-t border-line py-9 md:grid-cols-12">
                <div className="md:col-span-4 lg:col-span-3">
                  <div className="flex items-center gap-2.5">
                    {/* The only status indicator on the page, and it reflects a
                        real fact: this is the current role. */}
                    {role.current && (
                      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-live opacity-60 motion-safe:animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
                      </span>
                    )}
                    <h3 className="font-display text-lg font-medium tracking-tight text-text">
                      {role.company}
                    </h3>
                  </div>
                  <p className="tabular mt-2 text-[11px] tracking-[0.04em] text-dim">
                    {role.period}
                  </p>
                </div>

                <div className="md:col-span-8 lg:col-span-7">
                  <p className="text-[15px] font-medium text-text">{role.title}</p>
                  <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-muted">
                    {role.body}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                    {role.stack.map((item) => (
                      <li
                        key={item}
                        className="tabular text-[11px] tracking-[0.04em] text-dim"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal delay={0.06} distance={18}>
            <div className="grid grid-cols-1 gap-x-10 gap-y-4 border-t border-line py-9 md:grid-cols-12">
              <div className="md:col-span-4 lg:col-span-3">
                <h3 className="font-display text-lg font-medium tracking-tight text-text">
                  {education.school}
                </h3>
                <p className="tabular mt-2 text-[11px] tracking-[0.04em] text-dim">
                  {education.period}
                </p>
              </div>
              <div className="md:col-span-8 lg:col-span-7">
                <p className="text-[15px] font-medium text-text">{education.degree}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">
                  {education.place}. Machine learning, artificial intelligence, computer
                  networks and security, operating systems, and cloud computing.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <p className="mt-10 text-[14px] leading-relaxed text-muted">
            Code lives at{" "}
            <a
              href={person.github}
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent underline decoration-accent-dim underline-offset-4 transition-colors hover:text-text"
            >
              github.com/{person.githubHandle}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
