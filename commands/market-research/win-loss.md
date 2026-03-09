---
description: Analyze win/loss deal data to find actionable patterns — why you win, why you lose, against whom, and in which segments
argument-hint: "<win/loss data or deal context>"
---

# /win-loss -- Win/Loss Analysis

Analyze deal outcomes to find patterns that improve close rates. Categorizes wins and losses, breaks down by competitor and segment, quantifies impact, and produces prioritized recommendations.

## Invocation

```
/win-loss [paste or upload CRM export, sales notes, or deal summaries]
/win-loss We lost 5 enterprise deals to Competitor X last quarter — here are the details
/win-loss [upload interview transcripts or call recording notes]
```

## Workflow

### Step 1: Accept the Data

Accept win/loss data in any form:
- CRM export (CSV, table, spreadsheet)
- Sales notes or deal summaries (pasted or uploaded)
- Customer interview transcripts
- Call recording notes or summaries
- Competitive intel reports
- A combination of the above

If the data is sparse, work with what's available and flag gaps. Ask up to 2 questions if critical context is missing (time period, which competitors, what decisions this should inform).

### Step 2: Analyze the Deals

Apply the **win-loss** skill across 7 analytical steps:

1. **Categorize outcomes**: Won, lost to specific competitor, lost to status quo, lost to budget, lost to other
2. **Extract deal data**: Company size, industry, use case, deal size, cycle length, competitors evaluated, decision factors
3. **Find win patterns**: Product reasons, GTM reasons, market position — grouped into themes with evidence
4. **Find loss patterns**: Product gaps, pricing issues, GTM problems, market fit — with winnability assessment
5. **Competitive breakdown**: Per-competitor analysis — when we win, when we lose, strengths, advantages, positioning
6. **Segment analysis**: Patterns by company size, industry, use case, and deal size
7. **Quantify impact**: Rank themes by frequency x magnitude x addressability

### Step 3: Deliver the Analysis

```
## Win/Loss Analysis: [Time Period]

**Dataset**: [X wins, Y losses across Z deals]
**Competitors observed**: [List]

### Outcome Distribution
| Category | Count | % | Revenue |
|----------|-------|---|---------|

### Why We Win
#### [Theme]: [Product / GTM / Market Position]
- **Pattern**: [Description]
- **Frequency**: [X of Y wins]
- **Evidence**: [Deal examples]
- **Implication**: [What to double down on]

### Why We Lose
#### [Theme]: [Product Gap / Pricing / GTM / Market Fit]
- **Pattern**: [Description]
- **Frequency**: [X of Y losses]
- **Winnable?**: [Yes/No + what would have changed it]
- **Implication**: [What to fix]

### Competitive Breakdown
#### vs. [Competitor]
- **We win when**: [Reasons]
- **We lose when**: [Reasons]
- **Their strength**: [What they do well]
- **Our advantage**: [Where we beat them]
- **Positioning**: [How to position against them]

### Segment Insights
| Segment | Win Rate | Top Win Reason | Top Loss Reason |
|---------|----------|---------------|-----------------|

### Impact Prioritization
| Theme | Frequency | Revenue at Stake | Addressable? | Priority |
|-------|-----------|-----------------|--------------|----------|

### Recommended Actions
**Product**: [Changes that flip losses to wins]
**Sales / GTM**: [Process, messaging, enablement changes]
**Positioning**: [Competitive positioning adjustments]
**Enablement**: [Battlecards, talk tracks, training]

### Executive Summary
[5-10 bullets for leadership]
```

Save as markdown.

### Step 4: Offer Follow-ups

- "Want me to **deep-dive on a specific competitor**?"
- "Should I **create a battlecard** based on the competitive findings?"
- "Want me to **build sales plays** for the segments where we win most?"
- "Should I **draft product recommendations** with business cases from the loss data?"
- "Want me to **compare this to a previous period** to show trends?"

## Notes

- Every pattern must be backed by specific deals or quotes — no unsourced claims
- "Lost" always needs a destination — knowing you lost is useless without knowing to whom
- Focus on winnable losses — not every loss is a problem to solve; some deals were never a fit
- Segment differences are the real insight — overall win rate matters less than knowing where you win and lose by competitor + segment
- Addressability drives priority — a frequent theme you can't fix is less useful than a rare one you can
- If the dataset is small (< 10 deals), caveat the findings and focus on qualitative themes over statistics
- Don't just diagnose — every finding must lead to a specific, actionable recommendation
