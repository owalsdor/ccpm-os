---
description: Analyze, categorize, and prioritize a batch of feature requests from customers or stakeholders
argument-hint: "<feature requests as text, file, or paste>"
---

# /triage-requests -- Feature Request Triage

Orchestrates feature-request triage by chaining two skills: analyze → prioritize. Turns a pile of requests into a ranked, actionable backlog.

## Invocation

```
/triage-requests                           # asks for input
/triage-requests [paste a list of requests]
/triage-requests [upload a CSV/spreadsheet]
```

## Workflow

### Step 1: Accept Feature Requests

Accept pasted text, uploaded files (CSV/Excel/text), or structured data. If structured, preserve the original columns and enrich them.

### Step 2: Gather Prioritization Context

Ask (conversationally, not all at once):
- What is the product and what stage is it in?
- Current strategic goals or OKRs?
- Constraints? (team size, tech debt, deadlines)
- Segments whose requests should carry more weight? (enterprise, churning, power users)

### Step 3: Chain the Skills

1. **analyze-feature-requests** — cluster into themes, count requests per theme, rate strategic alignment, surface segment patterns and sentiment signals.
2. **prioritize-features** — score themes and top requests by impact, strategic alignment, effort, risk, and revenue signal. Rank them.

Let each skill produce its own output; combine into a triage report with priority tiers (Act Now / Plan Next / Collect More Signal / Decline or Defer).

### Step 4: Offer Next Steps

- "Want me to **create user stories** for the top-priority items?" (chains to write-stories)
- "Should I **brainstorm solutions** for any of these themes?" (chains to brainstorm)
- "Want me to **design experiments** to validate demand before building?"
- "Should I **draft a stakeholder update** summarizing this analysis?"

## Notes

- Preserve any input CSV structure — output enriched data as a downloadable CSV if applicable
- Look for the need *behind* the request — "add dark mode" might really mean "reduce eye strain"
- Flag requests that conflict with each other (e.g., "simplify the UI" vs. "add more configuration")
- If volume is large (50+), summarize themes first and offer to drill into specific themes
