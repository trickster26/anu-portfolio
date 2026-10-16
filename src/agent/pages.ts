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
  | { kind: "definitions"; items: { term: string; description: string }[] }
  | { kind: "code"; text: string };

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
  /** Set on posts under /writing: renders as a BlogPosting authored by #person. */
  published?: string;
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
          text: "Alongside the employed work there is a shipped-product record that is unusual for an AI engineer: a CRM product used by businesses across several industries, an AI-assisted SEO tool, and a convolutional model trained end to end for chest X-ray classification. These are built systems with real users, not weekend prototypes.",
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

/**
 * Writing. General engineering study material only: no in-house product names,
 * no description of any specific production system.
 */
export const tenancyPost: AgentPage = {
  path: "/writing/multi-tenant-architecture",
  markdownPath: "/writing/multi-tenant-architecture.md",
  title: "Multi-tenant architecture: shared schema vs database per tenant",
  heading: "Multi-tenant architecture: shared schema vs database per tenant",
  description:
    "The three ways to separate SaaS customers' data, how each one fails, what database per tenant really costs, and how to choose.",
  lede: "Every SaaS product has to decide where one customer's data stops and the next one's starts. There are three common answers. On a good day they look much the same. They differ in what happens on a bad one.",
  updated: "2026-10-16",
  published: "2026-10-16",
  sections: [
    {
      heading: "The three models",
      blocks: [
        {
          kind: "definitions",
          items: [
            {
              term: "Shared schema",
              description: "One database, one set of tables, and a tenant_id column on every row. Cheapest to run and simplest to migrate. Isolation depends on every query filtering by tenant_id.",
            },
            {
              term: "Schema per tenant",
              description: "One database server with a separate schema for each tenant. Tables are separate, connections are usually shared, and every migration runs once per schema.",
            },
            {
              term: "Database per tenant",
              description: "A separate database for each tenant, sometimes with a separate application process as well. The strongest isolation, and the most to operate.",
            },
          ],
        },
        {
          kind: "p",
          text: "Most teams start with a shared schema, and most should. The question is when it stops being enough.",
        },
      ],
    },
    {
      heading: "Where a shared schema breaks",
      blocks: [
        {
          kind: "p",
          text: "The classic leak isn't in the main screens. Those get tested. It's in the CSV export someone added on a Friday, the background job that loops over invoices, or the admin report that joins three tables and filters only one of them. One missing tenant_id filter and a customer sees someone else's data.",
        },
        {
          kind: "p",
          text: "Postgres can enforce the filter for you with row-level security, so a forgotten WHERE clause returns nothing instead of everything:",
        },
        {
          kind: "code",
          text: "ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;\nALTER TABLE invoices FORCE ROW LEVEL SECURITY;\n\nCREATE POLICY tenant_isolation ON invoices\n  USING (tenant_id = current_setting('app.tenant_id')::uuid);\n\n-- per request, inside the transaction:\nSET LOCAL app.tenant_id = '6f1c...';",
        },
        {
          kind: "p",
          text: "Two details catch people out. Without FORCE, the table's owner skips the policy, and apps often connect as the owner. Superusers skip it regardless. And SET LOCAL only lasts for the transaction, which is what you want with a connection pool: a plain SET would leak one request's tenant into the next request that borrows the connection.",
        },
        {
          kind: "p",
          text: "The other shared-schema problem is the noisy neighbour. One tenant's slow report or bulk import competes with everyone else for the same tables, indexes and connections.",
        },
      ],
    },
    {
      heading: "What database per tenant buys you",
      blocks: [
        {
          kind: "list",
          items: [
            "Isolation by connection. A pool opened against one database can't read another, so cross-tenant access stops being something you can write by accident.",
            "Clean exits. Deleting a customer is DROP DATABASE, not a delete script across forty tables. That matters when a customer, or a data protection law, asks for erasure.",
            "Per-tenant backup and restore. You can roll one customer back to yesterday without touching anyone else.",
            "Bounded noisy neighbours. Give each tenant a small pool and a heavy tenant mostly slows itself down.",
            "Room for different schemas, if different kinds of customer genuinely need different tables. Use this sparingly, because every variation is a code path to test.",
          ],
        },
        {
          kind: "p",
          text: "There are two ways to run it. One application can keep a pool per tenant and pick the right one per request:",
        },
        {
          kind: "code",
          text: "const pools = new Map();\n\nfunction poolFor(tenant) {\n  if (!pools.has(tenant.id)) {\n    pools.set(tenant.id, mysql.createPool({\n      database: tenant.dbName,\n      connectionLimit: 5,\n    }));\n  }\n  return pools.get(tenant.id);\n}",
        },
        {
          kind: "p",
          text: "Or each tenant gets its own process, started with its database name and holding exactly one pool. A process per tenant also isolates memory leaks and crashes, at the price of idle memory for every customer who isn't using the product right now.",
        },
      ],
    },
    {
      heading: "What it costs",
      blocks: [
        {
          kind: "list",
          items: [
            "Migrations run N times. Skip one tenant and its schema drifts. Drift fails quietly: the one feature that needs the missing column returns a 500, and nobody connects the error to a migration that never ran.",
            "Connections multiply. Fifty tenants with a pool of ten is five hundred possible connections. MySQL and MariaDB default max_connections to 151.",
            "Cross-tenant questions get hard. \"How many invoices did all customers send last month\" becomes one query per database, or a separate analytics store fed from all of them.",
            "Login needs a directory. With no global users table, something has to map an email address or a subdomain to the right tenant before authentication can even start.",
            "Provisioning has many steps and has to survive failing halfway. Record each step as it completes, and save the database name the moment it exists, so a retry resumes instead of leaving an orphaned database behind.",
          ],
        },
        {
          kind: "p",
          text: "Drift is the one to plan for on day one. Keep a migrations table in every tenant database, compare each tenant against the repository before a deploy, and refuse to deploy code that needs a column some tenants don't have yet. Reads that tolerate a missing optional column turn a broken module into a missing feature.",
        },
      ],
    },
    {
      heading: "How to choose",
      blocks: [
        {
          kind: "list",
          items: [
            "How many tenants? Tens or hundreds of business customers can each have a database. Tens of thousands of free accounts can't, at least not cheaply.",
            "What does one leaked row cost? For health, legal or financial records, the answer may be the company.",
            "Do customers ask for their own backups, their own region, or proof of deletion? Those are much easier with a database each.",
            "Do tenants really need different schemas, or just different settings?",
          ],
        },
        {
          kind: "p",
          text: "My default is a shared schema with row-level security, plus a test that runs every query path as two tenants and fails if either sees the other. Move to a database per tenant when the answers above point there, not before. Schema per tenant sits in between, and it inherits the migration cost of the strict option without all of its isolation, so I rarely pick it.",
        },
      ],
    },
  ],
};

