---
description: Draft a concise, copy-ready email response from a pasted thread and short context
argument-hint: "<paste email thread + 1–2 lines of context>"
---

# /email-response-short -- Email Reply (Concise)

Variant of the email-response skill that returns **only the final email**, stripped of coaching sections. Use when you just want something to paste.

## Invocation

```
/email-response-short [paste full email thread]
/email-response-short [paste thread] — goal: quick yes/no with next steps
/email-response-short [paste customer email] — tone: apologetic
/email-response-short                                 # asks for email + context
```

## Workflow

### Step 1: Collect Minimal Context

Ask the user for the thread plus 1–2 lines on: who it's from, what they want, and any constraint. Keep it lightweight — at most 1–2 follow-up questions.

### Step 2: Delegate to Skill

Apply the **email-response** skill with `$LENGTH=short`, then from its output **extract only the final email** — discard the `Decoded Intent`, `Quality Check`, and `Alternative Versions` sections.

Render minimally:

```
## Final Email

Subject: [if starting a new thread, otherwise "-"]

[3–5 tight sentences: direct answer + clear next steps]
```

### Step 3: Offer Refinements

- "Want the **full coaching breakdown**?" (re-run as long)
- "Should I **switch tone** (more formal, firm, apologetic)?"

## Notes (command-specific overrides)

- **3–5 sentences max** — no backstory, no hedging
- **BLUF**: lead with the answer, not the lead-in
- **End with explicit next steps**: who does what, by when
- Professional and collegial by default unless the user specifies otherwise
