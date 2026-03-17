---
description: Use the Webex MCP pending follow-up data and return actionable follow-up lists
argument-hint: "<optional extra context>"
---

# /webex-ai-followups -- Webex AI Follow Ups

Use the Webex MCP pending follow-up data and return actionable follow-up lists.

If the user provided extra text after the command, treat it as additional context.

## Invocation

```
/webex-ai-followups
/webex-ai-followups [optional context about what to focus on]
```

## Workflow

### Step 1: Read MCP Tool Schema

Read the MCP tool schema for `user-webex` before calling any tools.

### Step 2: Fetch Pending Follow-ups

Call `webex_get_pending_followups`.

### Step 3: Analyze Recent Direct-Message Spaces

Review recent DM spaces and classify each thread using message-direction logic:

**Classification rules:**
- `Needs your reply`: The other person has asked a question or requested information and is waiting on the user.
- `Waiting on them`: The user asked for information/action and the other person has not provided it yet.
- Do not infer self-DM from room title. A DM with my own display name may still be another person — include it using message-direction logic only.
- Exclude clearly closed threads (thanks/ack only) and FYI-only threads.

### Step 4: Return Follow-up Lists

Return exactly two sections:

```
Needs your reply
- <Space name>: <why this needs your response>
  - Suggested reply: <short response> OR Need more context to craft a message.

Waiting on them
- <Space name>: <what you are still waiting for>
  - Suggested nudge: <short response> OR Need more context to craft a message.
```

## Drafting Rules

- Keep suggestions short (1-2 sentences).
- If uncertain, do not guess. Write: `Need more context to craft a message.`
- Do not invent facts not present in the thread.
