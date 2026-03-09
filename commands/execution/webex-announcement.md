---
description: Generate a Webex Adaptive Card announcement (JSON) for product launches, updates, orderability, FCS, advisories, or alerts
argument-hint: "<product name and announcement details>"
---

# /webex-announcement -- Webex Card Announcement

Generate a polished Webex Adaptive Card for product or feature announcements. Outputs ready-to-send JSON with heading, metadata, features, and CTAs.

## Invocation

```
/webex-announcement UCS X410c M8 — orderability announcement for internal sales, formal tone
/webex-announcement Solution Catalog — GA announcement for executives, include link to catalog
/webex-announcement [describe the product, announcement type, audience, and any links/dates]
```

## Workflow

### Step 1: Gather Announcement Details

Collect or infer from the user's input:

- **Product name**: What's being announced
- **Announcement type**: Orderability, FCS, General Availability, Product/Feature Update, Advisory, or Alert
- **Product type**: New product/feature or existing product/feature update
- **Audience**: Internal Sales, Partners, Executives, Product Teams
- **Tone**: Formal, Conversational, or Friendly with Emojis
- **Output format**: JSON (default — ready to send) or plain text
- **Product details**:
  - What it is and why it's needed
  - 2-3 key features or updates
  - Important dates (FCS, Orderability, GA — only if provided)
  - Image URL (only if provided)
  - CTA links (only if provided)

If critical details are missing (product name, what it is, announcement type), ask up to 2 questions.

### Step 2: Build the Card

Apply the **webex-announcement** skill:

Structure the card with these sections (skip any that don't apply):

1. **Heading**: Product name (bold, large)
2. **Sub-heading**: Announcement type in color-coded text:
   - GA / FCS: Accent (blue)
   - Orderability: Good (green)
   - Advisory: Warning (amber)
   - Alert: Attention (red)
3. **Metadata**: Key dates in two-column layout (only if dates provided)
4. **Image**: Product image (only if URL provided)
5. **Intro**: Catchy opening — what it is, why it's needed, who it's for
6. **Body**: 2-3 features/updates, each on its own line with bold labels
7. **Close**: Catchy closing with CTA buttons (only if links provided)

### Step 3: Deliver the Output

**JSON output** (default): Valid Adaptive Card JSON (schema 1.3), paste-ready for Webex.

```json
{
    "type": "AdaptiveCard",
    "body": [
        { "type": "ColumnSet", "columns": [{ "type": "Column", "items": [
            { "type": "TextBlock", "text": "[Announcement Type]", "weight": "Lighter", "color": "[color]" },
            { "type": "TextBlock", "text": "[Product Name]", "weight": "Bolder", "size": "Large", "color": "Light", "wrap": true }
        ], "width": "stretch" }] },
        { "type": "TextBlock", "text": "[Intro]", "wrap": true },
        { "type": "TextBlock", "text": "**[Feature 1]**: [Description]", "wrap": true },
        { "type": "TextBlock", "text": "**[Feature 2]**: [Description]", "wrap": true },
        { "type": "TextBlock", "text": "[Closing line]", "wrap": true },
        { "type": "ColumnSet", "columns": [{ "type": "Column", "width": "stretch", "items": [
            { "type": "ActionSet", "actions": [{ "type": "Action.OpenUrl", "title": "[CTA]", "url": "[URL]" }] }
        ] }] }
    ],
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.3"
}
```

Below the JSON, include plain-text instructions:
1. Preview the card in [Webex Card Designer](https://developer.webex.com/buttons-and-cards-designer)
2. Send the card using [Card Blaster](https://computekb.cisco.com/cardblaster/)

### Step 4: Offer Follow-ups

- "Want me to **adjust the tone** (more formal, add emojis, shorter)?"
- "Should I **create a version for a different audience** (sales vs. executives)?"
- "Want me to **add or remove sections** (dates, image, CTAs)?"
- "Should I **generate a plain-text version** for email or Slack instead?"

## Notes

- Brevity is everything — these are read on screens and phones in Webex; every word must earn its place
- Skip sections that don't apply — no dates means no metadata block, no image means no image block, no links means no CTAs
- Color signals meaning — use Adaptive Card color properties consistently to match announcement type
- Output must be valid, paste-ready JSON — no trailing commas, no comments, no placeholders
- Formal tone for executives, conversational for sales teams, emojis only when the user requests them
- Bold key specs — product names, feature names, and important values should use `**bold**` markdown in TextBlocks
