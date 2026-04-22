# Knowledge Index — starter template

Starter folder for CCPM-OS adopters. Copy this folder into **`.cursor/knowledge/`** once, then maintain your knowledge base there. Your live knowledge lives at `.cursor/knowledge/`; this folder stays in the repo as the template everyone clones.

Federation router for the PM OS knowledge base. Read top-down; only load the file you need.

Two kinds of knowledge live here (per `.cursorrules`):

- **Domain** — *what things are*: product context, user preferences, APIs, naming conventions, team decisions, stakeholders, glossary.
- **Procedural** — *how to do things*: deploy steps, test commands, review flows, recurring playbooks, tool recipes.

Structure is **federated**: each project has its own subtree, plus a shared subtree for anything that applies to 2+ projects or is portfolio-wide.

Errors:
- Cross-project / agent-wide errors: [`ERRORS.md`](./ERRORS.md)
- Project-specific errors: `<project>/ERRORS.md` (see each project below)

Durable cross-cutting decisions live in [`../decisions/`](../decisions/).

---

## Shared — `.cursor/knowledge/_shared/`

Knowledge that applies to 2+ projects, or that is truly portfolio-wide. This is where stable per-project conclusions **graduate** when they stop being project-specific.

| Category | File |
|---|---|
| Domain (shared) | [`_shared/domain/`](./_shared/domain/) |
| Procedural (shared) | [`_shared/procedural/`](./_shared/procedural/) |

---

## Projects

Each row points to a project's own knowledge subtree. Each project mirrors the same mini-structure: `INDEX.md`, `ERRORS.md`, and `domain*` / `procedural*` files as needed.

| Project | Knowledge | Errors | Project workspace |
|---|---|---|---|
| Example Project _(illustrative — delete when you add real ones)_ | [example-project/INDEX.md](./example-project/INDEX.md) | [example-project/ERRORS.md](./example-project/ERRORS.md) | `.cursor/<your-area>/example-project/` |

---

## Graduation path

1. **Raw signal → project ERRORS.** Log errors in the right `<project>/ERRORS.md`. Deterministic errors conclude immediately; infra errors wait for a pattern.
2. **Conclusion → project domain/procedural.** When a lesson is stable and project-specific, move it into `<project>/domain.md` or `<project>/procedural.md`.
3. **Applies to 2+ projects → `_shared/`.** When the same conclusion shows up in multiple project subtrees, graduate it into `_shared/domain/` or `_shared/procedural/` and leave a one-line pointer in the project files.

## Housekeeping (from `.cursorrules`)

- Review this INDEX at the start of each session.
- Merge overlapping categories. Split files that grow too long.
- Remove knowledge that's no longer accurate.
- Create a new `_shared/…` entry when you see the same thing land in 2+ project subtrees.
- When you notice something that should be in `.cursorrules` but isn't — propose the edit.
