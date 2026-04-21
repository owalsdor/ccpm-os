---
description: Run a full product discovery cycle — from ideation through assumption mapping to experiment design
argument-hint: "<product or feature idea>"
---

# /discover -- Full Discovery Cycle

Orchestrates a structured discovery process by chaining four skills with user checkpoints: brainstorm → identify assumptions → prioritize assumptions → design experiments.

## Invocation

```
/discover Smart notification system for our project management tool
/discover New product: AI writing assistant for non-native speakers
/discover                    # asks what you're discovering
```

## Workflow

### Step 1: Understand the Discovery Context

Ask:
- What are you exploring? (product idea, feature area, opportunity space)
- Is this an **existing** product or a **new** product concept?
- What do you already know? (prior research, feedback, data)
- What decisions will this inform? (build/kill, prioritize, pivot)

Accept uploaded files, links, or freeform context.

### Step 2: Chain the Skills (with Checkpoints)

Pick the existing vs. new variant of each skill based on Step 1.

1. **Divergent** — apply **brainstorm-ideas-existing** or **brainstorm-ideas-new** to generate ~10 ideas.
   - Checkpoint: "Which 3–5 should we stress-test? Or carry all forward?"
2. **Critical** — apply **identify-assumptions-existing** or **identify-assumptions-new** to surface assumptions for each selected idea.
3. **Focus** — apply **prioritize-assumptions** to map Impact × Risk and rank the "leap of faith" assumptions.
   - Checkpoint: "Which feel most critical to validate first?"
4. **Validation** — apply **brainstorm-experiments-existing** or **brainstorm-experiments-new** for the top assumptions.

### Step 3: Compile the Discovery Plan

Stitch the outputs from each skill into a single discovery plan artifact with: ideas explored, selected ideas, critical assumptions, validation experiments, a 2–3 week timeline, and a decision framework (if X succeeds → proceed; if X fails → pivot/kill).

### Step 4: Offer Next Steps

- "Want me to **create a PRD** for the top idea?" (chains to create-prd skill)
- "Should I **design an interview script** to supplement these experiments?" (chains to interview prep)
- "Want me to **set up metrics** to track the experiments?"
- "Should I **write user stories** for the MVP?" (chains to write-stories)

## Notes

- This is a 15–30 minute structured workflow — let the user know upfront
- At each checkpoint, the user can redirect, skip, or go deeper
- For new products, emphasize desirability validation before feasibility
- For existing products, check if usage data can inform assumptions before brainstorming
- The discovery plan is a living document — offer to update it as experiments run
