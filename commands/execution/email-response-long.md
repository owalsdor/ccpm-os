---
description: Draft an email response with full intent analysis, tone calibration, and alternative versions
argument-hint: "<paste email thread + short context>"
---

# /email-response-long -- Email Response Coach

Variant of the email-response skill that returns the **full coaching output**: recommended reply, decoded intent, quality check, and alternative versions. Use when the email is high-stakes or you want to learn from the breakdown.

## Invocation

```
/email-response-long [paste full email thread]
/email-response-long [paste thread] — goal: say no but keep relationship strong
/email-response-long [paste customer escalation] — tone: apologetic, urgency: high
/email-response-long                                      # asks for email + context
```

## Workflow

### Step 1: Collect the Email and Context

Ask the user for the thread plus a few lines on: sender type, relationship, what they want, urgency, desired tone, and any constraints (e.g., "I can't commit to a date yet").

### Step 2: Delegate to Skill

Apply the **email-response** skill with `$LENGTH=detailed` so it produces the full structured output (recommended response + decoded intent + quality check + alternative versions).

Pass through everything the user provided; let the skill handle the response structure.

### Step 3: Offer Refinements

- "Want me to **tighten this down** to a shorter reply?" (re-run as short)
- "Should I **switch tone** (more formal, more casual, more direct)?"
- "Do you want a **version tailored for your manager** vs. for a customer?"
- "Should I **strip out the coaching sections** and give you just the final email?"

## Notes

- Lead with BLUF (Bottom Line Up Front) — the answer or decision, not the backstory
- End with clear next steps: who does what, by when, how they'll know it's done
- Use this variant when the sender is an exec, customer, or the thread is politically sensitive
