---
description: Draft a concise, professional email response from a pasted email thread and short context
argument-hint: "<paste email thread + 1–2 lines of context>"
---

# /email-response-short -- Email Reply (Concise)

Turn an email thread plus a bit of context into a short, copy‑ready response that is clear, direct, and to the point.

## Invocation

Use when you mostly care about the **final email**, not the full coaching breakdown.

```
/email-response-short [paste full email thread]
/email-response-short [paste thread] — goal: quick yes/no with next steps
/email-response-short [paste customer email] — tone: apologetic
/email-response-short                                 # asks for email + context
```

## Workflow

### Step 1: Collect the Email and Minimal Context

Ask the user to paste:

- The **email or thread** they want to respond to
- 1–2 short lines of context:
  - Who is this from? (customer, exec, peer, etc.)
  - What do they want? (decision, info, update, approval)
  - Any constraints or goal (e.g., "keep it brief", "don’t over‑promise")

Keep questions lightweight so they can move fast.

### Step 2: Map to `email-response` Skill Inputs

Normalize the information into arguments for the **email-response** skill:

- `$EMAIL_THREAD`: Raw text of the email or thread
- `$SENDER_TYPE`: Who sent it (customer, exec, peer, direct report, external partner)
- `$RELATIONSHIP`: Short description of the relationship (if provided)
- `$REQUEST_TYPE`: Infer if possible (decision, information, status, problem, ask, apology)
- `$GOAL`: Single-sentence goal for the response (e.g., "say yes with a clear next step")
- `$URGENCY`: Infer from context or leave as default if not specified
- `$TONE`: Default to "professional, collegial, direct" unless user specifies otherwise
- `$LENGTH`: Set to `"short"` so the skill optimizes for brevity
- `$NOTES`: Any extra hints the user gives ("I can’t commit to dates", "we said no before", etc.)

Avoid long back-and-forth. If critical info is missing, ask at most 1–2 focused follow-ups.

### Step 3: Generate the Email Response (Short Form)

Apply the **email-response** skill using the mapped arguments, and from its full output **extract only the final email**:

- Ignore or discard reasoning sections (`Decoded Intent`, `Quality Check`, `Alternative Versions`)
- Keep:
  - Subject (only if needed for a new thread)
  - Email body with short paragraphs and clear next steps

Render the result in a minimal format for easy copy-paste:

```
## Final Email

Subject: [if starting a new thread, otherwise "-"]

[Email body only — 3–5 tight sentences, with direct answer and clear next steps.]
```

### Step 4: Style and Tone Rules

Enforce these constraints:

- **Short and direct**
  - Aim for 3–5 sentences
  - No unnecessary backstory or hedging
- **Professional and collegial**
  - Write like a strong PM replying to a smart colleague or stakeholder
  - Be respectful but confident
- **Outcome-oriented**
  - Lead with the answer (BLUF)
  - End with explicit next steps: who does what, by when

If the user asks to adjust tone (more formal, more casual, more firm), regenerate via the same **email-response** skill with an updated `$TONE`, keeping the structure and brevity.