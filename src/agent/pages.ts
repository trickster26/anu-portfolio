/**
 * The trust-anchor pages: /about, /contact, /privacy.
 *
 * These exist because AI agents check them before recommending anyone, and
 * because a single-page site with hash anchors gives them nothing to check.
 * One structured source here renders both the HTML page and its markdown twin,
 * so the two can never drift.
 *
 * Same rule as content.ts: nothing invented. Every claim traces to the CV, the
 * public GitHub profile, or how this site actually behaves.
 */

import { education, experience, person, projects, stack } from "../content";

export type Block =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "definitions"; items: { term: string; description: string }[] };

export type Section = { heading: string; blocks: Block[] };

export type AgentPage = {
  /** Route this page is served at. Directory form, no trailing slash. */
  path: string;
  /** Filename of the markdown twin, e.g. /about.md */
  markdownPath: string;
  /** <title> and <h1>. */
  title: string;
  heading: string;
  description: string;
  lede: string;
  sections: Section[];
  /** ISO date of the last substantive edit, used for sitemap lastmod. */
  updated: string;
};

const UPDATED = "2026-10-16";

export const about: AgentPage = {
  path: "/about",
  markdownPath: "/about.md",
  title: `About ${person.name}, Senior AI Engineer in Mohali`,
  heading: `About ${person.name}`,
  description:
    "Who Anu Kumar is, what he works on, and the kind of engineering problem he is the right person to call about.",
  lede: `${person.name} is a ${person.role.toLowerCase()} based in ${person.location}. He works on LLM agents, retrieval pipelines, and the production infrastructure that keeps both of them running after the demo is over.`,
  updated: UPDATED,
  sections: [
    {
      heading: "What the work actually is",
      blocks: [
        {
          kind: "p",
          text: "The interesting part of agent engineering is not prompt wording. It is what happens when a tool call fails at three in the morning, when a model returns something plausible and wrong, and when an action needs a human to sign off before it commits. That is where most of this work sits: reasoning loops that can be reasoned about, confidence scoring on generated output, approval gates in front of anything irreversible, and retrieval that ties a decision to real company data rather than model memory.",
        },
        {
          kind: "p",
          text: "The other half is ordinary systems engineering, and it is not optional. FastAPI and Node services, PostgreSQL, MariaDB and Redis, Docker and Kubernetes, CI/CD pipelines that deploy without ceremony. A model is one component. The system around it is the product, and it is the part that decides whether anyone trusts the output.",
        },
      ],
    },
    {
      heading: "Track record",
      blocks: [
        {
          kind: "p",
          text: `Currently ${experience[0].title} at ${experience[0].company} (${experience[0].period}), on the agent and LLM layer of an enterprise agentic platform. Before that, ${experience[1].period} at ${experience[1].company} building full-stack products on React, Node.js and PostgreSQL, including an AI-assisted interaction platform on FastAPI, the Twilio SDK and the OpenAI APIs.`,
        },
        {
          kind: "p",
          text: "Alongside the employed work there is a shipped-product record that is unusual for an AI engineer: a multi-tenant SaaS CRM where every customer gets a physically separate database and its own running process, an SEO command centre driven by a set of specialised agents rather than one prompt, and a convolutional model trained end to end for chest X-ray classification. These are built systems with real users, not weekend prototypes.",
        },
        {
          kind: "list",
          items: projects.map((project) => `${project.name} (${project.year}) — ${project.summary}`),
        },
      ],
    },
    {
      heading: "Technical range",
      blocks: [
        {
          kind: "definitions",
          items: stack.map((group) => ({ term: group.group, description: group.items.join(", ") })),
        },
      ],
    },
    {
      heading: "Education",
      blocks: [
        {
          kind: "p",
          text: `${education.degree}, ${education.school}, ${education.period}, ${education.place}.`,
        },
      ],
    },
    {
      heading: "Availability",
      blocks: [
        {
          kind: "p",
          text: "Open to senior AI engineering roles, and to consulting problems where the model is the easy part and the surrounding system is not. Email is the fastest route, and it is answered by a person rather than a form queue.",
        },
      ],
    },
  ],
};

