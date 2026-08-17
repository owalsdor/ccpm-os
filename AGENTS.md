# PM operating system

CCPM-OS is a Markdown-first operating system for product managers. It provides reusable Codex skills, project conventions, knowledge templates, and local integrations.

## Defaults

- Optimize for speed and minimal back-and-forth.
- Plan before changing files or running commands. Wait until the user says `go ahead` unless the user explicitly overrides this rule.
- Ask no more than two critical questions. Otherwise, state sensible assumptions and continue.
- Save substantial output as Markdown under `Cisco/<project>/`.
- Prefer existing skills under `.agents/skills/` over inventing a new format.
- Keep external delivery, messages, destructive actions, and other irreversible work behind explicit user approval.

## Private work and tracked templates

- Tracked reusable material lives in `AGENTS.md`, `Cisco/AGENTS.md`, `.agents/skills/`, `tools/mcp/`, and the starter files under `decisions/` and `knowledge/`.
- Project files under `Cisco/<project>/`, customer material, personal files, local Codex configuration, memory, and new knowledge or decision records are private and ignored by Git by default.
- Do not force-add ignored files merely to make them visible in a commit.
- Never commit credentials, OAuth tokens, customer-identifying data, personal paths, or confidential source material.

## Public Core release safety

- Treat every tracked file and every commit as internet-public. This repository is a standalone public release.
- `Cisco/AGENTS.md` is a public-source example, not an internal source of truth or roadmap.
- Keep live Cisco work, customer information, personal state, restricted sources, and runtime state outside Core.
- Before release, run `node scripts/validate-core.mjs`, build the Webex MCP server, inspect the complete diff, and verify that public `main` points to the intended commit.

## Project structure

For each project, use:

- `Cisco/<project>/index.md`
- `Cisco/<project>/meetings/`
- `Cisco/<project>/playbooks/`
- `Cisco/<project>/examples/`
- `Cisco/<project>/slides/`
- `Cisco/<project>/process/`
- `Cisco/<project>/files/`
- `Cisco/<project>/glossary.md`, when useful

Read `Cisco/AGENTS.md` before work under `Cisco/**`. More specific `AGENTS.md` files may add or override guidance for their subtree.

## Quality bar

- Use scannable headings and checklists.
- State the audience and intended use.
- Include clear steps and at least one useful example.
- Ground factual claims in provided material or current authoritative sources.
- For meeting or decision work, include Decisions, Action items with owner and due date when known, and Open questions.
- Verify changed links, run relevant checks, and review the final diff before handoff.

## Skills

- Codex discovers repository skills from `.agents/skills/<category>/<skill-name>/SKILL.md`.
- Each skill must use a folder that matches its lowercase, hyphenated `name`.
- Each `SKILL.md` frontmatter must contain only `name` and `description`.
- Put detailed references in `references/`, deterministic helpers in `scripts/`, and reusable output resources in `assets/`.
- Command-style routers and chains are skills under `.agents/skills/_commands/` and can be invoked with `$skill-name`.
- Keep skills focused and validate them after changes.

## Knowledge

Track two types of knowledge:

- Domain knowledge records what things are, such as product context, user preferences, APIs, naming conventions, and team decisions.
- Procedural knowledge records how work is done, such as deployment steps, test commands, and review flows.

Use this hierarchy:

- `knowledge/INDEX.md` routes across shared and project knowledge.
- `knowledge/<project>/` contains project-specific `INDEX.md`, `ERRORS.md`, and domain or procedural notes.
- `knowledge/_shared/` contains conclusions that apply to two or more projects.

Read progressively from the top-level index. Log project errors in the nearest project `ERRORS.md` and cross-project errors in `knowledge/ERRORS.md`.

## Decisions

Record choices that affect more than the current task in `decisions/YYYY-MM-DD-<topic>.md`, using `decisions/_template.md`.

Before making a similar choice, search `decisions/` and follow the prior decision unless new evidence invalidates its reasoning.

## Memory

If `memory.md` exists, read it at the start of a session. Add short dated notes when a durable environment quirk, fix, or operating lesson is likely to help a future session. `memory.md` remains private and ignored by Git.

## Tooling

- Use `rg` and `rg --files` first for text and file discovery.
- Read only the project and knowledge files needed for the task.
- Preserve unrelated user changes in a dirty worktree.
- Use the smallest validation set that gives confidence in the change.
- Treat infrastructure failures such as network or sandbox errors as environment evidence until verified.
