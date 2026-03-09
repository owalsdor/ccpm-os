---
description: Deep analysis of B2B survey data — themes, implicit signals, contradictions, segmentation, opportunities, risks, and actions
argument-hint: "<survey dataset or description>"
---

# /survey-analysis -- Deep Survey Analysis

Extract explicit themes, implicit signals, contradictions, and segmentation insights from survey data. Produces evidence-backed recommendations with every claim tied to specific row IDs.

## Invocation

```
/survey-analysis [paste CSV data or upload spreadsheet export]
/survey-analysis [upload survey results + question metadata]
/survey-analysis [paste 5-10 sample rows to refine the analysis approach first]
```

## Workflow

### Step 1: Accept the Data

Accept survey data in any form:
- CSV or table with row IDs (R01–R40+) and question columns (Q1–Q10+)
- Spreadsheet export (Excel, Google Sheets)
- Pasted rows with column headers
- Combination of data + separate question metadata file

If critical context is missing, ask up to 5 clarifying questions:
1. Exact question text for Q1–Q10+ (and any answer options/scales)?
2. Metadata per row (region, industry, customer size, install base, competitor, deal stage)?
3. Multiple rows per customer (different teams), or one row per customer?
4. What decisions should this analysis support (pipeline strategy, roadmap, competitive messaging)?
5. Specific topics to pull out (products, competitors, technology trends, workloads)?

### Step 2: Analyze the Data

Apply the **survey-analysis** skill across 8 analytical tasks:

1. **Normalize & map**: List questions, group overlapping ones into a logical framework
2. **Extract explicit themes** (5–10): Description, frequency, verbatim quotes with row IDs, implication
3. **Find implicit signals**: Unstated objections, sentiment, political blockers, skill gaps — labeled as inferences with evidence and validation questions
4. **Surface contradictions**: Disagreements across respondents with row IDs on both sides and likely drivers
5. **Run segmentation cuts** (2–4 slices): By industry, size, region, technology profile, or competitive footprint
6. **Diagnose opportunities & risks**: Top 5 each, plus early-warning indicators
7. **Recommend actions**: 5 sales plays, 3–5 product implications, 3 enablement assets — all tied to evidence
8. **Executive summary**: 10 bullets for senior leadership

### Step 3: Deliver the Analysis

```
## Survey Analysis: [Topic]

**Dataset**: [X responses, Y questions]
**Decision context**: [What this supports]

### Question Map
| Question | Measures | Framework Group |
|----------|----------|-----------------|

### Explicit Themes
#### Theme 1: [Name]
- **Frequency**: [X of Y, Z%]
- **Quotes**: "[verbatim]" (R03), "[verbatim]" (R17)
- **Implication**: [So what]

### Implicit Signals
#### Signal 1: [Inference — labeled]
- **Evidence**: "[quote]" (R05), "[quote]" (R14)
- **Alternative interpretation**: [What else it could mean]
- **Validation**: [Follow-up question]

### Contradictions
| Tension | Side A (Row IDs) | Side B (Row IDs) | Likely Driver |
|---------|-------------------|-------------------|---------------|

### Segmentation Insights
| Segment | Key Finding | Differs From Average? |
|---------|------------|----------------------|

### Opportunities & Risks
| # | Opportunities | Evidence | # | Risks | Evidence |
|---|--------------|----------|---|-------|----------|

### Recommended Actions
**Sales plays**: [5 with target signals + talk tracks]
**Product implications**: [3-5 with evidence]
**Enablement assets**: [3 with rationale]

### Executive Summary
[10 bullets for leadership]
```

Save as markdown.

### Step 4: Offer Follow-ups

- "Want me to **dive deeper into a specific theme** or segment?"
- "Should I **create sales plays** with full talk tracks from the findings?"
- "Want me to **build enablement materials** (battlecards, one-pagers) based on this analysis?"
- "Should I **reformat as an exec memo or slide-ready bullets**?"
- "Want me to **compare against a previous survey** to show trends?"

## Notes

- Every major claim must cite supporting row IDs — no unsourced assertions
- Separate **Facts** (directly stated) from **Inferences** (implied) — label each clearly
- Do not invent facts; when uncertain, label as hypothesis and explain what would validate it
- Use verbatim quotes, not paraphrases, as evidence
- Scale the analysis to the data — if the dataset is small, caveat the findings accordingly
- Use tables and headings throughout; the audience is senior leadership
- If the user provides sample rows first, help refine the approach before running the full analysis
