/**
 * Every string on the page lives here.
 *
 * Sourced from AnuKumar_CV.pdf and the public GitHub profile. Nothing in this
 * file is invented: there are no fabricated metrics, no made-up client names,
 * no fake precision. Where a real number was not available, the copy describes
 * the work instead of quantifying it.
 */

export const person = {
  name: "Anu Kumar",
  role: "Senior AI Engineer",
  email: "anu2614kumar@gmail.com",
  // On the CV but deliberately not rendered: a public phone number on a
  // portfolio collects recruiters' auto-dialers more than it collects offers.
  phone: "+91 7009614671",
  location: "Mohali, Punjab, India",
  github: "https://github.com/trickster26",
  githubHandle: "trickster26",
  linkedin: "https://www.linkedin.com/in/anu-kumar",
};

export const hero = {
  headline: ["I build agent systems", "that survive production."],
  subtext:
    "Senior AI Engineer working on LLM agents, retrieval pipelines, and the infrastructure that keeps them running.",
  primaryCta: { label: "Get in touch", href: "#contact" },
  secondaryCta: { label: "View work", href: "#work" },
};

/** The three things the work actually consists of. Deliberately not three equal cards. */
export const capabilities = {
  lead: {
    title: "Agent architecture",
    body: "Reasoning loops, tool-calling, confidence scoring, and human-approval checkpoints. The interesting problems are not the prompts. They are what happens when a tool call fails at three in the morning, when a model returns something plausible and wrong, and when a decision needs a person to sign off before it executes.",
    points: [
      "Multi-step tool-calling agents",
      "Confidence scoring on agent output",
      "Human-in-the-loop approval gates",
    ],
  },
  supporting: [
    {
      title: "Retrieval that grounds",
      body: "RAG pipelines that tie agent decisions to real company data instead of model memory. Chunking, embedding, ranking, and the evaluation loop that tells you whether retrieval is actually helping.",
    },
    {
      title: "The part that stays up",
      body: "FastAPI and Node services, PostgreSQL and Redis, Docker and Kubernetes, CI/CD. Models are a component. The system around them is the product.",
    },
  ],
};

export type Project = {
  id: string;
  name: string;
  year: string;
  summary: string;
  detail: string;
  stack: string[];
  link?: { label: string; href: string };
  /** Drop a real screenshot at this path in /public. See README for sizes. */
  /**
   * Omit for work that has no interface to photograph. The card then runs as
   * type alone rather than holding an empty frame open forever.
   */
  image?: string;
  imageAlt?: string;
};

export const projects: Project[] = [
  {
    id: "supermanager",
    name: "SuperManager",
    year: "2026",
    summary: "The agent and LLM layer of an enterprise agentic platform.",
    detail:
      "Core contributor to the agent runtime: reasoning and tool-calling workflows, confidence scoring on generated output, and human-approval checkpoints before an agent action commits. The retrieval side grounds those decisions in company data rather than model priors.",
    stack: ["Python", "FastAPI", "LLM agents", "RAG", "Docker", "Kubernetes"],
    image: "/work/supermanager.jpg",
    imageAlt: "SuperManager agent workflow interface",
  },
  {
    id: "napcrm",
    name: "NapCRM",
    year: "2025",
    summary:
      "Multi-tenant SaaS CRM where every customer gets an isolated database and its own process.",
    detail:
      "Provisioning creates the tenant database, runs industry-specific migrations, starts a dedicated backend process, and writes the DNS record. Feature access is gated per industry and plan, so one codebase serves verticals that do not resemble each other.",
    stack: ["Node.js", "Express", "MariaDB", "React", "PM2", "Cloudflare"],
    image: "/work/napcrm.jpg",
    imageAlt: "NapCRM tenant administration dashboard",
  },
  {
    id: "adnosaur",
    name: "Adnosaur",
    year: "2024",
    summary:
      "Product and ad-campaign discovery for dropshippers, with an AI-assisted store search.",
    detail:
      "Full-stack build on React and Node with a FastAPI service alongside it. Integrated the OpenAI realtime API so users could interrogate the catalogue conversationally instead of filtering it.",
    stack: ["React", "Node.js", "PostgreSQL", "FastAPI", "AWS", "OpenAI"],
    // app.adnosaur.com was returning 502 as of 2026-08-19. Restore this line
    // once the host is up again:
    // link: { label: "app.adnosaur.com", href: "https://app.adnosaur.com/" },
    image: "/work/adnosaur.jpg",
    imageAlt: "Adnosaur product discovery interface",
  },
  {
    id: "napseo",
    name: "NapSEO",
    year: "2025",
    summary:
      "An SEO command centre run by a set of specialised agents rather than one prompt.",
    detail:
      "Separate agents handle audit, keyword research, content briefs, and internal linking, each with its own tools and output contract. Multi-project, so one workspace can hold unrelated sites without the agents bleeding context across them.",
    stack: ["Node.js", "React", "LLM agents", "PostgreSQL"],
    image: "/work/napseo.jpg",
    imageAlt: "NapSEO agent command centre",
  },
  {
    id: "covix",
    name: "Covix",
    year: "2022",
    summary: "A convolutional model that classifies chest X-rays for COVID-19 positivity.",
    detail:
      "Trained end to end: dataset preparation, augmentation, architecture selection, and evaluation. The early project that made the case for everything after it.",
    stack: ["Python", "CNN", "Computer vision", "Deep learning"],
  },
];

