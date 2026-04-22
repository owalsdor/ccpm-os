# Example Project — Errors Log

Append-only log of errors specific to this project. Cross-project errors go in [`../ERRORS.md`](../ERRORS.md).

## Classification (from `.cursorrules`)

- **Deterministic** — bad schema, wrong type, missing field, typo, invalid config.
  → Conclude immediately. Fix, note the fix, graduate the lesson into [`domain.md`](./domain.md) or [`procedural.md`](./procedural.md), then you can remove the raw entry.
- **Infrastructure** — timeout, rate limit, network blip, flaky tool.
  → Log it, **no conclusion** until a pattern emerges. Only then graduate it.

## Entry format

```markdown
### YYYY-MM-DD — {short title}
- **Type:** deterministic | infrastructure
- **Context:** {what you were doing, which file/command}
- **Error:** {exact message or symptom}
- **Resolution:** {what fixed it — or "pending / pattern-watch"}
- **Graduated to:** {link to domain.md or procedural.md, if the lesson moved}
```

Newest at the top.

---

## Entries

<!-- errors-entries:start -->
_No entries yet._
<!-- errors-entries:end -->
