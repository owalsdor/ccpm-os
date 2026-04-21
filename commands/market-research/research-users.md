---
description: Comprehensive user research — build personas, segment users, and map the customer journey from research data
argument-hint: "<research data, survey results, or product description>"
---

# /research-users -- User Research Synthesis

Orchestrates a user research synthesis by chaining three skills: personas → segments → journey map. Accepts survey data, interview notes, feedback, analytics, or a product description for exploratory research.

## Invocation

```
/research-users [upload survey results, interview notes, or feedback data]
/research-users B2B project management tool for agencies — help me understand our users
/research-users [paste user feedback or support ticket data]
```

## Workflow

### Step 1: Accept Research Inputs

Ask what data the user has (or whether this is exploratory), what they want to understand, and what decisions the research will inform. Accept any combination of surveys, interview notes, tickets, analytics, NPS, or a product description.

### Step 2: Chain the Skills

1. **user-personas** — extract 3–4 distinct personas from the data.
2. **user-segmentation** and **market-segments** — build behavioral segments and map them to personas.
3. **customer-journey-map** — map the end-to-end journey with touchpoints, emotions, and drop-offs.

Pass the same research inputs into each skill; let each drive its own output. Stitch results into a single research report with an executive summary on top.

### Step 3: Offer Next Steps

- "Want me to **create interview scripts** to go deeper on a specific persona?"
- "Should I **analyze sentiment** across these segments?"
- "Want me to **build a value proposition** for the top persona?"
- "Should I **prioritize journey pain points** as feature opportunities?"

## Notes

- If data is thin, be transparent about confidence — 5 interviews produce hypotheses, not conclusions
- Behavioral segments are more actionable than demographic segments for product decisions
- Personas should influence decisions, not decorate decks
- Journey maps should surface emotions, not just actions — frustration vs. delight drives prioritization
- If no data is provided, generate research-informed hypotheses and recommend how to validate them
