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
  /** 1200x630 diagram from scripts/diagrams: article figure and link preview. */
  image?: { src: string; alt: string };
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
  image: {
    src: "/writing/multi-tenant-architecture.png",
    alt: "Diagram of three multi-tenant models: one shared schema with tenant rows mixed, separate schemas on one server, and a separate database per tenant, from cheaper to run to stronger isolation.",
  },
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
  image: {
    src: "/writing/human-in-the-loop-ai-agents.png",
    alt: "Flow: agent plans, read tools run freely, agent wants to write, approval gate pauses and saves the exact call, human approves, edits or rejects, action executes once with an idempotency key.",
  },
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

export const toolsPost: AgentPage = {
  path: "/writing/agentic-ai-tool-design",
  markdownPath: "/writing/agentic-ai-tool-design.md",
  title: "Agentic AI in practice: tool design matters more than the prompt",
  heading: "Agentic AI in practice: tool design matters more than the prompt",
  description:
    "Why most agent failures come from the tools, not the system prompt: naming, granularity, what tools return, error messages that teach, safe retries and hard limits.",
  lede: "When an agent misbehaves, the usual reaction is to rewrite the system prompt. Most of the time the problem is the tools: what they're called, what they accept, and what they say back when something goes wrong.",
  updated: "2026-10-16",
  published: "2026-10-16",
  image: {
    src: "/writing/agentic-ai-tool-design.png",
    alt: "An unhelpful tool error, {\"error\": \"not found\"}, next to an error that tells the agent what to try next, plus limits enforced in the loop: max steps, tool timeouts, token budget.",
  },
  sections: [
    {
      heading: "The model only sees names and descriptions",
      blocks: [
        {
          kind: "p",
          text: "An agent picks a tool from its name, its description and its argument schema. Nothing else. Give it search_customers and find_customer with similar descriptions and every lookup becomes a coin flip.",
        },
        {
          kind: "p",
          text: "Write descriptions the way you'd brief a new teammate: what the tool does, when to use it, when not to, and what a good argument looks like. \"Searches customers\" is a label. \"Find customers by name, email or phone. Use this before any action that needs a customer_id. Partial names work.\" is an instruction.",
        },
      ],
    },
    {
      heading: "Fewer, higher-level tools",
      blocks: [
        {
          kind: "p",
          text: "If answering \"what did this customer order last week\" takes list_orders, then get_order for each one, then list_order_items, the agent makes a dozen calls. Each call is a round trip, more tokens in context, and one more chance to go wrong. One get_recent_orders(customer_id, days) tool does the same job in one step.",
        },
        {
          kind: "p",
          text: "Don't take this too far. A tool that both looks things up and changes them is hard to describe and hard to approve. Group by task, keep reads and writes apart.",
        },
      ],
    },
    {
      heading: "Return what the model needs, not the raw API",
      blocks: [
        {
          kind: "list",
          items: [
            "Drop fields the agent will never use. A forty-field JSON record costs tokens on every call and buries the three fields that matter.",
            "Prefer names over opaque IDs where you can, and include the ID too when a later tool needs it.",
            "Cap list sizes and say so: \"Showing 20 of 312. Narrow the search or call again with page=2.\"",
          ],
        },
      ],
    },
    {
      heading: "Errors are instructions",
      blocks: [
        {
          kind: "p",
          text: "An agent reads a tool's error and decides what to do next. A bare error gives it nothing to work with, so it retries the same call or invents an answer. A good error says what went wrong and what to try instead.",
        },
        {
          kind: "code",
          text: "# unhelpful\n{\"error\": \"not found\"}\n\n# helpful\n{\"error\": \"No customer with email ravi@exmple.com. The domain may be misspelled. Try search_customers with the name or phone number.\"}",
        },
      ],
    },
    {
      heading: "Make writes safe to retry",
      blocks: [
        {
          kind: "p",
          text: "Agents retry. Networks time out after a request has already landed. Any tool that writes should take an idempotency key, so the same call twice does the work once. Validate arguments inside the tool instead of trusting the model to send sensible values, and for risky actions offer a dry_run flag that shows what would change without changing it.",
        },
      ],
    },
    {
      heading: "Put the limits outside the model",
      blocks: [
        {
          kind: "p",
          text: "A model asked to stop after ten steps will sometimes take thirty. Enforce a maximum number of steps, a timeout per tool and a token or cost budget in the code that runs the loop. When a limit is hit, stop and return what was done so far with a plain explanation. A partial answer with a reason beats an agent that loops until something else kills it.",
        },
        {
          kind: "p",
          text: "Before you touch the prompt again, read a few transcripts of the agent failing. Usually you'll see it misread a tool, drown in a tool's output, or retry an error it couldn't understand. Those are tool fixes.",
        },
      ],
    },
  ],
};