export const approvalPost: AgentPage = {
  path: "/writing/human-in-the-loop-ai-agents",
  markdownPath: "/writing/human-in-the-loop-ai-agents.md",
  title: "Human-in-the-loop AI agents: where approval gates belong",
  heading: "Human-in-the-loop AI agents: where approval gates belong",
  description:
    "Why an approval step bolted on after an agent runs doesn't protect anything, where the gate should sit, what a reviewer needs to see, and how to resume safely after a yes.",
  lede: "Most agent demos add a human by putting a confirm button at the end. By then the agent has already sent the email or written the row. A useful approval gate sits inside the loop, right before the one step that changes the outside world.",
  updated: "2026-10-16",
  published: "2026-10-16",
  sections: [
    {
      heading: "Gate side effects, not answers",
      blocks: [
        {
          kind: "p",
          text: "An agent does two kinds of work. It reads: searches, retrieves documents, calls APIs that only return data. And it acts: sends messages, updates records, moves money, deletes things. Reading is cheap to get wrong because you can throw the result away. Acting isn't.",
        },
        {
          kind: "p",
          text: "So the gate belongs on tools, not on the conversation. Let the agent plan and read freely. When it decides to call a tool that writes, stop, save the exact call it wants to make, and wait.",
        },
        {
          kind: "code",
          text: "def call_tool(run, tool, args):\n    if tool.writes and needs_approval(tool, args):\n        request = save_pending(run.id, tool.name, args)\n        run.pause(waiting_on=request.id)\n        return  # resumes later from the saved request\n    return tool.execute(args)",
        },
        {
          kind: "p",
          text: "Not every write needs a person. Creating a draft is different from sending it. A useful split is reversible versus irreversible, and internal versus visible to a customer. An irreversible, customer-facing action always waits. A reversible, internal one usually doesn't.",
        },
      ],
    },
    {
      heading: "What the reviewer has to see",
      blocks: [
        {
          kind: "p",
          text: "\"The agent wants to update a record. Approve?\" gets approved every time, which makes it worthless. The reviewer needs enough to say no.",
        },
        {
          kind: "list",
          items: [
            "The exact action and its arguments, shown as a diff against current state where possible. \"Change the due date from 12 Nov to 3 Nov\" beats a JSON blob.",
            "Why the agent wants to do it, in a sentence, with the sources it used. If a retrieved document drove the decision, link it.",
            "What happens if nobody answers. An approval request with no expiry turns into a stale action that fires weeks later.",
          ],
        },
        {
          kind: "p",
          text: "Let the reviewer edit the arguments, not only approve or reject. Most corrections are small: a wrong date, one wrong recipient. Rejecting the whole action and rerunning the agent to fix one field wastes everyone's time.",
        },
      ],
    },
    {
      heading: "Don't trust the model's confidence on its own",
      blocks: [
        {
          kind: "p",
          text: "It's tempting to skip approval whenever the model says it's sure. A model asked to rate its own confidence will often give a high number for a wrong answer. Use signals you can check from outside the model instead.",
        },
        {
          kind: "list",
          items: [
            "Did retrieval find anything relevant, or is the answer coming from the model's memory?",
            "Do the arguments pass validation: does the record exist, is the amount inside normal limits?",
            "Has this exact kind of action been approved unchanged many times before?",
            "Would running the step twice cause harm?",
          ],
        },
        {
          kind: "p",
          text: "Combine those into a score if you like. The point is that every part of it can be verified without asking the model.",
        },
      ],
    },
    {
      heading: "Resuming after a yes",
      blocks: [
        {
          kind: "p",
          text: "Approval can arrive minutes or days later. By then the process that asked may be gone, the record may have changed, and the reviewer may click the button twice.",
        },
        {
          kind: "list",
          items: [
            "Persist the pending call, not the agent's memory. Resume by executing the saved call, not by asking the model to redo its reasoning and hoping it lands on the same answer.",
            "Check the world again before executing. If the record changed since the request was made, ask again.",
            "Give every approved action an idempotency key, so a double click or a retry executes it once.",
            "Write an audit row with who approved what, when, and what actually ran. When something goes wrong later, that row is the first thing anyone asks for.",
          ],
        },
      ],
    },
    {
      heading: "Watch for approval fatigue",
      blocks: [
        {
          kind: "p",
          text: "A gate that fires fifty times a day gets clicked through without reading. That's worse than no gate, because it looks like oversight. Track how often each kind of request is approved unchanged. When that rate stays very high for a low-risk action, automate it and spend the human attention on the requests that actually get edited or rejected.",
        },
        {
          kind: "p",
          text: "The goal isn't a person in every loop. It's a person on the few steps where a wrong action is expensive, with enough in front of them to catch it.",
        },
      ],
    },
  ],
};

export const agentPages: AgentPage[] = [about, contactPage, privacy, tenancyPost, approvalPost];
