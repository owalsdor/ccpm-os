# CCPM-OS — An AI Product Manager Operating System

A **Markdown-first operating system for Product Managers** built for [Cursor](https://cursor.sh). Reusable slash commands (workflows) and skills (playbooks/templates) that turn rough inputs into high-quality PM artifacts — fast, with minimal back-and-forth.

**41 commands** across 7 categories. **70 skills** covering strategy, execution, research, GTM, and more. **1 MCP server** (Webex).

---

## Installation

### Cursor

1. Clone this repository:

```bash
git clone https://github.com/owalsdor/ccpm-os.git
```

2. Copy the subfolders of /commands, /skills and /rules to .cursor/commands, .cursor/skills and .cursor/rules. Copy .cursorrules to the same level as .cursor.

3. That's it. Cursor automatically detects:
   - **Commands** in **`.cursor/commands/`** — available as slash commands in chat (type `/` to see them)
   - **Skills** in **`.cursor/skills/`** — referenced by commands automatically
   - **Workspace rules** in **`.cursorrules`** (repo root, next to `.cursor/`)
   - **Scoped rules** in **`.cursor/rules/*.mdc`** — e.g. file-specific or folder-specific instructions (see [Cursor rules](#cursor-rules) below)

4. For **MCP servers** (e.g., Webex), see `mcp/webex/README.md` for build and auth instructions, then add the server in **Cursor Settings > Features > MCP**.

5. Start using commands immediately: open Cursor chat, type `/`, and pick a command.

6. For **Cisco Compute** work, use **`.cursor/Cisco/`** only: maintain **`.cursor/Cisco/CLAUDE.md`** (portfolio vocabulary, triage questions, links) and create per-project folders under **`.cursor/Cisco/<project>/`**. The [compute.mdc](#computemdc-cisco-compute) rule applies when you work in that tree.

### Manual setup (any AI editor)

If you're not using Cursor, you can still use the skills and commands as prompt templates:

1. Clone the repo
2. Browse **repo-root** `commands/` and `skills/` in the clone (the same content you would copy into `.cursor/commands/` and `.cursor/skills/` for Cursor)
3. Copy-paste the content into your AI tool of choice

---

## Quickstart

1. Open this folder in **Cursor**
2. Open the chat panel and type `/` to see available commands
3. Pick a command, paste your input, and go

### Default behavior

- **Plan-only by default**: the AI won't edit files or run commands until you say **"go ahead"**
- Asks **≤ 2** critical questions; otherwise assumes sensible defaults
- Outputs default to **markdown**
- Prefers existing commands and skills under **`.cursor/commands/`** and **`.cursor/skills/`** over inventing new formats

These defaults are defined in `.cursorrules` at the repo root.

---

## Repository structure

```
ccpm-os/
├── .cursorrules                   # Workspace rules and defaults
├── README.md
├── mcp/                           # MCP servers (repo root); e.g. webex/, airtable/
│   └── webex/
├── .cursor/
    ├── rules/                     # Scoped Cursor rules (.mdc)
    │   └── compute.mdc            # Cisco Compute — activates under .cursor/Cisco/**
    ├── commands/                  # Slash commands (workflows), after copy from repo
    │   ├── execution/
    │   ├── go-to-market/
    │   ├── market-research/
    │   ├── marketing-growth/
    │   ├── product-discovery/
    │   ├── product-strategy/
    │   └── toolkit/
    ├── skills/                    # Reusable playbooks (referenced by commands)
    │   ├── execution/
    │   ├── go-to-market/
    │   ├── market-research/
    │   ├── marketing-growth/
    │   ├── product-discovery/
    │   ├── product-strategy/
    │   └── toolkit/
    └── Cisco/                     # Local Cisco projects + context (not repo-root Cisco/)
        ├── CLAUDE.md              # Portfolio: UCS, Intersight, glossary (you maintain)
        └── <project>/             # Per-project: index, templates, playbooks, examples, …
            ├── index.md
            ├── templates/
            ├── playbooks/
            ├── examples/
            └── glossary.md        # optional
```

---

## Cursor rules

Files in **`.cursor/rules/`** use the **`.mdc`** extension. Each file is a **scoped rule**: YAML **frontmatter** (typically `description`, `globs`, `alwaysApply`) plus markdown instructions Cursor merges when the scope matches (for example, when you edit files under a given path).

**Add a new rule:** create **`.cursor/rules/<name>.mdc`**, set `globs` (or `alwaysApply: true` for global), and write the body.

### compute.mdc (Cisco Compute)

[`compute.mdc`](rules/compute.mdc) applies when the task touches files under **`.cursor/Cisco/`** (glob: `.cursor/Cisco/**`; `alwaysApply: false`). It tells the AI to:

- Treat **“Cisco”** in this workflow as **`.cursor/Cisco/` only** — not a root-level `Cisco/` folder for project work.
- Read **`.cursor/Cisco/CLAUDE.md`** first when it exists (portfolio scope, UCS / fabric / Intersight framing, vocabulary, triage questions, your links).
- Use the per-project layout **`.cursor/Cisco/<project>/`** (`index.md`, `templates/`, `playbooks/`, `examples/`, optional `glossary.md`).
- Follow **`.cursorrules`** and prefer **`.cursor/commands/`** and **`.cursor/skills/`** for PM OS workflows.

See also [Cisco Compute reference](#cisco-compute-reference) below.

---

## Commands

### Execution (`.cursor/commands/execution/`)

| Command | Description |
|---------|-------------|
| `/meeting-notes` | Turn transcripts into decisions + action items |
| `/write-prd` | Draft a PRD from an idea or problem statement |
| `/write-stories` | Generate user stories and backlog items |
| `/write-blog` | Draft a blog post |
| `/test-scenarios` | Generate QA scenarios from requirements |
| `/stakeholder-map` | Power/interest mapping + comms plan |
| `/plan-okrs` | OKR brainstorming |
| `/sprint` | Sprint planning |
| `/pre-mortem` | Launch/initiative risk pre-mortem |
| `/transform-roadmap` | Output roadmap → outcome roadmap |
| `/email-response-short` | Draft a concise email reply |
| `/email-response-long` | Draft a detailed email reply |
| `/webex-announcement` | Generate Webex Adaptive Card JSON for product announcements |

### Go-to-Market (`.cursor/commands/go-to-market/`)

| Command | Description |
|---------|-------------|
| `/plan-launch` | GTM launch plan |
| `/growth-strategy` | Growth loops and motions |
| `/battlecard` | Competitive battlecard |
| `/sales-enablement` | Full sales + marketing enablement kit (9 deliverables) |

### Market Research (`.cursor/commands/market-research/`)

| Command | Description |
|---------|-------------|
| `/research-users` | User research synthesis and plans |
| `/analyze-feedback` | Sentiment and themes from feedback |
| `/competitive-analysis` | Competitor analysis |
| `/survey-analysis` | Deep B2B survey analysis with evidence-backed insights |
| `/win-loss` | Win/loss deal analysis with competitive and segment breakdowns |

### Marketing & Growth (`.cursor/commands/marketing-growth/`)

| Command | Description |
|---------|-------------|
| `/north-star` | Define North Star + input metrics |
| `/market-product` | Positioning and value prop outputs |

### Product Discovery (`.cursor/commands/product-discovery/`)

| Command | Description |
|---------|-------------|
| `/brainstorm` | Generate ideas for a problem space |
| `/discover` | Structure discovery work |
| `/interview` | Interview scripts and questions |
| `/setup-metrics` | Metrics + dashboard setup |
| `/triage-requests` | Analyze and cluster feature requests |

### Product Strategy (`.cursor/commands/product-strategy/`)

| Command | Description |
|---------|-------------|
| `/strategy` | Product strategy canvas |
| `/pricing` | Pricing analysis + options |
| `/market-scan` | Market scan |
| `/business-model` | Business model canvas |
| `/value-proposition` | Value prop design |
| `/product-roadmap` | Phased, dependency-driven roadmap (work backwards from goal) |
| `/strategic-thinking` | First Principles + Pareto (80/20) analysis |

### Toolkit (`.cursor/commands/toolkit/`)

| Command | Description |
|---------|-------------|
| `/proofread` | Grammar, logic, and flow check |
| `/documentation` | Write, edit, or update product documentation |
| `/teamspace-review` | Performance self-assessment from weekly reflections |
| `/weekly-braindump` | Turn a brain dump into a structured weekly plan |
| `/webex-ai-followups` | Scan Webex DMs for pending follow-ups via MCP and return actionable lists |

---

## Skills (70 playbooks)

Skills are reusable playbooks that live in **`.cursor/skills/<category>/<skill-name>/SKILL.md`**. Commands reference them automatically — you don't need to invoke skills directly.

| Category | Skills |
|----------|--------|
| **Execution** (18) | `brainstorm-okrs`, `create-prd`, `dummy-dataset`, `email-response`, `job-stories`, `outcome-roadmap`, `pre-mortem`, `prioritization-frameworks`, `release-notes`, `retro`, `sprint-plan`, `stakeholder-map`, `summarize-meeting`, `test-scenarios`, `user-stories`, `webex-announcement`, `write-blog-post`, `wwas` |
| **Product Strategy** (14) | `ansoff-matrix`, `business-model`, `lean-canvas`, `monetization-strategy`, `pestle-analysis`, `porters-five-forces`, `pricing-strategy`, `product-roadmap`, `product-strategy`, `product-vision`, `startup-canvas`, `strategic-thinking`, `swot-analysis`, `value-proposition` |
| **Product Discovery** (13) | `analyze-feature-requests`, `brainstorm-experiments-existing`, `brainstorm-experiments-new`, `brainstorm-ideas-existing`, `brainstorm-ideas-new`, `identify-assumptions-existing`, `identify-assumptions-new`, `interview-script`, `metrics-dashboard`, `opportunity-solution-tree`, `prioritize-assumptions`, `prioritize-features`, `summarize-interview` |
| **Market Research** (9) | `competitor-analysis`, `customer-journey-map`, `market-segments`, `market-sizing`, `sentiment-analysis`, `survey-analysis`, `user-personas`, `user-segmentation`, `win-loss` |
| **Go-to-Market** (7) | `beachhead-segment`, `competitive-battlecard`, `gtm-motions`, `gtm-strategy`, `growth-loops`, `ideal-customer-profile`, `sales-enablement` |
| **Marketing & Growth** (5) | `marketing-ideas`, `north-star-metric`, `positioning-ideas`, `product-name`, `value-prop-statements` |
| **Toolkit** (4) | `documentation`, `grammar-check`, `teamspace-review`, `weekly-braindump` |

---

## MCP Servers

MCP (Model Context Protocol) servers extend Cursor with live tool access. They run as local processes and communicate over stdio.

### Webex (`mcp/webex/`)

A Node.js MCP server that connects Cursor to the Webex REST API for messaging workflows.

| Tool | Description |
|------|-------------|
| `webex_list_spaces` | List rooms/spaces. Optional filters: `max`, `type` (direct/group), `sortBy`. |
| `webex_get_messages` | Get messages by `roomId` or `personId`. Optional: `max`, `beforeMessage`. |
| `webex_send_message` | Send a message to a room or person. Supports plain text and markdown. |
| `webex_get_pending_followups` | Scan recent direct spaces and return pending follow-ups with suggested replies. |
| `webex_auth_status` | Check OAuth token health — expiry, refresh state. |

**Authentication:** OAuth (recommended, auto-refreshes for ~90 days) or personal access token (expires every 12 hours).

**Setup:** See [`mcp/webex/README.md`](mcp/webex/README.md) for build instructions and [`mcp/webex/USER_GUIDE.md`](mcp/webex/USER_GUIDE.md) for a full walkthrough.

---

## Adding new commands and skills

When creating new workflows, follow this pattern:

1. **Command** → **`.cursor/commands/<category>/<command-name>.md`** (after install; edit the same files under repo-root `commands/` if you maintain the source there)
   - YAML frontmatter with `description` and `argument-hint`
   - Title: `# /command-name -- Short Label`
   - Invocation examples
   - 4-step workflow (accept input → apply skill → generate output → offer follow-ups)
   - Notes section

2. **Skill** → **`.cursor/skills/<category>/<skill-name>/SKILL.md`**
   - YAML frontmatter with `name` and `description`
   - Purpose, input arguments, step-by-step process, output format, guidelines

Commands reference skills by name in their workflow (e.g., "Apply the **create-prd** skill").

---

## Output structure (per project)

When creating project-specific work, outputs default to:

```
.cursor/Cisco/<project>/
├── index.md
├── templates/
├── playbooks/
├── examples/
└── glossary.md          # optional
```

---

## Quality bar

All outputs should be:

- Scannable headings + checklists
- Clear audience + intended use
- Include steps and at least one example
- If meeting/decision-oriented: include **Decisions**, **Action items** (owner + due date), **Open questions**

---

## Cisco Compute reference

**`.cursor/Cisco/CLAUDE.md`** (local, under your Cursor tree) is the portfolio context file for Cisco Compute: UCS portfolio map, Intersight framing, glossary, stakeholder triage questions, and links you maintain. Use it for consistent language across PRDs, strategy docs, and stakeholder updates. When you work under **`.cursor/Cisco/`**, the scoped rule **[compute.mdc](#computemdc-cisco-compute)** applies — see [Cursor rules](#cursor-rules) above.
