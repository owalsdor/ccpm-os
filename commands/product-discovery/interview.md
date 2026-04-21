---
description: Prepare a customer interview script or summarize an interview transcript into structured insights
argument-hint: "[prep|summarize] <topic or transcript>"
---

# /interview -- Customer Interview Prep & Summary

Router for the two phases of interviewing: **prep** before you talk to customers, **summarize** after. Delegates to the matching skill.

## Invocation

```
/interview prep Onboarding experience for enterprise users
/interview summarize [paste transcript or upload file]
/interview                    # asks which mode you need
```

## Workflow

### Step 1: Determine Mode

Parse the first argument. If missing, ask: "Do you want to **prep** a script or **summarize** a transcript?"

### Step 2: Delegate to Skill

**Prep mode** — apply the **interview-script** skill.
Collect: research question, target participant, time slot, decisions this will inform. The skill handles Mom-Test-compliant question design, warm-up/core/wrap-up structure, annotations, and note-taking templates.

**Summarize mode** — apply the **summarize-interview** skill.
Accept the transcript (pasted or uploaded). The skill extracts participant profile, JTBD, workflow, pain points, satisfaction signals, quotes, surprises, and feature reactions.

### Step 3: Offer Next Steps

After **prep**:
- "Want me to **add probing questions** for specific hypotheses?"
- "Should I **save a printable version** to your workspace?"

After **summarize**:
- "Want me to **compare this with other interview summaries**?"
- "Should I **update assumptions** based on what this participant said?"
- "Want me to **extract personas** across multiple interviews?" (chains to research-users)

## Notes

- **Prep**: always include "why you're asking" annotations — they help the interviewer stay on track
- **Summarize**: distinguish between what the participant *said* vs. *did* (behavioral > stated)
- Flag contradictions within the same interview (says one thing, describes doing another)
- Capture competitive intelligence if competitors come up in the conversation
- For summarize mode with multiple transcripts, synthesize cross-participant patterns
