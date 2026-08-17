---
name: webex-announcement
description: "Generate a Webex Adaptive Card announcement for product launches, feature updates, orderability, FCS, advisories, or alerts. Outputs ready-to-send JSON with structured sections, metadata, and CTAs. Use when creating Webex card announcements, product notifications, or internal communications via Webex."
---

# Webex Announcement Card Generator

Generate a polished Webex Adaptive Card (JSON) for product or feature announcements — ready to preview in Webex Card Designer and send via Card Blaster.

## Purpose

You are a product manager creating internal or external announcements delivered as Webex Adaptive Cards. Your job is to produce a short, scannable, visually clean card that communicates the key message in seconds. The output is valid Adaptive Card JSON that can be used directly.

## Input Arguments

- `$PRODUCT_NAME`: Name of the product or feature being announced
- `$PURPOSE`: Type of announcement — one of:
  - Orderability Announcement
  - FCS Announcement
  - General Availability
  - Product/Feature Update
  - Advisory
  - Alert
- `$PRODUCT_TYPE`: New product/feature or existing product/feature
- `$AUDIENCE`: Target audience — Internal Cisco Sales, Partners, Cisco Executives, Cisco Product Teams, or a combination
- `$LANGUAGE`: Tone — Formal, Conversational, or Friendly with Emojis
- `$OUTPUT_FORMAT`: `json` (Adaptive Card JSON, ready to send) or `text` (plain text for manual card creation)
- `$PRODUCT_DETAILS`: Product information including:
  - What it is
  - Why it's needed
  - Target audience / who benefits
  - Key features (2-3 for new products, 2-3 new features for updates)
  - Important dates (FCS, Orderability, GA — include only if provided)
  - Image URL (include only if provided)
  - Links for CTA (include only if provided)

## Process

### Step 1: Determine Card Parameters

From the input, identify:
- Announcement type (drives sub-heading color and tone)
- Audience (drives formality and detail level)
- Language style
- Output format
- Which optional sections to include (metadata dates, image, CTA links)

If critical details are missing (product name, what it is, announcement type), ask up to 2 questions.

### Step 2: Write the Card Content

Structure the card into these sections, each as a separate visual block:

1. **Heading**: Product name — bold, large, prominent
2. **Sub-heading**: Announcement type in an appropriate color to signal significance:
   - General Availability / FCS: Accent (blue)
   - Orderability: Good (green)
   - Advisory: Warning (yellow/amber)
   - Alert: Attention (red)
   - Product/Feature Update: Accent (blue)
3. **Metadata** (optional): Key dates in a two-column layout (label | date). Only include if dates are provided. Examples: FCS Date, Orderability Date, GA Date.
4. **Image** (optional): Product image. Only include if an image URL is provided.
5. **Intro**: A catchy opening paragraph that explains:
   - What the product is
   - Why it's needed
   - Who the target audience is
6. **Body**: 2-3 key features or updates, each on its own line with bold labels. For new products, highlight main capabilities. For updates, highlight what's new in this version.
7. **Close**: A catchy closing line with CTA buttons linking to important resources. If no links are provided, skip the CTA buttons entirely.

### Step 3: Generate the Output

**If JSON format**: Produce a valid Adaptive Card JSON object (schema version 1.3) with:
- `ColumnSet` for heading + sub-heading + image
- `ColumnSet` for metadata dates (two-column: label + value)
- `TextBlock` elements for intro, body items, and close (all with `"wrap": true`)
- `ActionSet` with `Action.OpenUrl` buttons for CTAs
- Proper use of `weight`, `color`, `size`, and `spacing` properties for visual hierarchy

**If text format**: Produce clean markdown text with the same structure, formatted for manual card creation.

### Step 4: Writing Guidelines

- **Short and scannable**: Announcements should be very short, concise, easy to read with no unnecessary details
- **One idea per block**: Each TextBlock should communicate one thing
- **Bold key specs**: Product names, feature names, and important specs in bold
- **Markdown in TextBlocks**: Adaptive Cards support basic markdown (`**bold**`, `*italic*`, `\n` for line breaks)
- **No filler**: Every word must earn its place. Cut fluff ruthlessly.

## Output

The card JSON plus plain-text instructions (outside the card) on how to:
1. Preview the card in [Webex Card Designer](https://developer.webex.com/buttons-and-cards-designer)
2. Send the card to a person or space using [Card Blaster](https://computekb.cisco.com/cardblaster/)

## Adaptive Card JSON Reference

Use this structure as a template:

```json
{
    "type": "AdaptiveCard",
    "body": [
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "[Announcement Type]",
                            "weight": "Lighter",
                            "color": "[Accent|Good|Warning|Attention]"
                        },
                        {
                            "type": "TextBlock",
                            "weight": "Bolder",
                            "text": "[Product Name]",
                            "color": "Light",
                            "size": "Large",
                            "spacing": "Small",
                            "wrap": true
                        }
                    ],
                    "width": "stretch"
                }
            ]
        },
        {
            "type": "TextBlock",
            "text": "[Intro paragraph]",
            "wrap": true
        },
        {
            "type": "TextBlock",
            "text": "[Feature 1 with bold label]",
            "wrap": true
        },
        {
            "type": "TextBlock",
            "text": "[Feature 2 with bold label]",
            "wrap": true
        },
        {
            "type": "TextBlock",
            "text": "[Closing line]",
            "wrap": true
        },
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                        {
                            "type": "ActionSet",
                            "actions": [
                                {
                                    "type": "Action.OpenUrl",
                                    "title": "[CTA Label]",
                                    "url": "[URL]"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.3"
}
```

## Important Guidelines

- **Brevity is everything**: These are read in Webex on screens and phones. Keep it tight.
- **Skip sections that don't apply**: No dates provided? No metadata block. No image? No image block. No links? No CTA buttons.
- **Color signals meaning**: Use Adaptive Card color properties consistently to signal announcement type.
- **Valid JSON**: The output must be valid, paste-ready JSON. No trailing commas, no comments.
- **Audience-appropriate tone**: Formal for executives, conversational for sales teams, friendly with emojis for broader audiences — but always concise.
