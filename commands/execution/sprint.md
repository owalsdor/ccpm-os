---

## description: Sprint lifecycle — plan a sprint, run a retrospective, or generate release notes
argument-hint: "[plan|retro|release-notes] "

# /sprint -- Sprint Lifecycle

Router for three phases of the sprint lifecycle. Delegates to the matching skill.

## Invocation

```
/sprint plan 2-week sprint, 4 engineers, focus on checkout
/sprint retro [paste team feedback or sprint data]
/sprint release-notes [paste tickets, changelog, or PRD]
/sprint                                # asks which phase
```

## Workflow

### Step 1: Determine Mode

Parse the first argument. If missing, ask: "Which phase — `plan`, `retro`, or `release-notes`?"

### Step 2: Delegate to Skill

- `plan` → apply the **sprint-plan** skill
- `retro` → apply the **retro** skill
- `release-notes` → apply the **release-notes** skill

Pass the remaining arguments and any uploaded/pasted content as input. Let the skill drive its own context-gathering, templates, and output format.

### Step 3: Offer the Next Phase

- After `plan` → "Want me to run a **pre-mortem** on this plan?"
- After `retro` → "Want me to **generate the release notes** for what shipped?"
- After `release-notes` → "Want me to **plan the next sprint**?"

## Notes

- Modes are meant to flow: plan → (sprint happens) → retro → release-notes
- For `plan`, protect a 20% capacity buffer — teams that plan at 100% always miss
- For `retro`, focus on 2-3 high-impact action items, not 10 things nobody will do
- For `release-notes`, always frame changes as user benefits, not technical implementations

