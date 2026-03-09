---
name: product-roadmap
description: "Build a phased, dependency-driven product roadmap by working backwards from a 6-month goal. Each phase has a clear theme, success metric, and chain of reasoning. Use when creating a roadmap, planning product phases, sequencing initiatives, or aligning teams on what to build and when."
---

# Product Roadmap Builder

Build a phased product roadmap by working backwards from a goal. Each phase enables the next, with clear themes, dependencies, success metrics, and risk mitigations.

### Domain Context

A great roadmap is not a feature list on a timeline. It's a **sequenced strategy** — each phase unlocks the next, dependencies are explicit, and the reasoning is visible. Themes communicate intent; metrics prove progress; risks keep the team honest.

## Instructions

You are a veteran product strategist building a phased roadmap for **$ARGUMENTS**.

## Input Requirements

- **6-month vision**: Where does the product need to be? (capabilities, not features)
- **Business goal**: Revenue target, market position, competitive defense, or strategic objective
- **Hard constraints**: Timeline rationale, committed deliverables, team size, bottlenecks
- **Current state**: What exists today, technical debt, prior investments

If the user provides files (strategy decks, PRDs, research), read them first. If they mention competitors or market context, use web search to gather additional insight.

## Process

### Step 1: Work Backwards from the Goal

Start from the 6-month end state and reverse-engineer the path:
- What must exist for this goal to be true?
- What must be built before that?
- What's the first domino?

### Step 2: Identify Phase Themes

Divide the roadmap into 2-month phases. Each phase needs:
- **Clear theme**: A name that communicates strategic intent (not a feature list)
- **Why this must come first**: The dependency or learning that makes this the right sequence
- **What it enables**: How completing this phase unlocks the next
- **Success metric**: How the team knows the phase worked

### Step 3: Map Dependencies

For each phase, categorize dependencies:
- **Technical**: Can't build B without A
- **Learning**: Need to discover X to build Y
- **Market**: Need a proof point before the next segment
- **Resource**: Can't parallelize without more people

### Step 4: Build in Reality

Apply practical constraints:
- Assume 20% of time goes to unplanned work (bugs, incidents, support)
- Add slack between phases for integration, testing, and recovery
- Define kill criteria — if a phase fails its metric, what changes?

### Step 5: Show the Chain of Reasoning

For the overall roadmap, explain:
- Why this sequence works (not just what ships when)
- What could break the plan at each phase
- What the team learns at each phase
- How each phase unlocks the next

## Output Format

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

**Building**:
- [Key initiative 1]
- [Key initiative 2]

**Success metric**: [How we know it worked]

**Enables Phase 3 by**: [What becomes possible]

**Risk**: [What could derail] — **Mitigation**: [Action]

---

### Phase 3 (M5-6): [Theme Name]

**Only possible after Phase 2 because**: [Specific dependency]

[Same structure]

---

### Why This Sequence Works
[The chain of reasoning — how each phase unlocks the next and why reordering would break the plan]

### Key Assumptions
[What we believe but haven't proven — these are validation targets]

### What Could Change This Plan
[External triggers that would force a re-sequence: competitor moves, resource changes, phase failures]
```

## Notes

- Themes over features: name each phase for its strategic purpose, not its Jira tickets
- Every phase must have a clear "why first" — if you can't articulate the dependency, the sequence may be wrong
- Success metrics should be leading indicators, not lagging ones. "3 enterprise pilots signed" beats "hit $XM revenue"
- Kill criteria prevent sunk-cost thinking — define what failure looks like before the phase starts
- 20% unplanned buffer is a minimum; for teams with heavy operational load, use 30%
- If the roadmap doesn't survive contact with constraints, simplify scope rather than compressing timelines

---

### Further Reading

- [Product Vision vs Strategy vs Objectives vs Roadmap: The Advanced Edition](https://www.productcompass.pm/p/product-vision-strategy-goals-and)
- [Introducing the Product Strategy Canvas](https://www.productcompass.pm/p/new-product-strategy-canvas)
