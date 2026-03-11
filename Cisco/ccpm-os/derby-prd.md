# Product Requirements Document: UCS X-Series M9 Compute Node (Derby)

**Author**: Product Management — Cisco Compute  
**Date**: March 11, 2026  
**Status**: Draft  
**Code Name**: Derby  
**Stakeholders**: Compute PM, Compute Engineering, Intersight PM, Systems Engineering, Sales/CX

---

## 1. Executive Summary

Derby is the next-generation UCS X-Series compute node (M9) featuring a single-socket architecture that replaces the current dual-socket design. Intel's upcoming CPU platform delivers core counts in a single socket that match or exceed today's dual-socket configurations, making dual-socket over-engineered and cost-inefficient for the majority of enterprise workloads. Derby rides this architectural inflection to deliver equivalent — or better — compute capacity at lower cost, lower power, and higher density within the X-Series modular system.

**Target availability**: Q1 CY2028 (FCS / GA).

---

## 2. Background & Context

### Industry inflection: the end of dual-socket dominance

For over a decade, enterprise servers required two CPU sockets to deliver the core counts, memory bandwidth, and I/O capacity that production workloads demanded. Intel's next-generation CPU architecture fundamentally changes this equation by delivering high core counts within a single socket — effectively collapsing what previously required two CPUs into one.

This is not a niche shift. It affects the entire server industry:

- **Per-socket software licensing** (VMware, Oracle, SQL Server, RHEL, etc.) is a massive cost driver. Cutting from two sockets to one can reduce licensing costs by up to 50%.
- **Power and cooling** scale with socket count. Single socket reduces thermal design power (TDP) budgets, enabling higher density or lower operating costs.
- **System complexity** drops — fewer interconnects, simpler memory topologies, fewer failure domains.

### Cisco X-Series context

The UCS X-Series modular system (X9508 chassis, compute nodes, PCIe nodes) is Cisco's flagship compute platform, managed via Cisco Intersight. Current compute nodes (M7/M8 generation) use dual-socket architectures. Derby (M9) is the first X-Series compute node purpose-built for Intel's single-socket, high-core-count architecture — aligning the platform with where the industry is headed.

The Bremerton chassis (redesigned power supplies for full blade population in grid mode) provides an upgraded chassis foundation that Derby can leverage.

---

## 3. Objectives & Success Metrics

### Goals

1. **Deliver a single-socket X-Series compute node** that provides equivalent or better compute capacity vs. current dual-socket M7/M8 nodes — at lower total cost of ownership.
2. **Maintain full X-Series system compatibility** — Derby fits the existing X9508 (and Bremerton) chassis, connects via existing Fabric Interconnects, and is managed day-0 through day-N via Cisco Intersight.
3. **Ship on time for Intel platform launch** — Q1 CY2028 FCS/GA, aligned with Intel CPU availability and competitive server launches.
4. **Preserve or extend Cisco's generational CPU advantage** over competitive modular/blade platforms (HPE Synergy, Dell MX7000).

### Non-Goals

1. **Not a rack server (C-Series) product** — Derby is scoped to the X-Series modular form factor. Single-socket rack servers may follow but are separate programs.
2. **Not an AMD platform** — Derby targets Intel's next-gen architecture. AMD-based single-socket variants are out of scope for this PRD.
3. **Not a GPU/AI-first compute node** — Derby targets mainstream enterprise workloads. AI/GPU-dense configurations are handled by dedicated PCIe nodes and purpose-built platforms.

### Success Metrics

| Metric | Current (Dual-Socket M8) | Target (Derby M9) | Measurement |
|--------|--------------------------|-------------------|-------------|
| Core count parity | Baseline (2-socket) | >= 100% of dual-socket core count in single socket | Spec comparison at launch |
| Per-socket software licensing cost | 2x socket licenses | 1x socket license (up to 50% reduction) | Customer TCO model |
| System power per equivalent core count | Baseline | >= 15% reduction | Lab power measurement |
| Time to FCS | — | Q1 CY2028 | Program milestone |
| Intersight management parity | Full lifecycle management | Full lifecycle management (day-0 to day-N) | Feature parity checklist |
| Chassis compatibility | X9508 + Bremerton | X9508 + Bremerton | Qualification matrix |

---

## 4. Target Users & Segments

### Primary: Enterprise IT infrastructure managers