export const ragPost: AgentPage = {
  path: "/writing/rag-retrieval-hybrid-search",
  markdownPath: "/writing/rag-retrieval-hybrid-search.md",
  title: "RAG retrieval: hybrid search, reranking and measuring recall",
  heading: "RAG retrieval: hybrid search, reranking and measuring recall",
  description:
    "Most wrong RAG answers are retrieval failures. How to measure retrieval on its own, chunk by structure, combine keyword and vector search, rerank, and filter safely.",
  lede: "When a RAG system gives a wrong answer, the model usually isn't the problem. It answered from the chunks it was given, and the right chunk wasn't among them. Fix retrieval and most of the bad answers go away.",
  updated: "2026-10-16",
  published: "2026-10-16",
  image: {
    src: "/writing/rag-retrieval-hybrid-search.png",
    alt: "RAG retrieval flow: query, permission and metadata filter, keyword BM25 and vector search in parallel, reciprocal rank fusion, rerank top 50 to top 5, then the LLM.",
  },
  sections: [
    {
      heading: "Measure retrieval on its own",
      blocks: [
        {
          kind: "p",
          text: "Before changing prompts or models, write down 50 to 100 real questions and, for each one, the chunk or chunks that actually answer it. Then measure retrieval without the model in the way.",
        },
        {
          kind: "definitions",
          items: [
            { term: "recall@k", description: "The share of questions where at least one correct chunk appears in the top k results. If recall@5 is 60%, the model is missing the answer on four questions out of ten before it writes a word." },
            { term: "MRR", description: "Mean reciprocal rank: 1 divided by the position of the first correct chunk, averaged over questions. It tells you whether the right chunk is near the top or scraping in at rank 9." },
          ],
        },
        {
          kind: "p",
          text: "Every change below should move one of these numbers. If it doesn't, it isn't helping.",
        },
      ],
    },
    {
      heading: "Chunk by structure, not by character count",
      blocks: [
        {
          kind: "p",
          text: "Fixed 500-character splits cut tables in half and separate step 4 from steps 1 to 3. Split on the document's own structure instead: headings, paragraphs, list items, table rows kept together. Prefix each chunk with its heading path, like \"Billing > Refunds > Partial refunds\", so a chunk that says \"this takes 5 days\" still knows what \"this\" is.",
        },
        {
          kind: "p",
          text: "Size is a trade-off. Tiny chunks lose context. Huge chunks blur several topics into one embedding, and the one sentence that matters gets diluted.",
        },
      ],
    },
    {
      heading: "Hybrid search: keywords and vectors together",
      blocks: [
        {
          kind: "p",
          text: "Embeddings are good at meaning and bad at exact strings. Ask about error E1042, SKU 88-210 or a person's surname and vector search often returns things that are about the same topic but not that exact thing. Keyword search such as BM25 handles exactly those cases.",
        },
        {
          kind: "p",
          text: "Run both and merge the result lists. Reciprocal rank fusion is the simple, robust way to do it, because it uses only the rank in each list, not the scores, which aren't comparable between the two systems:",
        },
        {
          kind: "code",
          text: "def rrf(result_lists, k=60):\n    scores = {}\n    for results in result_lists:\n        for rank, doc_id in enumerate(results, start=1):\n            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)\n    return sorted(scores, key=scores.get, reverse=True)",
        },
        {
          kind: "p",
          text: "k=60 is the value from the original RRF paper and a reasonable default.",
        },
      ],
    },
    {
      heading: "Rerank the candidates",
      blocks: [
        {
          kind: "p",
          text: "Embedding search compares a query vector with chunk vectors that were computed separately. A cross-encoder reranker reads the query and each chunk together, so it judges relevance much better, but it's too slow to run over the whole corpus. Retrieve 50 candidates cheaply, rerank them, keep the top 5.",
        },
      ],
    },
    {
      heading: "Filter before you rank",
      blocks: [
        {
          kind: "p",
          text: "If the question is about one product, one year or one customer's documents, apply that as a metadata filter, not as something you hope similarity will sort out. Permissions especially: filter out documents the user isn't allowed to see before retrieval. A prompt that says \"don't mention confidential documents\" is not access control.",
        },
      ],
    },
    {
      heading: "Plan for finding nothing",
      blocks: [
        {
          kind: "p",
          text: "Some questions have no answer in your data. If the best reranked score is below a threshold you've checked against your test set, tell the model nothing relevant was found and let it say so. \"I couldn't find this in the documentation\" is a good answer. A confident answer stitched together from loosely related chunks is the worst one.",
        },
      ],
    },
  ],
};

