## Decision: Use PostgreSQL as the primary datastore

> **Note:** This is an illustrative example. Replace with real decisions once you adopt this template, and delete this file.

## Context
We're starting a new service that needs relational storage, full-text search, and JSON document support. Team is two engineers; we need something boring, well-documented, and easy to operate on a small cloud budget. Decision needed before the first schema PR lands.

## Alternatives considered
- **PostgreSQL** — proven relational DB with strong JSONB, FTS, extensions (pgvector, PostGIS). Both engineers have shipped production Postgres before.
- **MySQL** — team familiarity is lower; JSON and FTS support is weaker; fewer extensions we'd want later.
- **MongoDB** — great for unstructured docs but we expect joins and reporting queries; relational shape fits better.
- **SQLite** — tempting for v0 simplicity but we'll outgrow single-writer semantics within a quarter.

## Reasoning
- JSONB + FTS + pgvector covers 90% of our near-term needs in one engine, so we avoid pulling in a second datastore for at least 12 months.
- Managed Postgres is a commodity on every cloud provider we'd consider; migration risk is low.
- Both engineers are productive in Postgres today; MongoDB and MySQL would cost weeks of ramp-up.

## Trade-offs accepted
- Heavier operational footprint than SQLite in exchange for future headroom.
- We lose MongoDB's schemaless agility; we'll need migrations from day one (tooling: `sqlx migrate` or equivalent).
- We're betting on managed Postgres staying cheap at the target cloud; if that changes, see **Review trigger**.

## Review trigger
Revisit if any of: (a) managed Postgres cost exceeds 20% of infra spend, (b) we need horizontal write scaling we can't get from read replicas + Citus, (c) a dominant workload emerges that favors a different shape (e.g., heavy time-series).