Same core audience as the broader X-Series platform:

- **Role**: Data center compute strategy, capacity planning, server lifecycle management, uptime SLAs.
- **Environment**: Enterprise data centers running Cisco UCS X-Series at scale — typically 50+ chassis deployments.
- **Key concern**: Maximize compute capacity per dollar, per watt, and per rack unit while maintaining operational consistency.

### Secondary: IT financial decision-makers (CIO / VP Infrastructure)

- **Role**: Budget owners evaluating refresh cycles and TCO.
- **Key concern**: Single-socket directly impacts their biggest cost line items — CPU procurement and per-socket software licensing.

### Segment sizing

Derby targets the same addressable market as the current X-Series compute nodes. The single-socket value proposition strengthens the case for customers evaluating refresh cycles in the CY2028+ timeframe, and provides a compelling competitive alternative for HPE and Dell modular customers.

---

## 5. User Stories & Requirements

### P0 — Must Have

| # | User Story | Acceptance Criteria |
|---|-----------|-------------------|
| 1 | As an IT infrastructure manager, I need a single-socket compute node that delivers core counts equivalent to today's dual-socket nodes, so I can reduce CPU procurement and licensing costs without sacrificing workload capacity. | Core count >= current dual-socket M8 node; validated with reference workloads. |
| 2 | As an IT infrastructure manager, I need Derby to fit the existing X9508 and Bremerton chassis without requiring new chassis hardware, so I can upgrade compute nodes without forklift infrastructure changes. | Mechanical, electrical, and thermal compatibility confirmed with X9508 and Bremerton chassis. |
| 3 | As an IT operations engineer, I need to manage Derby through Cisco Intersight with the same policy-based workflows I use for current X-Series nodes, so I don't have to retool my operational processes. | Intersight support at FCS: discovery, firmware management, server profiles, policies, monitoring, alerting. |
| 4 | As an IT infrastructure manager, I need Derby to support the latest Intel CPU platform at launch, so I have access to the newest performance, security, and efficiency features. | Intel next-gen CPU qualified and supported at FCS. |
| 5 | As an IT infrastructure manager, I need Derby to support enterprise-class memory capacity and bandwidth in a single-socket configuration, so memory-intensive workloads are not constrained. | Memory capacity and channel count documented; meets or exceeds workload requirements for target use cases. |
| 6 | As an IT operations engineer, I need Derby to integrate with existing UCS Fabric Interconnects, so the networking and management domain architecture does not change. | FI compatibility validated; no new FI hardware required. |

### P1 — Should Have

| # | User Story | Acceptance Criteria |
|---|-----------|-------------------|
| 7 | As an IT infrastructure manager, I need a TCO comparison tool or reference architecture that quantifies the licensing and power savings of single-socket Derby vs. dual-socket M8, so I can build the business case for refresh. | TCO comparison document / calculator available at or near FCS. |
| 8 | As an IT infrastructure manager, I need Derby to support PCIe node connectivity for GPU/accelerator expansion, so I can extend compute capacity for emerging workloads. | PCIe node compatibility validated (existing X-Series PCIe nodes). |
| 9 | As a Cisco sales engineer, I need a clear migration guide from dual-socket M7/M8 to single-socket M9, so I can position Derby as an upgrade path for existing customers. | Migration guide published; addresses server profile portability, firmware, and operational changes. |

### P2 — Nice to Have / Future

| # | User Story | Acceptance Criteria |
|---|-----------|-------------------|
| 10 | As an IT infrastructure manager, I want Derby to support advanced power management features that further reduce operating costs in large-scale deployments. | Power capping, power policies, and telemetry available through Intersight. |
| 11 | As a cloud architect, I want validated reference designs for Derby with common hypervisors and container platforms, so I can accelerate deployment. | Reference architectures for VMware vSphere, Red Hat OpenShift, and/or Kubernetes published post-GA. |

---

## 6. Solution Overview

### Architecture

Derby is a single-socket UCS X-Series compute node (M9 generation) designed around Intel's next-generation high-core-count CPU architecture:

- **Single CPU socket** replacing the current dual-socket layout — Intel's new platform delivers the core counts, memory channels, and I/O lanes that previously required two sockets.
- **X-Series form factor** — same physical slot dimensions as current compute nodes, compatible with X9508 and Bremerton chassis.
- **Fabric Interconnect connectivity** — standard X-Series mezzanine/IFM architecture; no changes to FI or network domain.
- **Intersight-managed** — full lifecycle management through existing Intersight infrastructure; policy model extends to M9 with new CPU/platform-specific policies as needed.

