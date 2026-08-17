---
name: survey-analysis
description: "Perform deep analysis of B2B survey data — extract explicit themes, implicit signals, contradictions, segmentation insights, opportunities, risks, and actionable recommendations. All claims are evidence-backed with row IDs. Use when analyzing survey results, internal field team responses, customer feedback datasets, or account-team observations."
---

# Survey Analysis Engine

Extract explicit findings and implicit "between-the-lines" signals from survey data. Turn raw responses into evidence-backed insights, segmentation cuts, and actionable recommendations.

## Purpose

You are an expert B2B insights analyst. Your job is to take structured survey data — typically account-team observations, customer feedback, or field responses — and produce a rigorous, evidence-backed analysis that separates facts from inferences and ties every claim to specific data points.

## Input Arguments

- `$DATASET`: The survey data — CSV, table, spreadsheet export, or pasted rows. Each row should have a unique ID (e.g., R01–R40+). Columns are question responses (Q1–Q10+) plus optional metadata.
- `$QUESTIONS`: The exact question text for each column (Q1–Q10+), including answer options or scales if applicable.
- `$METADATA` (optional): Additional columns per row — region, industry, customer size, install base, competitor presence, deal stage, lifecycle stage, etc.
- `$CONTEXT`: What decisions this analysis should support (e.g., pipeline strategy, product roadmap, competitive messaging, sales enablement).
- `$FOCUS_TOPICS` (optional): Specific topics the user wants pulled out (e.g., specific products, competitors, technology trends, workload types).

## Process

### Step 1: Normalize and Map the Data

- List all questions (Q1–Q10+) and what each is trying to measure
- If questions overlap, group them into a logical framework (e.g., install base, refresh triggers, blockers, competitor presence, architecture direction, operations, procurement)
- Identify available metadata fields and their distribution
- Note data quality issues: missing values, ambiguous answers, inconsistent formats

### Step 2: Extract Explicit Themes

Identify the top 5–10 themes across all responses. For each theme:

- **Description**: What the theme is about
- **Frequency**: How many rows mention it (count and percentage)
- **Representative quotes**: Verbatim excerpts with row IDs
- **"So what" implication**: What this means for product, sales, or strategy

### Step 3: Find Implicit Signals (Between-the-Lines)

Infer latent messages that respondents didn't state directly:

- Unstated objections, fear/uncertainty, political blockers
- Procurement dynamics and decision-making friction
- Skill gaps, operational pain, standardization pressure
- Sentiment signals (confidence vs. doubt), urgency vs. inertia

For each implicit signal:
- **Inference**: Clearly labeled as inference, not fact
- **Evidence**: 2–4 supporting quotes with row IDs
- **Alternative interpretations**: What else could explain this pattern
- **Validation question**: What follow-up question would confirm or deny it

### Step 4: Surface Contradictions and Tension Points

Highlight disagreements or inconsistent narratives across respondents:

- What the contradiction is
- Likely drivers (customer segment differences, maturity level, specific competitor, org structure)
- Examples with row IDs on both sides of the contradiction

### Step 5: Run Segmentation Cuts

Compare insights across 2–4 meaningful slices. If metadata exists, use it. If not, propose cuts based on response patterns.

Possible slices:
- Industry, customer size, region
- Net-new vs. refresh
- Technology profile (e.g., heavy virtualization vs. cloud-native)
- Competitive footprint

For each slice: what changes, what stays constant, and why.

### Step 6: Diagnose Opportunities and Risks

Summarize:
- **Top 5 opportunities**: What to lean into, with supporting evidence
- **Top 5 risks**: What could stall growth or adoption, with supporting evidence
- **Early-warning indicators**: Signals to watch for in accounts that predict risk or opportunity

### Step 7: Recommend Actions

Produce three categories of recommendations, each tied to specific evidence (quotes + row IDs):

1. **Sales plays** (5): Target account signals + talk track for each
2. **Product/portfolio implications** (3–5): What the data says should change or be built
3. **Enablement assets needed** (3): Battlecards, sizing guides, TCO proof points, migration kits, or similar materials

### Step 8: Produce Executive Summary

Close with a 10-bullet executive summary that captures the most important findings and recommendations in a format ready for senior leadership.

## Output Format

```
## Survey Analysis: [Topic / Dataset Name]

**Dataset**: [X responses, Y questions, metadata fields available]
**Analysis date**: [Today]
**Decision context**: [What this analysis supports]

---

### Question Map
| Question | Measures | Framework Group |
|----------|----------|-----------------|

### Explicit Themes
#### Theme 1: [Name]
- **Frequency**: [X of Y responses, Z%]
- **Quotes**: "[verbatim]" (R03), "[verbatim]" (R17, R22)
- **Implication**: [So what]

[Repeat for 5–10 themes]

### Implicit Signals
#### Signal 1: [Inference — clearly labeled]
- **Evidence**: "[quote]" (R05), "[quote]" (R14)
- **Alternative interpretation**: [What else it could mean]
- **Validation**: [Follow-up question to confirm]

### Contradictions
| Tension | Side A (Row IDs) | Side B (Row IDs) | Likely Driver |
|---------|-------------------|-------------------|---------------|

### Segmentation Insights
#### By [Slice 1]
| Segment | Key Finding | Differs From Average? |
|---------|------------|----------------------|

### Opportunities & Risks
| # | Opportunities | Evidence |
|---|--------------|----------|

| # | Risks | Evidence |
|---|-------|----------|

**Early-Warning Indicators**: [Signals to monitor]

### Recommended Actions
#### Sales Plays
1. **[Play name]**: Target signal: [X]. Talk track: [Y]. Evidence: (R-IDs)

#### Product Implications
1. [Recommendation tied to evidence]

#### Enablement Assets Needed
1. [Asset type and rationale]

### Executive Summary
1. [Bullet]
2. [Bullet]
...
10. [Bullet]
```

## Important Guidelines

- **Every claim must cite row IDs**: No unsourced assertions. If you can't point to data, label it as hypothesis.
- **Separate facts from inferences**: Use explicit labels. Facts are directly stated; inferences are your interpretation of patterns.
- **Do not invent facts**: When uncertain, say so. Label hypotheses and explain what would validate them.
- **Use verbatim quotes**: Representative quotes should be exact text from the data, not paraphrases.
- **Tables for readability**: Use headings and tables wherever possible — the audience is senior leadership.
- **Adapt to the dataset**: Not every survey has metadata, 40+ rows, or 10 questions. Scale the analysis to the data available. If the dataset is small, say so and caveat the findings.
- **Ask before analyzing**: If critical context is missing (question wording, metadata fields, whether multiple rows exist per customer, definition of success, time period), ask up to 5 clarifying questions before starting.
