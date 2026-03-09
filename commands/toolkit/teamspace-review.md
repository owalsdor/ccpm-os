---
description: Generate a metric-driven performance self-assessment from weekly reflections and a role summary
argument-hint: "<role summary and/or weekly reflections>"
---

# /teamspace-review -- Performance Self-Assessment

Transform weekly reflections and a role summary into a compelling, structured self-assessment with impact-driven bullets, themes, and growth areas.

## Invocation

```
/teamspace-review [paste or upload weekly reflections CSV + role summary]
/teamspace-review [upload spreadsheet export of weekly notes]
/teamspace-review [paste role description and any accomplishment notes]
```

## Workflow

### Step 1: Accept the Input

Accept in any form:
- A CSV or spreadsheet export of weekly reflections
- Pasted text with periodic notes (wins, challenges, priorities, manager needs)
- A role summary or job description
- A combination of all the above

If the review period isn't stated, infer it from the data. If critical context is missing (review format, emphasis areas, first review vs. recurring), ask up to 2 clarifying questions.

### Step 2: Analyze and Extract

Apply the **teamspace-review** skill:

Parse all reflections to identify:
- **Recurring wins**: Accomplishments that appear repeatedly or build over time
- **Key milestones**: Major deliverables, launches, decisions, or turning points
- **Challenges overcome**: Problems solved, obstacles navigated, risks mitigated
- **Skills demonstrated**: Leadership, collaboration, technical depth, stakeholder management
- **Quantifiable results**: Metrics, deadlines, revenue, adoption, quality outcomes
- **Growth areas**: New skills developed, feedback acted on, stretch assignments

Map each finding to the role's responsibilities, competencies, and success measures. Flag any responsibility areas with thin or missing evidence.

### Step 3: Generate the Self-Assessment

```
## Self-Assessment: [Review Period]

### Summary
[2-3 sentence narrative: who you are in this role, what defined this period, and what you delivered]

### Core Accomplishments
1. **[Accomplishment]**: [Impact-first bullet with metrics and scope]
2. **[Accomplishment]**: [Impact-first bullet with metrics and scope]
3. ...

### Competencies Demonstrated

**[Competency 1]**:
- [Evidence bullet with outcome]
- [Evidence bullet with outcome]

**[Competency 2]**:
- [Evidence bullet with outcome]

### Growth and Development
- [Skill or area developed, with evidence of progress]
- [Feedback acted on or stretch assignment taken]

### Themes from Reflections
- **[Theme]**: [Pattern observed across the review period with examples]

### Looking Ahead
- [Goal or focus area for the next period]
```

Save as markdown.

### Step 4: Offer Follow-ups

- "Want me to **sharpen specific bullets** with stronger metrics or language?"
- "Should I **reorder by impact** so your strongest accomplishments lead?"
- "Want me to **identify gaps** where you may want to add evidence?"
- "Should I **draft a manager-facing summary** (shorter, highlight reel only)?"

## Notes

- Impact over activity — never list tasks performed; always frame in terms of outcomes and results
- Specificity wins: "Improved NPS" is weak; "Improved NPS from 32 to 47 across 12 enterprise accounts" is strong
- If this is a first review or partial-year assessment, adjust expectations and framing accordingly
- Match the user's voice — draft bullets the user can own, not language that sounds ghostwritten
- If evidence is thin for a responsibility area, flag it honestly so the user can decide how to handle it
- Role summaries and reflections may contain sensitive information — treat them accordingly