### Key design decisions

| Decision | Rationale |
|----------|-----------|
| Single socket only (no dual-socket M9 variant in this program) | Intel's core count per socket eliminates the need for dual socket in the target workload profile. Simplifies engineering, manufacturing, and SKU management. |
| X9508 + Bremerton chassis compatibility required | Protects installed base investment; enables Cisco-to-Cisco upgrade path without forklift. |
| Intersight parity at FCS | Operational consistency is a top X-Series selling point — any gap erodes the platform value proposition. |
| Intel-only for Derby | Aligns with the Intel architectural inflection that drives the single-socket transition. AMD variant(s) can be evaluated as a follow-on program. |

### Technical dependencies

- Intel next-gen CPU platform silicon and documentation availability (engineering samples, PRQ timeline)
- Intersight platform team: M9 compute node support in SaaS and Virtual Appliance
- Chassis power/thermal validation with single-socket power profiles (coordinate with Bremerton program)
- Fabric Interconnect firmware: compatibility validation with M9 hardware

---

## 7. Open Questions

| # | Question | Owner | Deadline |
|---|----------|-------|----------|
| 1 | What is the exact Intel CPU SKU stack (core counts, TDP tiers, feature variants) Derby will support at FCS? | Engineering / Intel liaison | TBD — dependent on Intel NDA roadmap |
| 2 | Will the single-socket thermal profile allow higher density per chassis vs. dual-socket, or is the slot power envelope unchanged? | Mechanical / Thermal Engineering | TBD |
| 3 | Are there workloads where dual-socket memory bandwidth is a hard requirement that single-socket cannot meet? If so, how large is that segment and what is the mitigation? | Systems Engineering / PM | TBD |
| 4 | Does Derby require a new IFM (Intelligent Fabric Module) design, or can existing IFMs be reused? | Hardware Engineering | TBD |
| 5 | What is the Intersight release vehicle for M9 support — existing SaaS release train, or a new major release? | Intersight PM | TBD |
| 6 | How will per-socket licensing changes be communicated to customers — especially VMware (Broadcom) given their licensing model changes? | Product Marketing / Licensing | Pre-launch |
| 7 | Is there a competitive timeline pressure — when are HPE and Dell expected to ship single-socket modular/blade platforms on the same Intel architecture? | Competitive Intelligence | Ongoing |

---

## 8. Timeline & Phasing

### Phase 1: Derby FCS / GA — Q1 CY2028

| Milestone | Target | Notes |
|-----------|--------|-------|
| Intel engineering sample availability | TBD (Intel-dependent) | Drives lab bring-up and early validation |
| Hardware design complete (HDC) | TBD | Mechanical, electrical, thermal design frozen |
| Intersight M9 support — dev complete | TBD | Must align with FCS |
| Chassis compatibility qualification (X9508 + Bremerton) | TBD | Power, thermal, mechanical validation |
| FI firmware qualification | TBD | Compatibility with existing FI models |
| Customer beta / early field trial | TBD | Target 1–2 customers pre-FCS |
| FCS / GA | **Q1 CY2028** | First customer ship |

### Phase 2 (potential follow-on — not committed)

- AMD-based single-socket X-Series compute node (separate program evaluation)
- Advanced power/density optimization leveraging single-socket thermal headroom
- Validated designs / reference architectures for AI inference and containerized workloads

---

## Appendix: Competitive Landscape (Summary)

| Competitor | Current Modular/Blade Platform | Single-Socket Status | Cisco Advantage |
|------------|-------------------------------|---------------------|-----------------|
| HPE | Synergy | TBD — expected to follow Intel platform shift | X-Series generational CPU lead; Intersight operations model; Bremerton chassis density |
| Dell | PowerEdge MX7000 | TBD — expected to follow Intel platform shift | X-Series modularity (PCIe nodes, chassis flexibility); Intersight cloud-ops |
| Lenovo | ThinkSystem (rack-focused) | Limited modular/blade presence | X-Series modular system differentiation |

---

*This PRD is a living document. Update as Intel platform details, engineering milestones, and competitive intelligence evolve.*
