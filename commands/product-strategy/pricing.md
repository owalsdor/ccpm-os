---
description: Design a pricing strategy — models, competitive analysis, willingness-to-pay, and pricing experiments
argument-hint: "<product or pricing question>"
---

# /pricing -- Pricing Strategy Design

Orchestrates a pricing strategy by chaining two skills: **pricing-strategy** (models, competitive analysis, WTP, experiments) and **monetization-strategy** (revenue model alternatives and trade-offs).

## Invocation

```
/pricing SaaS project management tool moving from free to paid
/pricing Should we switch from per-seat to usage-based pricing?
/pricing [upload competitor pricing pages or current pricing data]
```

## Workflow

### Step 1: Understand the Pricing Context

Ask:
- What is the product and what value does it deliver?
- Current pricing (if any): model, price points, packaging
- What's the trigger? (new product, pricing change, competitive pressure, growth stall)
- Target customer and budget context
- Constraints? (contractual obligations, market expectations, positioning)

### Step 2: Chain the Skills

1. **pricing-strategy** — evaluate applicable pricing models (flat, per-seat, usage, tiered, freemium, hybrid), benchmark against 3–5 competitors via web research, estimate willingness to pay (Van Westendorp if data exists, otherwise value-based estimation plus a survey design), and recommend a structure with tiers and free/trial strategy.
2. **monetization-strategy** — produce 3–5 alternative revenue models with audience fit, risks, and validation experiments to stress-test the recommended model.

Let each skill drive its own output. Combine into a single pricing-strategy artifact with: recommended model, tier structure, competitive benchmark, revenue projections (conservative / expected / optimistic), migration plan (if changing), pricing experiments, risks, and key metrics to track.

### Step 3: Offer Next Steps

- "Want me to **run a market scan** to validate pricing assumptions?" (chains to market-scan)
- "Should I **draft customer communication** for the pricing change?"
- "Want me to **design the A/B test** for pricing experiments?"
- "Should I **build a product strategy** that anchors this pricing?" (chains to strategy)

## Notes

- Pricing is the most powerful lever for revenue — a 1% improvement typically has 3–4x the impact of a 1% improvement in acquisition
- Value-based pricing always beats cost-plus — start from customer value, not your costs
- The best pricing is simple to understand and predictable for the customer
- Freemium only works if free users generate value (network effects, word of mouth, marketplace liquidity)
- Always design a migration path for existing customers — pricing changes that alienate your base destroy trust
