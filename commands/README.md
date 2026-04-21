# Commands

Slash commands in this repo are **thin orchestrators over skills**. A skill knows how to do one thing well; a command exists only when there is real orchestration to add on top of one or more skills.

> **Install note.** In a Cursor install, these files live at `.cursor/commands/<category>/<name>.md` (and skills at `.cursor/skills/<category>/<skill>/SKILL.md`). In this repo they also appear at `commands/` and `skills/` at the root — `.cursor/commands` and `.cursor/skills` are symlinks to those. Paths in this README are given as `.cursor/commands/` because that's what Cursor actually reads.

## When to add a command vs. a skill

**Prefer a skill** (auto-invoked by the agent based on intent) when:
- The capability is a single, self-contained task the agent should use naturally.
- There is no meaningful routing, chaining, or variant logic on top.

**Add a command** (invoked with `/name`) only when at least one is true:
- **Router** — one verb, multiple modes that map to different skills (e.g., `/sprint plan|retro|release-notes`, `/interview prep|summarize`).
- **Chain** — runs several skills in a fixed sequence and stitches their outputs (e.g., `/plan-launch` = beachhead → ICP → GTM).
- **Variant** — same skill with a hard parameter override that the agent wouldn't infer (e.g., `/email-response-short` enforces 3–5 sentences and strips coaching sections).
- **Non-skill integration** — talks to an MCP server or external tool, not a skill (e.g., `/webex-ai-followups`).

If a command is none of those, delete it and trust skill auto-discovery.

## Thin-wrapper pattern

Every command in this folder follows the same shape. Keep them terse — do not re-document what the underlying skill already does.

```markdown
---
description: <one-line description shown in the picker>
argument-hint: "[mode] <args>"
---

# /name -- Short title

One or two sentences on what this orchestrates.

## Invocation

```
/name mode arg
/name                # interactive mode
```

## Workflow

### Step 1: Determine Mode (if applicable)
Parse args; ask if missing.

### Step 2: Delegate to Skill(s)
- `mode-a` → apply the **skill-a** skill
- `mode-b` → apply the **skill-b** skill

Let each skill drive its own context-gathering, templates, and output.

### Step 3: Offer Next Steps
Cross-command handoffs ("Want me to chain into X?").

## Notes
Only command-specific rules the skill does NOT already enforce.
```

### What belongs in a command

- Mode routing and argument parsing
- The order and hand-off between chained skills
- Genuinely command-specific overrides (length caps, tone locks, output trimming)
- Cross-command follow-up suggestions

### What does NOT belong in a command

- Output templates — they live in the skill
- Field-by-field question lists — the skill handles context-gathering
- Summaries of "what the skill does" — redundant
- Framework explanations (e.g., defining SWOT) — the skill owns the domain knowledge

## Layout

Commands are grouped by domain, mirroring `.cursor/skills/`:

```
.cursor/commands/
├── execution/           # getting work done (sprint, stories, email)
├── go-to-market/        # launch, growth
├── market-research/     # user research synthesis
├── marketing-growth/    # marketing creative toolkit
├── product-discovery/   # brainstorm, discover, interview, triage
├── product-strategy/    # strategy, business model, pricing, market scan
└── toolkit/             # misc utilities (MCP integrations, etc.)
```

## When in doubt

If you catch yourself copying the skill's template into the command, stop — delete the command and let the skill handle it.