/** The multi-tenant provisioning sequence, used as the immersive section's spine. */
export const tenancy = {
  headline: "One codebase. Isolated tenants. No shared query path.",
  body: "Multi-tenancy usually means a tenant_id column and a lot of discipline. NapCRM does not work that way. Each customer gets a physically separate database and its own running process, which makes a cross-tenant leak something you cannot write by accident.",
  steps: [
    {
      title: "Provision",
      body: "A dedicated database is created and migrated with the schema for that customer's industry.",
    },
    {
      title: "Isolate",
      body: "The backend boots bound to one database pool. No code path reaches another tenant's data.",
    },
    {
      title: "Route",
      body: "A process starts under its own supervisor entry, and a DNS record points the customer's subdomain at it.",
    },
    {
      title: "Gate",
      body: "Industry and plan flags decide which modules load, so one deployment serves verticals with nothing in common.",
    },
  ],
};

export type Role = {
  company: string;
  title: string;
  period: string;
  current?: boolean;
  body: string;
  stack: string[];
};

export const experience: Role[] = [
  {
    company: "SuperManager AGI",
    title: "Senior AI Engineer",
    period: "Mar 2026 - Present",
    current: true,
    body: "Designing agent and LLM systems for project intelligence, workflow automation, and decision support. Building RAG pipelines with confidence scoring and human-approval controls, wired into enterprise tools and databases, shipped through Docker, Kubernetes, and CI/CD.",
    stack: ["Python", "FastAPI", "LLM agents", "RAG", "Kubernetes"],
  },
  {
    company: "Mind2Web",
    title: "Full Stack Developer",
    period: "Aug 2023 - Feb 2026",
    body: "Built full-stack applications on React, Node.js, and PostgreSQL across DigitalOcean and AWS, with REST APIs for real-time data exchange. Engineered an AI-assisted interaction platform on React, FastAPI, the Twilio SDK, and the OpenAI APIs.",
    stack: ["React", "Node.js", "PostgreSQL", "FastAPI", "Twilio", "AWS"],
  },
  {
    company: "Zirizi.AI",
    title: "Developer, remote",
    period: "2023",
    body: "Django and React applications with secure backends on the Django ORM, SQLite3, and AWS EC2.",
    stack: ["Django", "React", "AWS EC2"],
  },
  {
    company: "QSpiders",
    title: "Developer, Chandigarh",
    period: "2023",
    body: "Java applications on JDBC and J2EE, plus SQL query optimisation that cut turnaround on the team's reporting work.",
    stack: ["Java", "JDBC", "J2EE", "SQL"],
  },
];

export const stack = [
  {
    group: "AI and ML",
    items: [
      "AI agents",
      "LLM applications",
      "RAG",
      "NLP",
      "Prompt engineering",
      "OpenAI API",
      "Computer vision",
      "Deep learning",
    ],
  },
  {
    group: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "Java", "C++", "PHP"],
  },
  {
    group: "Backend",
    items: ["FastAPI", "Node.js", "Express", "Django", "Flask", "J2EE"],
  },
  {
    group: "Data",
    items: ["PostgreSQL", "MySQL", "MariaDB", "MongoDB", "Redis", "Oracle"],
  },
  {
    group: "Platform",
    items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Cloudflare", "Git"],
  },
];

export const education = {
  degree: "B.Tech, Computer Science and Engineering",
  school: "I.K.G. Punjab Technical University",
  period: "2019 - 2023",
  place: "Mohali, Punjab",
};

export const contact = {
  headline: "Working on something that needs an agent layer?",
  body: "Open to senior AI engineering roles, and to problems where the model is the easy part. The fastest way to reach me is email.",
  cta: { label: "Get in touch", href: "mailto:anu2614kumar@gmail.com" },
};
