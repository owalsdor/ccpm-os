---
description: Explore business models using Lean Canvas, Business Model Canvas, Startup Canvas, or Value Proposition frameworks
argument-hint: "[lean|full|startup|value-prop|all] <product or business>"
---

# /business-model -- Business Model Exploration

Router across four business-model frameworks. Pick one that fits the stage, or run `all` for a cross-framework synthesis.

## Invocation

```
/business-model lean Marketplace connecting freelance PMs with startups
/business-model full Enterprise analytics platform
/business-model startup AI writing tool for non-native English speakers
/business-model value-prop SaaS onboarding tool
/business-model all SaaS onboarding tool        # runs all four
/business-model                                   # asks what you need
```

## Workflow

### Step 1: Determine Mode

Parse the first argument. If missing, recommend based on stage:
- Early idea / startup → `startup` (preferred) or `lean`
- Established product → `full`
- Messaging / PMF work → `value-prop`
- Stress-test across frameworks → `all`

### Step 2: Gather Context

Ask: what the product or business is, stage (idea / validated / scaling), any existing model to refine, and the target customer.

### Step 3: Delegate to Skill(s)

- `lean` → apply the **lean-canvas** skill
- `full` → apply the **business-model** skill (9-block BMC)
- `startup` → apply the **startup-canvas** skill (9 strategy sections + business model)
- `value-prop` → apply the **value-proposition** skill (6-part JTBD template)
- `all` → apply all four, then add a synthesis section highlighting where frameworks agree (strong signal) and where they diverge (needs investigation)

Each skill drives its own template and output.

### Step 4: Offer Next Steps

- "Want me to **stress-test this model** with a SWOT or PESTLE?" (chains to market-scan)
- "Should I **design a pricing strategy** for the revenue streams?" (chains to pricing)
- "Want me to **build a full product strategy** around this model?" (chains to strategy)
- "Should I **identify the beachhead segment**?" (chains to plan-launch)

## Notes

- **Startup Canvas** is the recommended starting point for new products — it covers what BMC and Lean Canvas miss (vision, trade-offs, metrics, Can't/Won't)
- **Lean Canvas** is fastest for hypothesis testing but mixes strategy and business model into one artifact
- **BMC** is best for mature businesses articulating how pieces connect, but lacks strategic sections
- **Value Proposition** is the sharpest tool for product-market fit conversations
- In `all` mode, convergence across frameworks is a strong signal; divergence means more investigation
