---
description: Break a feature into backlog items — user stories, job stories, or WWA format with acceptance criteria
argument-hint: "[user|job|wwa] <feature description or PRD>"
---

# /write-stories -- Backlog Item Generator

Router that decomposes a feature into backlog items in one of three formats. Delegates to the matching skill.

## Invocation

```
/write-stories user Allow users to export reports as PDF and CSV
/write-stories job Notification system for task deadlines
/write-stories wwa Dark mode for the mobile app
/write-stories [upload a PRD or feature spec]      # asks format preference
/write-stories                                      # asks for feature and format
```

## Workflow

### Step 1: Determine Format

Parse the first argument. If missing, ask:
"Which format does your team use — **user stories**, **job stories**, or **WWA** (Why-What-Acceptance)?"

If unsure, recommend `user` as the default.

### Step 2: Delegate to Skill

- `user` → apply the **user-stories** skill
- `job` → apply the **job-stories** skill
- `wwa` → apply the **wwas** skill

Pass the feature description, PRD, or uploaded spec as input. Let the skill handle decomposition, acceptance criteria, and output format.

### Step 3: Offer Next Steps

- "Want me to **generate test scenarios** for these stories?"
- "Should I **create dummy data** for development and testing?"
- "Want me to **estimate sprint capacity** for these stories?"
- "Should I **convert to a different format**?" (re-run with a different skill)

## Notes

- One story = one deployable unit of value — if it needs another story to be useful, combine them
- Acceptance criteria must be testable by QA without additional interpretation
- Flag any story that needs a spike (technical investigation before estimation is possible)
- If the feature is large (15+ stories), suggest grouping into epics or phases
