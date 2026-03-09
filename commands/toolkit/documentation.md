---
description: Write, edit, or update product and feature documentation — technical docs, reference guides, meeting notes, or general notes
argument-hint: "<topic or feature to document>"
---

# /documentation -- Documentation Writer

Write, edit, or update clear, accurate documentation that matches its audience and purpose. Accepts topics, feature names, code references, or uploaded materials.

## Invocation

```
/documentation API authentication flow
/documentation onboarding process for new users
/documentation [upload a draft, code file, or feature plan to document]
```

## Workflow

### Step 1: Accept the Input

Accept in any form:
- A topic or feature name ("API authentication flow")
- A code file or set of files to document
- An existing draft to edit or improve
- A feature plan that needs documentation written
- An uploaded document (brief, spec, or rough notes)

If the input is vague, ask up to 2 clarifying questions. Otherwise infer sensible defaults.

### Step 2: Gather Context

Apply the **documentation** skill:

Before writing, determine:
- **Purpose**: What is this document for?
- **Audience**: Engineers, end-users, stakeholders, new hires?
- **Tone**: Formal, casual, or technical?
- **Length**: Brief overview or comprehensive guide?
- **Format**: Prose, lists, tables, or mixed?

If documenting code, scan the codebase thoroughly. If a feature plan exists, compare code against plan and flag any discrepancies before proceeding.

### Step 3: Generate the Document

Choose the structure that fits the document type:

**Technical Document**:
```
## [Feature / Topic Name]

### Overview
[What this is and why it matters]

### Prerequisites
[What the reader needs before starting — tools, access, knowledge]

### How It Works
[Step-by-step explanation or architecture description]

### Examples
[Concrete usage examples with code snippets or screenshots]

### Troubleshooting
| Problem | Cause | Solution |
|---------|-------|----------|

### Related Resources
- [Links to relevant docs, code, or tools]
```

**General / Product Document**:
```
## [Document Title]

### Overview
[What this document covers and who it's for]

### [Main Content Sections]
[Organized by topic, feature, or workflow]

### Summary
[Key takeaways]
```

**Reference Document**:
```
## [Reference Title]

### Quick Summary
[One-paragraph overview]

### [Detailed Sections]
[Organized for lookup — alphabetical, by category, or by workflow]

### Index
[Navigation aids if the document is long]
```

Save as markdown using kebab-case naming: `api-integration-guide.md`, `onboarding-process.md`.

### Step 4: Offer Follow-ups

- "Want me to **add more examples** or code snippets?"
- "Should I **split this into multiple docs** (e.g., quickstart + full reference)?"
- "Want me to **proofread** the document for grammar and flow?"
- "Should I **check this against the code** one more time for accuracy?"

## Notes

- Accuracy is paramount — never guess at technical behavior; verify against the code
- If the code and plan don't match, flag the discrepancy before writing
- Lead with the most important information — don't bury the key insight
- Use headings, checklists, and short paragraphs to keep the document scannable
- For meeting-oriented or decision-oriented documents, always include **Decisions**, **Action items** (with owner + due date), and **Open questions**
- Show, don't tell — include examples wherever they help understanding
