---
description: Brainstorm product ideas or experiments from PM, Designer, and Engineer perspectives — for existing or new products
argument-hint: "[ideas|experiments] [existing|new] <product or feature description>"
---

# /brainstorm -- Multi-Perspective Ideation

Router for a 2×2 of brainstorm skills: `ideas` vs `experiments` × `existing` vs `new` product. Delegates to the matching skill.

## Invocation

```
/brainstorm ideas existing Mobile banking app engagement
/brainstorm ideas new AI-powered meal planning for busy parents
/brainstorm experiments existing Onboarding flow redesign
/brainstorm experiments new Marketplace for freelance designers
/brainstorm                          # asks what you need
```

## Workflow

### Step 1: Determine Mode

Parse two dimensions:

1. **What**: `ideas` (feature concepts) or `experiments` (validation tests)
2. **Stage**: `existing` (continuous discovery) or `new` (initial discovery)

If either is missing, ask:
- "**Ideas** for what to build, or **experiments** to validate assumptions?"
- "**Existing** product or **new** product concept?"

### Step 2: Delegate to Skill

| What × Stage | Skill |
|---|---|
| ideas + existing | **brainstorm-ideas-existing** |
| ideas + new | **brainstorm-ideas-new** |
| experiments + existing | **brainstorm-experiments-existing** |
| experiments + new | **brainstorm-experiments-new** |

Pass all context (product description, uploaded PRDs/research, constraints) to the skill. Each skill handles perspective-taking (PM, Designer, Engineer), templates, and ranking.

### Step 3: Offer Next Steps

- "Want me to **detail** any of these into a fuller spec?"
- "Should I **identify assumptions** behind the top ideas?" (chains to identify-assumptions-{existing|new})
- "Want to **design experiments** to validate the top ideas?" (switch to experiments mode)
- "Should I **prioritize** these against your current backlog?" (chains to prioritize-features)

## Notes

- For existing products, ground ideas in current user behavior and validated problems
- For new products, focus on desirability and feasibility risks first
- Encourage breadth first, then depth — generate many ideas before evaluating
- If the user uploads research, extract insights before brainstorming
