---
description: Turn a raw weekly brain dump into a structured plan with themed days, delegation, calendar outputs, and prioritized actions
argument-hint: "<brain dump text or upload>"
---

# /weekly-braindump -- Weekly Plan Builder

Transform everything on your mind into an executable weekly plan — themed days, delegation list, calendar-ready outputs, and clear next actions.

## Invocation

```
/weekly-braindump [paste everything on your mind — work + personal, no organizing needed]
/weekly-braindump [upload notes, voice memo transcript, or scattered to-do list]
/weekly-braindump onboarding (first-time setup to capture your profile and preferences)
```

## Workflow

### Step 1: Accept the Input

If the user provides a brain dump, skip straight to processing. Accept in any form:
- Raw text pasted in (stream of consciousness is fine)
- Uploaded notes, to-do lists, or voice transcripts
- A mix of work and personal items

If this is the first run and no profile exists, start with onboarding: gather role context, themed day preferences, non-negotiables, team/delegation map, and calendar tool in tight batches. Save as a reusable profile.

If the input is a brain dump, ask zero questions — process what's there.

### Step 2: Categorize and Decide

Apply the **weekly-braindump** skill:

1. Normalize the dump into a clean inbox list
2. Categorize each item: Strategy, Revenue, Marketing, Product, Hiring, Finance, Ops, Personal, Family, Health, Admin
3. Assign one action per item:
   - **Do** (< 2 min — handle now)
   - **Schedule** (assign to best themed day + time estimate)
   - **Delegate** (assign owner + draft delegation message with context, outcome, due date, checkpoint)
   - **Defer** (parking lot with revisit date)
   - **Delete** (not worth doing)
4. Identify the **top 3 outcomes** for the week and **top 3 risks** with mitigations

### Step 3: Generate the Weekly Plan

Produce all four outputs:

**1) Weekly Plan**
```
## Week of [Date]

### Weekly Objectives
1. [Outcome tied to KPI/goal]
2. [Outcome tied to KPI/goal]
3. [Outcome tied to KPI/goal]

### Top Risks
1. [Risk] — Mitigation: [action]

### Monday: [Theme]
- [ ] [Task] (time estimate)
- [ ] [Task]
- 🔒 Deep Work: [topic] (90 min)

### Tuesday: [Theme]
...

### Saturday: [Theme — Personal]
- [ ] [Personal commitment]

### Sunday: Brain Dump + Weekly Reset
- [ ] Weekly review
- [ ] Next week's brain dump
```

**2) Delegation List**
| Task | Owner | Expected Outcome | Due Date | Next Checkpoint |
|------|-------|-----------------|----------|-----------------|

**3) Calendar Plan**
| Title | Day | Start | End | Notes | Location |
|-------|-----|-------|-----|-------|----------|

Plus optional ICS blocks — one for recurring events, one for this week's one-offs. Times marked "ASSUMED" if inferred.

**4) Today's Next Actions**
Top 10 actions for today + parking lot of deferred items.

### Step 4: Offer Follow-ups

- "Want me to **adjust the themed days** or swap tasks between days?"
- "Should I **draft the delegation messages** so you can send them directly?"
- "Want me to **generate ICS files** for your calendar?"
- "Should I **trim the week** — it looks overloaded, I can recommend what to cut or defer?"

## Notes

- Deep work blocks (2 x 90 min, Mon–Thu) are protected — never schedule over them
- Non-negotiables (family, workouts, routines) are scheduled before work tasks
- Meetings are clustered together to keep themed days clean
- Delegation includes context, success criteria, constraints, and "first draft by" — not just a task name
- If the week is overloaded, say so and recommend cuts rather than cramming everything in
- Tone is direct, supportive, executive-level — no fluff, bias toward action
