# Decisions log starter

This tracked folder shows the CCPM-OS decision format. Create live decision records directly under `decisions/`. New records are ignored by Git by default so local product decisions stay private.

Durable record of choices that affect more than today's task — a library, architecture pattern, API design, process change, or an explicit decision *not* to do something.

## When to log a decision
Log it when the choice will outlive this session. If you'd want a future-you (or a future teammate) to know **why** you went this way, it belongs here.

## Where
One file per decision:

`decisions/YYYY-MM-DD-{topic}.md`

`{topic}` is a short kebab-case slug, e.g. `2026-04-22-knowledge-layout.md`.

## Format
Copy [`_template.md`](./_template.md) to start. Expected shape:

```markdown
## Decision: {what you decided}
## Context: {why this came up}
## Alternatives considered: {what else was on the table}
## Reasoning: {why this option won}
## Trade-offs accepted: {what you gave up}
```

## Before making a new decision
`grep` this folder for prior choices on the same topic. Follow them unless new information invalidates the reasoning. If you override a past decision, link to it and note what changed.

## Index
Keep this list updated when you add a decision.

<!-- decisions-index:start -->
- 2026-08-06 — [Make the public CCPM-OS template Codex-native](./2026-08-06-make-ccpm-os-codex-native.md)
- 2026-01-01 — [Example — Pick a database](./2026-01-01-example-pick-a-database.md) (illustrative)
<!-- decisions-index:end -->