export const multiAgentPost: AgentPage = {
  path: "/writing/multi-agent-systems",
  markdownPath: "/writing/multi-agent-systems.md",
  title: "Multi-agent systems: when splitting an agent helps and when it just costs more",
  heading: "Multi-agent systems: when splitting an agent helps and when it just costs more",
  description:
    "What multiple agents actually buy you, what they cost in tokens and reliability, the patterns that work, how to write handoffs, and why to start with one agent.",
  lede: "Splitting one agent into several is one of the most popular moves in agent design, and often the most expensive one. It helps in a specific situation. Outside it, you pay more for a system that's harder to debug.",
  updated: "2026-10-16",
  published: "2026-10-16",
  image: {
    src: "/writing/multi-agent-systems.png",
    alt: "An orchestrator agent delegating to three worker agents, each with its own context, with the costs: about 15 times the tokens of a chat, and five 95% handoffs giving 77% reliability.",
  },
  sections: [
    {
      heading: "What multiple agents actually buy",
      blocks: [
        {
          kind: "p",
          text: "The real benefit is separate context windows. A subagent researching one question works in a clean context that holds only that question, its tools and its findings. It hands back a short summary, and the lead agent never sees the hundred search results behind it. For broad tasks that would otherwise overflow one context, that's a genuine gain.",
        },
        {
          kind: "p",
          text: "The second benefit is parallelism. If a task breaks into independent pieces, like checking five sources or reviewing five files, subagents can run at the same time.",
        },
      ],
    },
    {
      heading: "What it costs",
      blocks: [
        {
          kind: "list",
          items: [
            "Tokens. Every agent reads its own instructions, tools and context. Anthropic reported that its multi-agent research system used roughly 15 times the tokens of a plain chat interaction. That can be worth it for high-value work. It isn't for routine tasks.",
            "Compounding errors. If each handoff is right 95% of the time, a chain of five is right about 77% of the time (0.95 to the power of 5).",
            "Lost context. The lead agent knows why a task matters. A subagent knows only what the handoff told it.",
            "Debugging. A wrong answer now has several transcripts behind it, and the mistake might be in any of them or in a handoff between them.",
          ],
        },
      ],
    },
    {
      heading: "Patterns that hold up",
      blocks: [
        {
          kind: "definitions",
          items: [
            { term: "Orchestrator and workers", description: "A lead agent plans, sends independent subtasks to workers that run in parallel, then combines their results. Good for research and wide searches." },
            { term: "Pipeline", description: "Fixed stages in a fixed order, like extract, then check, then write. Often this doesn't need agents at all, just a sequence of model calls." },
            { term: "Router", description: "One step decides which specialist handles a request, then gets out of the way. Good when requests fall into clearly different types." },
          ],
        },
        {
          kind: "p",
          text: "The pattern to avoid is several agents talking freely to each other until they agree. It's hard to predict, hard to bound and hard to test.",
        },
      ],
    },
    {
      heading: "Write handoffs like task specs",
      blocks: [
        {
          kind: "p",
          text: "\"Research competitor pricing\" sent to three workers produces three overlapping reports. A handoff needs the objective, the boundaries, the expected output and when to stop:",
        },
        {
          kind: "code",
          text: "{\n  \"objective\": \"Find current list prices for the 3 cheapest plans of vendor X\",\n  \"scope\": \"Vendor's own pricing page and docs only. Not reviews or forums.\",\n  \"output\": \"JSON: [{plan, monthly_price, currency, source_url}]\",\n  \"stop_when\": \"All 3 plans found, or 5 tool calls used\"\n}",
        },
      ],
    },
    {
      heading: "Start with one agent",
      blocks: [
        {
          kind: "p",
          text: "Build one agent with good tools first and measure it. Split it only when you can point to the problem splitting solves: the context keeps overflowing, or the work has clearly independent parts that would finish faster in parallel. Then run the same evals on both versions. If the multi-agent version isn't measurably better, keep the simpler one.",
        },
      ],
    },
  ],
};

