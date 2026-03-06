---
description: Draft a complete blog post from a short brief — clear, engaging, and lightly SEO-optimized
argument-hint: "<topic or short brief>"
---

# /write-blog -- Blog Post Writer

Turn a topic and a few notes into a full, structured blog post that people actually read and share.

## Invocation

```
/write-blog How AI is changing product management
/write-blog Announce our new analytics feature for power users
/write-blog [upload a brief, outline, or product update doc]
/write-blog                                     # asks for topic and details
```

## Workflow

### Step 1: Collect the Brief

Accept input in any form:
- A short topic or working title
- A few bullet points or notes
- A product / feature update
- A rough draft, outline, or internal doc (uploaded)

If the input is very short, ask follow-up questions to fill the core fields:
- Topic / working title
- Purpose (announce, thought leadership, educational, company update, customer story)
- Audience (who, what they care about, technical level)
- Angle (unique point of view or hook)
- Target length (short, medium, long)
- Any SEO keywords, if relevant

### Step 2: Map to Skill Inputs

Normalize the brief into the following arguments for the **write-blog-post** skill:

- `$TOPIC`: The main topic or working title inferred from the invocation and follow-ups
- `$PURPOSE`: One of:
  - Announce product/feature
  - Thought leadership/opinion
  - Educational/how-to
  - Company update
  - Customer story
- `$AUDIENCE`: Who is reading, what they care about, and their technical level
- `$ANGLE`: The unique take, hook, or key idea
- `$TARGET_LENGTH`: Short (500–800 words), Medium (800–1500 words), or Long (1500–3000 words)
- `$SEO_KEYWORDS`: Optional list of terms to rank for
- `$TONE_VOICE`: Desired tone (e.g., conversational, expert but friendly, formal, playful)
- `$NOTES`: Any additional notes, examples, or source material from the user
- `$PRODUCT_CONTEXT`: If this is about a product/feature, basic context about it

Fill any missing fields with sensible defaults based on the brief (e.g., default to "conversational" tone and "medium" length).

### Step 3: Generate the Blog Post

Apply the **write-blog-post** skill with the mapped arguments to create a full draft:

```
## Blog Post

[Structured post with headline, intro, sections, conclusion, and CTA, tailored to the brief and audience.]

## SEO & Publishing Details

[Meta description, suggested images, internal link ideas, and notes from the brief.]
```

### Step 4: Offer Refinements

After generating the draft, offer:
- "Want me to **tighten or expand** any section (intro, body, or conclusion)?"
- "Should I **adjust the tone** (more formal, more casual, more punchy)?"
- "Want me to **shorten this for LinkedIn** or **turn it into a tweet thread**?"
- "Should I **run a proofread** using the `/proofread` command?"

Save the blog post as a markdown file in the user's workspace, named based on the topic (e.g., `blog-how-ai-is-changing-product-management.md`).

## Notes

- Prioritize clarity and reader value over clever phrasing
- Make the post scannable with headings, short paragraphs, and bullets
- Keep SEO lightweight — never stuff keywords or harm readability
- Prefer concrete examples and specific outcomes over vague claims