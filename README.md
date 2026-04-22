# CCPM-OS — An AI Product Manager Operating System

A **Markdown-first operating system for Product Managers** built for [Cursor](https://cursor.sh). Reusable slash commands (workflows) and skills (playbooks/templates) that turn rough inputs into high-quality PM artifacts — fast, with minimal back-and-forth.

**17 commands** across 7 categories. **70 skills** covering strategy, execution, research, GTM, and more. **1 MCP server** (Webex).

Commands are thin orchestrators over skills — they exist only when they add real routing, skill-chaining, a variant override, or a non-skill integration. Everything else runs through skill auto-discovery. See [`commands/README.md`](commands/README.md) for the pattern.

---

## Installation

### Cursor

1. Clone this repository:

```bash
git clone https://github.com/owalsdor/ccpm-os
```

2. Copy the subfolders of /commands, /skills and /rules to .cursor/commands, .cursor/skills and .cursor/rules. Copy .cursorrules to the same level as .cursor.

3. That's it. Cursor automatically detects:
   - **Commands** in **`.cursor/commands/`** — available as slash commands in chat (type `/` to see them)
   - **Skills** in **`.cursor/skills/`** — referenced by commands automatically
   - **Workspace rules** in **`.cursorrules`** (repo root, next to `.cursor/`)
   - **Scoped rules** in **`.cursor/rules/*.mdc`** — e.g. file-specific or folder-specific instructions (see [Cursor rules](#cursor-rules) below)

4. For **MCP servers** (e.g., Webex), see `mcp/webex/README.md` for build and auth instructions, then add the server in **Cursor Settings > Features > MCP**.

5. Start using commands/skills immediately: open Cursor chat, type `/`, and pick a command.

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

[`compute.mdc`](.cursor/rules/compute.mdc) applies when the task touches files under **`.cursor/Cisco/`** (glob: `.cursor/Cisco/**`; `alwaysApply: false`). It tells the AI to:

- Treat **“Cisco”** in this workflow as **`.cursor/Cisco/` only** — not a root-level `Cisco/` folder for project work.
- Read **`.cursor/Cisco/CLAUDE.md`** first when it exists (portfolio scope, UCS / fabric / Intersight framing, vocabulary, triage questions, your links).
- Use the per-project layout **`.cursor/Cisco/<project>/`** (`index.md`, `templates/`, `playbooks/`, `examples/`, optional `glossary.md`).
- Follow **`.cursorrules`** and prefer **`.cursor/commands/`** and **`.cursor/skills/`** for PM OS workflows.

See also [Cisco Compute reference](#cisco-compute-reference) below.

---

## Commands

Each command is a thin orchestrator — a router, a chain of skills, a variant override, or a non-skill integration. Anything that would just wrap a single skill is handled by skill auto-discovery instead.

### Execution (`.cursor/commands/execution/`)

| Command | Pattern | Description |
|---------|---------|-------------|
| `/sprint plan\|retro\|release-notes` | Router | Routes to `sprint-plan`, `retro`, or `release-notes` skill |
| `/write-stories user\|job\|wwa` | Router | Routes to `user-stories`, `job-stories`, or `wwas` skill |
| `/email-response-short` | Variant | `email-response` skill with `$LENGTH=short`, final email only |
| `/email-response-long` | Variant | `email-response` skill with `$LENGTH=detailed`, full coaching |

### Go-to-Market (`.cursor/commands/go-to-market/`)

| Command | Pattern | Description |
|---------|---------|-------------|
| `/plan-launch` | Chain | `beachhead-segment` → `ideal-customer-profile` → `gtm-strategy` |
| `/growth-strategy` | Chain | `growth-loops` + `gtm-motions` |

### Market Research (`.cursor/commands/market-research/`)

| Command | Pattern | Description |
|---------|---------|-------------|
| `/research-users` | Chain | `user-personas` → `user-segmentation` + `market-segments` → `customer-journey-map` |

### Marketing & Growth (`.cursor/commands/marketing-growth/`)

| Command | Pattern | Description |
|---------|---------|-------------|
| `/market-product` | Chain | `marketing-ideas` + `positioning-ideas` + `value-prop-statements` + `product-name` |

### Product Discovery (`.cursor/commands/product-discovery/`)

| Command | Pattern | Description |
|---------|---------|-------------|
| `/brainstorm [ideas\|experiments] [existing\|new]` | Router | Routes to one of 4 `brainstorm-*` skills |
| `/discover` | Chain | `brainstorm-ideas` → `identify-assumptions` → `prioritize-assumptions` → `brainstorm-experiments` (with checkpoints) |
| `/interview prep\|summarize` | Router | Routes to `interview-script` or `summarize-interview` skill |
| `/triage-requests` | Chain | `analyze-feature-requests` → `prioritize-features` |

### Product Strategy (`.cursor/commands/product-strategy/`)

| Command | Pattern | Description |
|---------|---------|-------------|
| `/strategy` | Chain | `product-vision` → `product-strategy` (9-section canvas) |
| `/business-model lean\|full\|startup\|value-prop\|all` | Router | Routes to `lean-canvas`, `business-model`, `startup-canvas`, `value-proposition`, or all four |
| `/market-scan` | Chain | `swot-analysis` + `pestle-analysis` + `porters-five-forces` + `ansoff-matrix` |
| `/pricing` | Chain | `pricing-strategy` + `monetization-strategy` |

### Toolkit (`.cursor/commands/toolkit/`)

| Command | Pattern | Description |
|---------|---------|-------------|
| `/webex-ai-followups` | MCP | Scans Webex DMs via the Webex MCP server — not a skill wrapper |

### What happened to the other commands?

Earlier versions of this repo had ~41 commands. Most of them were one-to-one wrappers of a single skill (e.g., `/write-prd` → `create-prd` skill) that added no routing, chaining, or variant logic. Those were removed in favor of skill auto-discovery — just ask the agent ("draft a PRD for X", "run a pre-mortem on this plan") and the matching skill fires automatically. See [`commands/README.md`](commands/README.md) for when a command is worth adding back.

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

**Default to skills.** New capability → new skill. Cursor's agent will auto-invoke it when the user's intent matches the skill's `description`.

**Add a command only when it earns its place.** A command must do at least one of:
- **Route** between multiple skills based on a mode argument
- **Chain** several skills in a fixed sequence and stitch their outputs
- **Override** a skill with a hard parameter the agent wouldn't infer (length, tone, output trimming)
- **Integrate** with a non-skill target (MCP server, external API)

### Skill → `.cursor/skills/<category>/<skill-name>/SKILL.md`
- YAML frontmatter with `name` and `description`
- Purpose, input arguments, step-by-step process, output format, guidelines
- The skill owns its templates and domain knowledge.

### Command → `.cursor/commands/<category>/<command-name>.md`
- YAML frontmatter with `description` and `argument-hint`
- Title: `# /command-name -- Short Label`
- Invocation examples
- Short workflow that parses mode, delegates to skill(s), and offers cross-command follow-ups
- Only command-specific overrides in `## Notes`

Do NOT duplicate the skill's templates, field-by-field question lists, or capability summary inside the command. See [`commands/README.md`](commands/README.md) for the full thin-wrapper pattern.

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