export const evalsPost: AgentPage = {
  path: "/writing/llm-evaluation-llm-as-a-judge",
  markdownPath: "/writing/llm-evaluation-llm-as-a-judge.md",
  title: "LLM evaluation: evals that catch regressions, and when to trust LLM-as-a-judge",
  heading: "LLM evaluation: evals that catch regressions, and when to trust LLM-as-a-judge",
  description:
    "How to build an eval set from real failures, what to check with code first, the known biases of LLM-as-a-judge and how to calibrate it, evaluating agent trajectories, and running evals like tests.",
  lede: "Without evals, every prompt change is a guess. You fix the example in front of you and quietly break three you aren't looking at. An eval set turns that guess into a number you can watch.",
  updated: "2026-10-16",
  published: "2026-10-16",
  image: {
    src: "/writing/llm-evaluation-llm-as-a-judge.png",
    alt: "Eval pipeline: real failures, code checks, LLM judge with a pass/fail rubric, calibration against hand labels, run in CI on every change.",
  },
  sections: [
    {
      heading: "Start from real failures",
      blocks: [
        {
          kind: "p",
          text: "The best eval cases come from real inputs, especially the ones that went wrong. Collect 50 to 200 of them, write down what a correct outcome looks like for each, and tag them by type: language, task, customer segment, whatever splits your traffic. An average score hides a feature that's broken for one slice.",
        },
        {
          kind: "p",
          text: "Synthetic cases are useful for coverage, but they tend to be cleaner than real users. Keep real ones as the core.",
        },
      ],
    },
    {
      heading: "Check with code first",
      blocks: [
        {
          kind: "p",
          text: "A lot of quality is checkable without another model. Is the output valid JSON with the required fields? Did the agent call the right tool with the right arguments? Does every citation point to a document that was actually retrieved? Is the answer under the length limit? These checks are fast, free and give the same result every run. Write them before reaching for a judge.",
        },
      ],
    },
    {
      heading: "LLM-as-a-judge, carefully",
      blocks: [
        {
          kind: "p",
          text: "For open-ended qualities like helpfulness or tone, a model grading another model's output is often the only practical option. It has known biases, documented in the MT-Bench paper by Zheng et al. (2023):",
        },
        {
          kind: "list",
          items: [
            "Position bias: when comparing two answers, judges tend to favour one position regardless of content.",
            "Verbosity bias: longer answers look better to judges even when they aren't.",
            "Self-enhancement bias: a judge can favour answers written by its own model.",
          ],
        },
        {
          kind: "p",
          text: "What helps: a rubric with specific, checkable criteria instead of \"rate quality from 1 to 10\". Pass/fail or a three-point scale rather than fine-grained scores. Asking for the reasoning before the verdict. In pairwise comparisons, running both orders and only counting consistent wins.",
        },
        {
          kind: "code",
          text: "Grade the answer against the reference.\nCriteria, each PASS or FAIL:\n1. States the refund window that the reference states.\n2. Does not promise anything the reference does not support.\n3. Tells the user the next step to take.\nGive one line of reasoning per criterion, then the verdicts.",
        },
        {
          kind: "p",
          text: "Then calibrate. Grade 50 to 100 cases by hand, run the judge on the same cases and measure how often it agrees with you. If agreement is poor, fix the rubric before you trust a single number it produces.",
        },
      ],
    },
    {
      heading: "For agents, grade the trajectory too",
      blocks: [
        {
          kind: "p",
          text: "An agent can reach the right answer the wrong way: ten tool calls where two would do, a write it shouldn't have made, a lucky guess after a failed lookup. Score the path as well as the result. Did it call the expected tools? How many steps did it take? Did it stop when it should? What did the run cost and how long did it take?",
        },
      ],
    },
    {
      heading: "Run evals like tests",
      blocks: [
        {
          kind: "list",
          items: [
            "Run the suite on every prompt change, model change and tool change, and compare against the last known good run.",
            "Model output varies between runs. Run each case several times and track the pass rate, not a single pass or fail.",
            "Watch the slices, not only the total.",
            "Every production failure becomes a new case. The set should grow every week.",
          ],
        },
        {
          kind: "p",
          text: "An eval set doesn't need to be big or clever on day one. Twenty real cases with honest checks will catch more regressions than a polished benchmark nobody runs.",
        },
      ],
    },
  ],
};

export const agentPages: AgentPage[] = [
  about,
  contactPage,
  privacy,
  tenancyPost,
  approvalPost,
  toolsPost,
  ragPost,
  multiAgentPost,
  evalsPost,
];
