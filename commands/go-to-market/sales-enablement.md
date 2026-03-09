---
description: Create a full suite of sales and marketing enablement materials — value props, battlecards, demo scripts, objection handling, and announcement copy
argument-hint: "<feature or product to enable>"
---

# /sales-enablement -- Sales & Marketing Enablement Kit

Create compelling, customer-focused enablement materials for a new feature or product. Produces up to 9 deliverables: internal overview, value proposition, competitive differentiation, customer personas, demo script, objection handling, battlecard, announcement copy, and one-pager.

## Invocation

```
/sales-enablement AI-powered search for enterprise customers
/sales-enablement Collaboration v2 — real-time co-editing feature
/sales-enablement [upload a PRD, spec, or feature brief]
```

## Workflow

### Step 1: Gather Feature Context

Accept input in any form — a feature name, a problem statement, a PRD, or uploaded materials.

Collect or infer:
- Feature name and what it does
- Customer problem it solves
- Target segment and buyer personas
- What's unique / differentiated
- Pricing tier and launch timing
- Competitors in this space
- Proof points (metrics, quotes, beta results)
- Messaging guardrails (what NOT to say)

If the user provides documents, extract what's available and ask about gaps (up to 2 questions).

### Step 2: Build the Enablement Kit

Apply the **sales-enablement** skill to produce up to 9 deliverables:

**Internal Materials**:
1. **Feature Overview** — What it is, why we built it, key capabilities, availability
2. **Target Customers & Personas** — ICP, personas with goals/challenges/triggers, qualifying signals

**Sales Tools**:
3. **Customer Value Proposition** — Elevator pitch, one-sentence value, 3 key benefits (before/after/impact), business outcomes
4. **Competitive Differentiation** — Unique advantage, comparison matrix, differentiator details, ready-to-use talking points
5. **Demo Script** — 5-minute flow: context → problem → solution → use case → differentiators → result
6. **Objection Handling** — 7+ common objections with responses, proof points, and follow-up questions
7. **Feature Battlecard** — One-page quick reference: pitch, benefits, proof points, competitive summary, 60-second demo, top objections

**Marketing Materials**:
8. **Feature Announcement Copy** — 3 headline options, body copy, social posts (LinkedIn + Twitter/X), email subject lines
9. **Customer-Facing One-Pager** — What it is, why it matters, key benefits, how it works, real results, CTA

### Step 3: Deliver the Output

Present each section as a clearly labeled document. If the user asked for "everything," produce all 9. If they asked for a subset, produce only what's requested.

Save as markdown using kebab-case: `[feature-name]-enablement.md`.

### Step 4: Offer Follow-ups

- "Want me to **create a battlecard for a specific competitor**?"
- "Should I **tailor the demo script** for a specific customer segment or vertical?"
- "Want me to **draft the email campaign** (full sequence, not just subject lines)?"
- "Should I **create a version for a different persona** (e.g., technical buyer vs. executive sponsor)?"
- "Want me to **add more objections** based on your sales team's feedback?"

## Notes

- Lead with value, not features — "Save 10 hours a week" beats "New automation engine"
- Use customer language — no jargon, no internal codenames, no ticket numbers
- Be specific — concrete numbers and examples beat vague claims every time
- Proof points are everything — customer quotes, metrics, and case studies make materials credible
- Keep it scannable — sales reps read these during calls; use bullets, bold, and short paragraphs
- Customer-facing materials should be at an 8th-grade reading level
- Provide multiple headline options so marketing can A/B test
- If the user specifies messaging guardrails, enforce them across all materials
- Demo scripts should never exceed 5 minutes — focus on one use case, not every feature
