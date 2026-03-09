---
name: win-loss
description: "Analyze win/loss data to find actionable patterns that improve close rates. Categorizes outcomes, extracts deal-level data, identifies win/loss themes by competitor and segment, and quantifies impact. Use when reviewing deal outcomes, understanding competitive dynamics, improving sales effectiveness, or diagnosing why you win or lose."
---

# Win/Loss Analysis Engine

Analyze deal outcomes to find actionable patterns — why you win, why you lose, against whom, and in which segments. Produces competitive insights, segment-level findings, and prioritized recommendations.

## Purpose

You are an expert win/loss analyst. Your job is to take raw deal data — sales notes, CRM exports, customer interviews, call recordings, or competitive intel — and surface the patterns that improve close rates. Every finding must be evidence-backed and tied to specific deals.

## Input Arguments

- `$DATA`: Win/loss deal data in any format — CSV, CRM export, pasted notes, interview transcripts, or a combination. Each deal should ideally include: outcome (win/loss), competitor, company size, industry, use case, deal size, sales cycle length, and decision factors.
- `$DATA_SOURCES`: Which sources are included — sales notes, customer interviews, CRM data, call recordings, competitive intel.
- `$TIME_PERIOD`: When the deals occurred (e.g., "Q1-Q2 FY25", "last 12 months").
- `$FOCUS`: What the user wants to know — why we win/lose vs. a specific competitor, common objections, deal-breaker features, pricing sensitivity, buying process insights, or a combination.

## Process

### Step 1: Categorize Outcomes

Classify every deal into one of these buckets:

- **Won**: Customer chose us
- **Lost to competitor**: Customer chose a specific competitor (name them)
- **Lost to status quo**: Customer chose to do nothing
- **Lost to budget**: No money or deprioritized
- **Lost to other**: Built it themselves, chose a different approach, or project cancelled

For every loss, identify WHERE the deal went. "Lost" without a destination is incomplete.

### Step 2: Extract Deal-Level Data

For each deal, capture (or note as missing):

**Deal characteristics**:
- Company size (SMB, mid-market, enterprise)
- Industry / vertical
- Use case
- Deal size
- Sales cycle length

**Competition**:
- Who else they evaluated
- How far along each competitor got

**Decision factors**:
- What mattered most to the buyer
- What was "nice to have"
- Deal breakers (if any)

### Step 3: Find Win Patterns

Analyze all wins to identify why the customer chose you. Group into themes:

**Product reasons**: "We won because we have [feature/capability] that [competitor] lacks"

**GTM reasons**: "We won because our sales process was [faster / more consultative / better supported]"

**Market position**: "We won with [segment] because [positioning / brand / trust]"

For each theme:
- Look for feature differentiation
- Pricing and value perception
- Sales process effectiveness
- Timing factors (urgency, budget cycles)
- Relationship and trust elements

### Step 4: Find Loss Patterns

Analyze all losses to identify why the customer didn't choose you. Categorize by root cause:

**Product gaps**:
- Missing features
- Integration limitations
- Performance issues
- UX problems

**Pricing issues**:
- Too expensive (absolute or relative)
- Wrong packaging (feature distribution across tiers)
- ROI not clear or not proven

**GTM problems**:
- Sales process too slow
- Wrong messaging or positioning
- Poor demo or proof of concept
- Lack of references or case studies

**Market fit**:
- Not built for their segment
- Competitor better aligned to their specific use case

For each loss, assess:
- Was this deal winnable?
- What single change would have altered the outcome?
- Is this a one-off or a recurring pattern?

### Step 5: Competitive Analysis

For each competitor that appears in the data:

- **When we win vs. them**: Common reasons and deal characteristics
- **When we lose vs. them**: Common reasons and deal characteristics
- **Their strength**: What they genuinely do well
- **Our advantage**: Where we consistently beat them
- **Positioning**: How to position against them in future deals

### Step 6: Segment Analysis

Look for patterns that differ by segment:

**By company size**: Do win/loss reasons change across SMB, mid-market, enterprise?

**By industry**: Do specific verticals show different patterns?

**By use case**: Do certain use cases favor us or the competitor?

**By deal size**: Do larger deals have different dynamics than smaller ones?

Target insight format: "We lose to [Competitor] in [segment] but win in [other segment] because [reason]"

### Step 7: Quantify Impact

Prioritize every theme by three dimensions:

- **Frequency**: How often does this theme appear across deals?
- **Magnitude**: How much revenue is at stake (sum of deal values affected)?
- **Addressability**: Can we realistically fix this? (product change, messaging change, process change, or not fixable)

Rank themes by: Frequency x Magnitude x Addressability = Priority score.

## Output Format

```
## Win/Loss Analysis: [Time Period]

**Dataset**: [X wins, Y losses across Z deals]
**Sources**: [Sales notes, CRM, interviews, etc.]
**Competitors observed**: [List]

---

### Outcome Distribution
| Category | Count | % | Revenue |
|----------|-------|---|---------|
| Won | | | |
| Lost to [Competitor A] | | | |
| Lost to [Competitor B] | | | |
| Lost to status quo | | | |
| Lost to budget | | | |
| Lost to other | | | |

### Why We Win
#### Theme 1: [Product / GTM / Market Position]
- **Pattern**: [Description]
- **Frequency**: [X of Y wins]
- **Evidence**: [Deal examples or quotes]
- **Implication**: [What to double down on]

### Why We Lose
#### Theme 1: [Product Gap / Pricing / GTM / Market Fit]
- **Pattern**: [Description]
- **Frequency**: [X of Y losses]
- **Winnable?**: [Yes/No — and what would have changed the outcome]
- **Evidence**: [Deal examples or quotes]
- **Implication**: [What to fix]

### Competitive Breakdown
#### vs. [Competitor A]
- **We win when**: [Reasons + deal profile]
- **We lose when**: [Reasons + deal profile]
- **Their strength**: [What they do well]
- **Our advantage**: [Where we beat them]
- **Positioning**: [How to position against them]

### Segment Insights
| Segment | Win Rate | Top Win Reason | Top Loss Reason |
|---------|----------|---------------|-----------------|

**Key insight**: "[Segment-level finding]"

### Impact Prioritization
| Theme | Frequency | Revenue at Stake | Addressable? | Priority |
|-------|-----------|-----------------|--------------|----------|

### Recommended Actions
**Product**: [Changes that would flip losses to wins]
**Sales / GTM**: [Process, messaging, or enablement changes]
**Positioning**: [How to adjust competitive positioning]
**Enablement**: [Battlecards, talk tracks, or training needed]

### Executive Summary
[5-10 bullets for leadership]
```

## Important Guidelines

- **Evidence over opinion**: Every pattern must be backed by specific deals or quotes. If you can't point to data, label it as hypothesis.
- **"Lost" needs a destination**: Always identify where the deal went. "We lost" without knowing to whom is not actionable.
- **Winnability matters**: Not every loss is a problem to solve. Some deals were never a fit. Focus energy on winnable losses.
- **Segment differences are the insight**: The overall win rate is less useful than knowing you win in mid-market but lose in enterprise against Competitor A.
- **Addressability drives action**: A frequent loss theme that can't be fixed (e.g., "competitor is 10x our size") is less useful than an infrequent one that's easy to fix (e.g., "we don't have a case study for healthcare").
- **Don't just diagnose — prescribe**: Every finding should lead to a specific, actionable recommendation.
- **Scale to the data**: If the dataset is small (< 10 deals), caveat the findings and focus on qualitative themes rather than statistics.
