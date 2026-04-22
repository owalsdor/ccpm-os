# Errors Log — cross-project / agent-wide

Append-only log of errors that aren't tied to a single project. Project-specific errors live in `<project>/ERRORS.md`.

Not every error is a mistake — some are signal, some are noise. Classify each entry.

## Classification (from `.cursorrules`)

- **Deterministic** — bad schema, wrong type, missing field, typo, invalid config.
  → Conclude immediately. Fix, note the fix, graduate the lesson into the right `domain/` or `procedural/` file, then you can remove the raw entry.
- **Infrastructure** — timeout, rate limit, network blip, flaky tool.
  → Log it, **no conclusion** until a pattern emerges across multiple entries. Only then graduate it.

## Entry format

```markdown
### YYYY-MM-DD — {short title}
- **Type:** deterministic | infrastructure
- **Context:** {what you were doing, which file/command}
- **Error:** {exact message or symptom}
- **Resolution:** {what fixed it — or "pending / pattern-watch"}
- **Graduated to:** {link to domain/ or procedural/ file, if the lesson moved}
```

Keep entries short. One error, one block. Newest at the top.

---

## Entries

<!-- errors-entries:start -->
_No entries yet._
<!-- errors-entries:end -->