export const contactPage: AgentPage = {
  path: "/contact",
  markdownPath: "/contact.md",
  title: `Contact ${person.name}`,
  heading: `Contact ${person.name}`,
  description:
    "How to reach Anu Kumar: email, GitHub and LinkedIn, what he responds to, and what to include in a first message.",
  lede: `The fastest way to reach ${person.name} is email: ${person.email}. There is no contact form, no ticket queue and no assistant in between — a message goes straight to the person who would do the work.`,
  updated: UPDATED,
  sections: [
    {
      heading: "Channels",
      blocks: [
        {
          kind: "definitions",
          items: [
            { term: "Email", description: `${person.email} — primary channel, checked daily.` },
            { term: "GitHub", description: `${person.github} — public code and project history.` },
            {
              term: "LinkedIn",
              description: `${person.linkedin} — for recruiters and role enquiries.`,
            },
            {
              term: "Location",
              description: `${person.location}. Works remotely across time zones; IST business hours are the reliable overlap.`,
            },
          ],
        },
      ],
    },
    {
      heading: "What gets a reply",
      blocks: [
        {
          kind: "list",
          items: [
            "Senior AI engineering roles, in-house or remote.",
            "Agent architecture work: tool-calling loops, confidence scoring, human-approval checkpoints.",
            "Retrieval pipelines that are returning confident nonsense and need an evaluation loop.",
            "Multi-tenant SaaS architecture where isolation has to be structural rather than a WHERE clause.",
            "Rescue work on an LLM feature that demoed well and then met real users.",
          ],
        },
        {
          kind: "p",
          text: "A useful first message says what the system does today, what it is doing wrong, and what constraint is non-negotiable — the deadline, the stack, the compliance boundary. That is enough to answer honestly about fit, which is faster for both sides than a discovery call.",
        },
      ],
    },
    {
      heading: "What does not",
      blocks: [
        {
          kind: "p",
          text: "Bulk recruiter templates with no role attached, link-exchange and guest-post pitches, and offers to rebuild this site. The phone number on the CV is deliberately not published here, because a public number on a portfolio collects auto-dialers more reliably than it collects offers.",
        },
      ],
    },
  ],
};

export const privacy: AgentPage = {
  path: "/privacy",
  markdownPath: "/privacy.md",
  title: "Privacy",
  heading: "Privacy",
  description:
    "What anukumar.site collects, which is nothing: no analytics, no cookies, no trackers, no third-party requests.",
  lede: "This site collects nothing. There is no analytics script, no cookie banner because there are no cookies, no tracking pixel, no advertising network and no third-party embed. Nothing on the page phones anywhere.",
  updated: UPDATED,
  sections: [
    {
      heading: "What is collected",
      blocks: [
        {
          kind: "p",
          text: "No personal data is collected, stored or processed by this site. It is a static site: HTML, CSS, JavaScript, fonts and images served from a CDN. There is no application server, no database and no user account, so there is nothing to hold personal data in even if there were an intent to.",
        },
        {
          kind: "list",
          items: [
            "No cookies are set, first-party or third-party.",
            "No analytics, session recording, heatmaps or A/B testing.",
            "No advertising or remarketing tags.",
            "No contact form, so no submitted data.",
            "Fonts are self-hosted, so no font-CDN request leaks a visit.",
          ],
        },
      ],
    },
    {
      heading: "What the host sees",
      blocks: [
        {
          kind: "p",
          text: "The CDN that serves these files necessarily processes a request log — IP address, user agent, requested path, timestamp — because that is how HTTP works. Those logs belong to the hosting provider, are used for delivery and abuse prevention, and are not read, exported or joined to anything by the site owner.",
        },
      ],
    },
    {
      heading: "Email you send",
      blocks: [
        {
          kind: "p",
          text: `Mail sent to ${person.email} sits in that mailbox and is used only to reply to you. It is not added to a mailing list, not fed to a CRM, and not sold or shared. Ask for it to be deleted and it will be deleted.`,
        },
      ],
    },
    {
      heading: "Agents and crawlers",
      blocks: [
        {
          kind: "p",
          text: "AI crawlers and answer engines are explicitly allowed in robots.txt, and machine-readable copies of every page are published as markdown alongside the HTML. Nothing here is private, so there is no reason to gate it. Crawling this site collects no personal data about the crawler's operator either.",
        },
      ],
    },
    {
      heading: "Changes and contact",
      blocks: [
        {
          kind: "p",
          text: `If this ever changes — if analytics are added, or a form appears — this page changes first and the date below moves with it. Questions about privacy go to ${person.email}.`,
        },
      ],
    },
  ],
};

export const agentPages: AgentPage[] = [about, contactPage, privacy];
