## PM Operating System (Markdown-first) + Cisco Compute notes

This repo is a **Markdown-first operating system for Product Managers**: reusable Cursor “slash commands” (workflows) and “skills” (playbooks/templates) that turn rough inputs into high-quality PM artifacts fast, with minimal back-and-forth.

It also includes a Cisco Compute/UCS/Intersight vocabulary + portfolio reference to keep internal docs consistent.

---

## Quickstart (how to use)

- Open this folder in **Cursor**.
- Use the **slash commands** in `.cursor/commands/` (type `/` in chat, pick a command, paste your input).
- Outputs should default to **markdown saved under `Cisco/<project>/...`** (see structure below).

### Important default behavior (repo rule)

- **Plan-only by default**: don’t edit files or run terminal commands until you explicitly say **“go ahead.”**
- Ask **≤ 2** critical questions; otherwise assume sensible defaults.
- Prefer existing workflows in `.cursor/commands/` and `.cursor/skills/` over inventing new formats.

(These are defined in `CLAUDE.md` at the repo root.)

---

## What’s in here

### 1) Workspace operating rules

- `CLAUDE.md`
  - Defines the PM OS defaults, output conventions, and quality bar.

### 2) Cisco Compute reference

- `Cisco/CLAUDE.md`
  - “Fast internal-context reference” for **Cisco Compute**: UCS portfolio map, Intersight framing, glossary, and stakeholder triage questions.

Use this when you want consistent language across PRDs, strategy docs, and stakeholder updates.

---

## Cursor commands (workflows)

Slash commands live under `.cursor/commands/` and are organized by category.

### Data & analytics (`.cursor/commands/pm-data-analytics/`)

- `/analyze-test` — A/B test analysis (significance, power checks, ship/extend/stop)
- `/analyze-cohorts` — cohort/retention analysis
- `/write-query` — generate SQL from natural language

### Execution (`.cursor/commands/pm-execution/`)

- `/meeting-notes` — turn transcripts into decisions + action items
- `/write-prd` — draft a PRD from an idea/problem statement
- `/write-stories` — generate user stories / backlog items
- `/test-scenarios` — generate QA scenarios from requirements
- `/stakeholder-map` — power/interest mapping + comms plan
- `/plan-okrs` — OKR brainstorming
- `/sprint` — sprint planning
- `/pre-mortem` — launch/initiative risk pre-mortem
- `/transform-roadmap` — output roadmap → outcome roadmap
- `/generate-data` — create dummy datasets

### Product discovery (`.cursor/commands/pm-product-discovery/`)

- `/brainstorm` — generate ideas for a problem space
- `/discover` — structure discovery work
- `/interview` — interview scripts/questions
- `/setup-metrics` — metrics + dashboard setup
- `/triage-requests` — analyze/cluster feature requests

### Research (`.cursor/commands/pm-market-research/`)

- `/research-users` — user research synthesis/plans
- `/analyze-feedback` — sentiment/themes from feedback
- `/competitive-analysis` — competitor analysis

### Marketing & growth (`.cursor/commands/pm-marketing-growth/`)

- `/north-star` — define North Star + input metrics
- `/market-product` — positioning/value prop style outputs

### Go-to-market (`.cursor/commands/pm-go-to-market/`)

- `/plan-launch` — GTM plan
- `/growth-strategy` — growth loops/motions
- `/battlecard` — competitive battlecard

### Product strategy (`.cursor/commands/pm-product-strategy/`)

- `/strategy` — product strategy canvas-style output
- `/pricing` — pricing analysis + options
- `/market-scan` — market scan
- `/business-model` — business model canvas
- `/value-proposition` — value prop design

### Toolkit (`.cursor/commands/pm-toolkit/`)

- `/proofread` — grammar/flow check
- `/draft-nda` — NDA draft
- `/privacy-policy` — privacy policy draft
- `/review-resume` — resume review
- `/tailor-resume` — resume tailoring

---

## Skills (playbooks/templates)

Skills live under `.cursor/skills/` and are referenced by commands (e.g., `/write-prd` uses the `create-prd` skill).

Examples you have in this repo include:

- **Data/analytics**: `ab-test-analysis`, `cohort-analysis`, `sql-queries`
- **Execution**: `create-prd`, `user-stories`, `job-stories`, `release-notes`, `pre-mortem`, `stakeholder-map`, `summarize-meeting`, `test-scenarios`, `dummy-dataset`, `prioritization-frameworks`, `outcome-roadmap`, `sprint-plan`, `retro`
- **Discovery**: opportunity-solution-tree, assumption mapping/prioritization, experiment design, feature-request analysis, interview script, metrics dashboard
- **Research**: competitor analysis, market sizing/segments, journey maps, personas, segmentation, sentiment analysis
- **GTM**: ICP, GTM strategy/motions, beachhead segment, growth loops, battlecards
- **Strategy**: product strategy/vision, SWOT, pricing, Porter’s 5 forces, PESTLE, business/lean/startup canvases, monetization, Ansoff, value proposition
- **Toolkit**: NDA, privacy policy, resume review, grammar check

If you’re adding new workflows, prefer:

- a **command** in `.cursor/commands/<category>/...` for invocation + structure
- a **skill** in `.cursor/skills/<category>/<skill-name>/SKILL.md` for the reusable playbook

---

## Output structure (per project)

When creating new work, default to:

- `Cisco/<project>/index.md`
- `Cisco/<project>/templates/`
- `Cisco/<project>/playbooks/`
- `Cisco/<project>/examples/`
- `Cisco/<project>/glossary.md` (optional)

---

## Working style / quality bar

Docs should be:

- scannable headings + checklists
- clear audience + intended use
- include steps and at least one example
- if meeting/decision-oriented: include **Decisions**, **Action items** (owner + due date if known), **Open questions**

---

## Notes

- This repo is not currently a git repository (as detected by the environment), so treat outputs as local artifacts unless you later add version control.
