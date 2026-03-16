# PM Operating System — CLAUDE.md

Markdown-first **operating system for product managers** (templates, playbooks, examples).

## Defaults
- **Optimize for speed** and minimal back-and-forth.
- **Plan-only by default**: don’t edit files or run commands until I explicitly say “go ahead.”
- Ask **≤2** critical questions; otherwise assume sensible defaults.
- Default output is **markdown**, saved under `Cisco/<project>/` using the project structure below.
- Prefer existing “PM OS” workflows in `.cursor/commands/` and `.cursor/skills/` over inventing new formats.

## Project structure (per project)
For each new project, create a folder under `Cisco/`:
- `Cisco/<project>/index.md`
- `Cisco/<project>/templates/`
- `Cisco/<project>/playbooks/`
- `Cisco/<project>/examples/`
- `Cisco/<project>/glossary.md` (optional)

## Quality bar (lightweight)
- Scannable headings + checklists
- Clear audience + intended use
- Includes steps and at least one example (inline or in `<project>/examples/`)
- When the output is meeting/decision-oriented, include **Decisions**, **Action items** (with owner + due date if known), and **Open questions**.

## Learning
Track two types of knowledge:
- Domain: what things are (product context, user preferences, APIs, naming conventions, team decisions)
- Procedural: how to do things (deploy steps, test commands, review flows)

Organize knowledge as a hierarchy of .md files:
- knowledge/INDEX[.]md routes to categories
- Categories hold the details
- Progressive disclosure. Read top-down, only load what you need.

Log errors to knowledge/ERRORS.md. Not every error is a mistake:
- Deterministic errors (bad schema, wrong type, missing field) → conclude immediately
- Infrastructure errors (timeout, rate limit, network) → log, no conclusion until pattern emerges
- Conclusions graduate into the relevant domain or procedural file

## Self-Maintenance
Actively manage the knowledge system. This is as important as the current task:
- Review knowledge files at the start of each session
- Merge overlapping categories
- Split files that grow too long
- Remove knowledge that's no longer accurate
- Create new categories when patterns emerge
- When you notice something that should be in CLAUDE[.]md but isn't — propose the edit. Don't wait to be asked.

