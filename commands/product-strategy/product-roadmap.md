---
description: Build a phased, dependency-driven product roadmap by working backwards from a 6-month goal
argument-hint: "<product or goal to roadmap>"
---

# /product-roadmap -- Phased Product Roadmap

Build a sequenced product roadmap where each phase enables the next. Works backwards from a goal, maps dependencies, and produces themed phases with success metrics and risk mitigations.

## Invocation

```
/product-roadmap Launch enterprise self-serve platform in 6 months
/product-roadmap Migrate from monolith to microservices for the payments team
/product-roadmap [upload a strategy deck, PRD, or vision doc]
```

## Workflow

### Step 1: Gather the Inputs

Collect four pieces of context (from the user or provided files):

1. **6-month vision**: Where does the product need to be? (capabilities, not features)
2. **Business goal**: Revenue target, market position, competitive defense
3. **Hard constraints**: Timeline rationale, committed deliverables, team size, bottlenecks
4. **Current state**: What exists today, technical debt, prior investments

If the user provides documents, extract what's available and only ask about gaps. If they mention competitors or market context, use web search for additional insight.

### Step 2: Work Backwards and Sequence

Apply the **product-roadmap** skill:

1. Start from the 6-month end state and reverse-engineer the path
2. Divide into 2-month phases, each with a clear theme (not a feature list)
3. Map dependencies for each phase: technical, learning, market, resource
4. Build in 20% unplanned buffer and slack between phases
5. Define kill criteria — what failure looks like before the phase starts

### Step 3: Generate the Roadmap

```
## 6-Month Roadmap: [Goal]

**Vision**: [End-state capability description]
**Business goal**: [Revenue, market, or strategic outcome]
**Constraints**: [Key constraints shaping the plan]

---

### Phase 1 (M1-2): [Theme Name]

**Building**:
- [Key initiative 1]
- [Key initiative 2]

**Why first**: [Dependency — creates foundation for X, learns Y]

**Success metric**: [How we know it worked]

**Enables Phase 2 by**: [What becomes possible]

**Risk**: [What could derail] — **Mitigation**: [Action]

---

### Phase 2 (M3-4): [Theme Name]

**Only possible after Phase 1 because**: [Specific dependency]

[Same structure]

---

### Phase 3 (M5-6): [Theme Name]

**Only possible after Phase 2 because**: [Specific dependency]

[Same structure]

---

### Why This Sequence Works
[Chain of reasoning — how each phase unlocks the next]

### Key Assumptions
[What we believe but haven't proven]

### What Could Change This Plan
[External triggers that would force a re-sequence]
```

Save as markdown.

### Step 4: Offer Follow-ups

- "Want me to **break Phase 1 into user stories** for engineering?"
- "Should I **stress-test this roadmap** with a pre-mortem?"
- "Want me to **create a stakeholder-ready summary** (one-pager, no detail)?"
- "Should I **map the dependencies visually** as a table or diagram?"

## Notes

- Themes over features — name each phase for its strategic purpose, not its ticket list
- Every phase must have a clear "why first"; if you can't articulate the dependency, the sequence may be wrong
- Success metrics should be leading indicators: "3 enterprise pilots signed" beats "hit $XM revenue"
- Kill criteria prevent sunk-cost thinking — define what failure looks like before the phase starts
- If the roadmap doesn't survive contact with constraints, simplify scope rather than compressing timelines
- 20% unplanned buffer is a minimum; for heavy-ops teams, use 30%
