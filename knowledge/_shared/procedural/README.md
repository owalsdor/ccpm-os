# Shared Procedural Knowledge

*How to do things*, across two or more projects — deploy steps, review flows, recurring playbooks, tool recipes that apply portfolio-wide.

Organize as small, focused files (one procedure per file). Suggested shape:

```
_shared/procedural/
├── README.md              # this file
├── release-checklist.md   # e.g. standard release flow
├── review-flow.md         # code/doc review steps
└── {topic}.md             # add as needed
```

Entries graduate here from a project's `procedural.md` once the same lesson appears in 2+ projects (see [`../../INDEX.md`](../../INDEX.md) → Graduation path).
