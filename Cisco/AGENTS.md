# Cisco Compute context and rules

Publication note: This tracked file is a public-source example for scoped enterprise context. It is not official Cisco guidance, an internal source of truth, a roadmap, an approval record, or a statement of product availability. Private Cisco work belongs outside the public Core.

Use this file as the first portfolio and vocabulary reference for work under `Cisco/**`. The root `AGENTS.md` still applies. This file adds Cisco-specific guidance because Codex loads nested instruction files from the repository root down to the working directory.

## Scope

- Cisco projects live under `Cisco/<project>/`.
- Read only the project and knowledge files needed for the task.
- Keep live project material private and ignored by Git.
- Use the current project index as the local source of truth for ownership, status, and deliverables.

## Project shape

Each project uses:

- `Cisco/<project>/index.md`
- `Cisco/<project>/meetings/`
- `Cisco/<project>/playbooks/`
- `Cisco/<project>/examples/`
- `Cisco/<project>/slides/`
- `Cisco/<project>/process/`
- `Cisco/<project>/files/`
- `Cisco/<project>/glossary.md`, when useful

Use scannable headings, checklists, a clear audience, and a stated intended use. Meeting and decision records must include Decisions, Action items with owner and due date when known, and Open questions.

## Claim controls

- Do not invent Cisco claims, SKUs, product status, partner status, orderability, dates, owners, or URLs.
- Ground statements in this file, current project files, user-provided material, or current official sources.
- Separate shipping and public offers from qualification, certification, active development, roadmap work, and proposals.
- Product specifications, accelerator support, lifecycle state, management options, and solution status change. Verify current public data sheets before customer or external use.
- Preserve uncertainty when a source does not establish a fact.

## Cisco Compute overview

Cisco Compute covers servers, system connectivity, management, and solution packaging for data-center and edge workloads. Cisco Unified Computing System brings compute, networking, and management constructs together, while Cisco Intersight provides policy-based infrastructure operations across supported platforms.

For this workspace, the main areas are:

- Cisco UCS X-Series Modular System
- Cisco UCS C-Series Rack Servers
- Cisco UCS blade platforms where still relevant to the source material
- Fabric Interconnects and Fabric Extenders
- Cisco Intersight
- GPU-capable server configurations and AI infrastructure solutions
- Cisco Validated Designs and partner solution work

## Portfolio map

### UCS X-Series Modular System

- A chassis-based modular system for compute and expansion resources.
- Use when lifecycle flexibility, shared infrastructure, and modular expansion are important.
- Check the current data sheet for supported nodes, adapters, and accelerators.

### UCS C-Series Rack Servers

- Rack servers with combinations of CPU, memory, I/O, storage, and supported accelerators.
- Use for general-purpose, storage-rich, virtualization, database, edge aggregation, and accelerated workloads without a modular chassis.
- Check the current model data sheet before carrying specifications into a new plan.

### UCS blade platforms

- Blade systems use a chassis operating model and shared fabric connectivity.
- Historical records may reference blade products or roadmap work that is no longer current.
- Verify lifecycle and orderability before using blade claims in active collateral.

### Fabric Interconnects and Fabric Extenders

- Provide connectivity and participate in supported UCS management-domain designs.
- Use current architecture documentation for compatibility and topology claims.

### Cisco Intersight

Cisco Intersight is the common operations layer for supported Cisco infrastructure. Relevant themes include:

- Policy-based provisioning and lifecycle operations
- Fleet visibility and monitoring
- Automation and API integrations
- Operations across data-center and edge locations
- Available SaaS and appliance deployment options

Verify the current offer before making connectivity, isolation, or air-gap claims.

## AI solution framing

Cisco AI infrastructure can combine supported UCS compute, networking, management, security, AI software, and partner data platforms. Engagements can represent different maturity levels, including qualification, certification, integration, validated design, solution packaging, and co-sell work.

Do not imply that every named component is generally available, orderable, or part of every solution. State the exact readiness level supported by the current source.

## Questions to ask stakeholders

- Workload: training, fine-tuning, retrieval, inference, virtualization, storage, or general-purpose compute?
- Location: data center, colocation, sovereign environment, branch, factory, retail site, healthcare site, or another edge location?
- Compute model: modular, rack, blade, dense GPU, flexible PCIe GPU, or edge-optimized?
- Accelerator: which vendor, class, density, power, cooling, and software requirements apply?
- Data platform: what capacity, throughput, protocol, protection, and mobility requirements apply?
- Platform software: Kubernetes, Red Hat OpenShift, virtualization, hyperconverged infrastructure, or another operating environment?
- Operations: what automation, observability, security, connectivity, and change-control model is required?
- Solution maturity: shipping product, orderable solution, public validated design, active qualification, or roadmap work?

## Glossary

- UCS: Cisco Unified Computing System, covering Cisco compute platforms and their connectivity and management constructs.
- Fabric Interconnect: A UCS component that provides connectivity and participates in the UCS management-domain model.
- Fabric Extender: A component that extends fabric connectivity within supported designs.
- Cisco Intersight: Cisco infrastructure operations and management platform for supported systems.
- Cisco Validated Design: A tested and documented system or solution architecture.
- AI server: A supported compute configuration for accelerated workloads, including the required network, software, power, and cooling design.
- Solution partner: A vendor whose technology may be qualified, integrated, validated, packaged, or taken to market with Cisco. State the exact engagement and readiness level.

## Public sources

- Cisco Computing Infrastructure and Operations: `https://www.cisco.com/site/us/en/products/computing/index.html`
- Cisco UCS: `https://www.cisco.com/site/us/en/products/computing/servers-unified-computing-systems/index.html`
- Cisco UCS X-Series Modular System: `https://www.cisco.com/site/us/en/products/computing/servers-unified-computing-systems/ucs-x-series-modular-systems/index.html`
- Cisco UCS C-Series Rack Servers: `https://www.cisco.com/site/us/en/products/computing/servers-unified-computing-systems/ucs-c-series-rack-servers/index.html`
- Fabric Interconnects and Fabric Extenders: `https://www.cisco.com/c/en/us/products/servers-unified-computing/fabric-interconnects.html`
- Cisco Intersight: `https://www.cisco.com/site/us/en/products/computing/hybrid-cloud-operations/intersight-platform/index.html`

## Decisions

For a choice that affects more than one Cisco project, create `decisions/YYYY-MM-DD-<topic>.md` from `decisions/_template.md`. Search existing decisions before changing an established pattern.
