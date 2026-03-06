---
description: Draft a clear, action-oriented email response with full intent analysis, tone calibration, and alternative versions
argument-hint: "<paste email thread + short context>"
---

# /email-response-long -- Email Response Coach

Turn messy or high-stakes email threads into clear, confident responses that decode intent, clarify next steps, and offer alternative versions.

## Invocation

Use when you want **both** the final email and the reasoning behind it.

```
/email-response-long [paste full email thread]
/email-response-long [paste thread] — goal: say no but keep relationship strong
/email-response-long [paste customer escalation] — tone: apologetic, urgency: high
/email-response-long                                      # asks for email + context
```

## Workflow

### Step 1: Collect the Email and Context

Ask the user to paste:

- The **full email thread** they want to respond to
- Their quick answers to:
  - Who is this from? (customer, exec, team member, external)
  - What do they want? (decision, update, approval, information)
  - What’s your relationship? (direct report, peer, boss, customer, prospect, etc.)
  - Urgency level? (respond in 5 min vs. can wait)
  - Tone needed? (formal, casual, apologetic, firm, neutral)

Encourage optional extras:

- Related context (Slack threads, docs, previous decisions)
- Their rough draft, if they already started writing
- Any constraints (e.g., "I can’t commit to a date yet")

### Step 2: Map to `email-response` Skill Inputs

Normalize the collected information into arguments for the **email-response** skill:

- `$EMAIL_THREAD`: Raw text of the email thread
- `$SENDER_TYPE`: Who sent it (customer, exec, peer, direct report, external partner)
- `$RELATIONSHIP`: Short description of the relationship
- `$REQUEST_TYPE`: If obvious, classify as:
  - Decision needed
  - Information request
  - Status/update request
  - Problem escalation
  - Asking for something
  - Apology / recovery
- `$GOAL`: What the user wants this email to achieve (e.g., "unblock this escalation", "say no but keep them happy", "get data by Thursday")
- `$URGENCY`: "now/ASAP", "this week", or "low", based on user input or thread tone
- `$TONE`: Desired tone (formal, casual, apologetic, firm, reassuring, neutral)
- `$LENGTH`: Set to `"detailed"` by default for this command (long-form coaching output)
- `$NOTES`: Any extra context, constraints, or user draft content

If anything is missing or ambiguous, ask 1–3 focused follow-up questions before proceeding.

### Step 3: Generate the Email Response (Long Form)

Apply the **email-response** skill using the mapped arguments to produce a **structured coaching output**, including:

- **Recommended response**: Subject line (if needed) and full email body
- **Decoded intent**: What they’re asking for vs. what they actually need and are worried about
- **Quality check**: Clear / complete / concise assessment
- **Alternative versions**:
  - More detailed
  - More direct
  - More formal

Render the result using the skill’s default markdown structure:

```
## Recommended Response

Subject: [...]

Email:

[Final email text]

---

## Decoded Intent
[...]

## Quality Check
[...]

## Optional Alternative Versions
[...]
```

### Step 4: Offer Refinements

After generating the long-form output, offer fast follow-ups such as:

- "Want me to **tighten this down** to a shorter reply?"
- "Should I **switch tone** (more formal, more casual, more direct)?"
- "Do you want a **version tailored for your manager** vs. for a customer?"
- "Should I **strip out the coaching sections** and give you just the final email?"

You can then:

- Regenerate with a different `$TONE` or `$LENGTH`
- Simplify to the single recommended email for quick copy-paste

### Notes

- Prioritize **BLUF (Bottom Line Up Front)**—lead with the answer or decision, not the backstory
- Be opinionated about clarity: shorten, de-jargon, and remove hedging language
- Always end with **clear next steps**: who does what, by when, and how they’ll know it’s done