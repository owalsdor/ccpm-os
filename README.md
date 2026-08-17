# CCPM-OS

CCPM-OS is a Markdown-first operating system for product managers, built for Codex. It combines durable repository instructions, reusable PM skills, private project conventions, starter knowledge and decision templates, and a local Webex integration.

The repository contains 88 Codex skills across product strategy, discovery, research, design, go-to-market, execution, and toolkit workflows. Seventeen of those skills are routers or multi-skill orchestrators migrated from the former Cursor slash commands.

CCPM-OS is independently maintained. It is not an official Cisco product, service, or support channel. The tracked Cisco context is a public-source example. Private Cisco work, customer information, credentials, personal material, and roadmap content do not belong in this repository.

## Public repository

This repository is the standalone internet-public distribution of CCPM-OS. Live project work is not published with the reusable Core.

## Cursor to Codex migration

| Cursor-based layout | Codex-based layout |
|---|---|
| `.cursorrules` | Root `AGENTS.md` |
| `.cursor/rules/compute.mdc` and `Cisco/CLAUDE.md` | Scoped `Cisco/AGENTS.md` |
| `skills/<category>/<skill>/SKILL.md` | `.agents/skills/<category>/<skill>/SKILL.md` |
| `commands/<category>/<command>.md` | `.agents/skills/_commands/<command>/SKILL.md` |
| `mcp/webex/` | `tools/mcp/webex/` with Codex configuration |
| Cursor ACP scheduler application | Codex Scheduled tasks |

The retired Cursor scheduler and duplicated rule surfaces are not included. Codex now reads one instruction chain and one repository skill tree.

## Quick start

1. Clone the repository.

   ```bash
   git clone https://github.com/owalsdor/ccpm-os.git
   cd ccpm-os
   ```

2. Open the folder as a local Codex project in the desktop app, CLI, or IDE extension.
3. Ask for an outcome in plain language, or invoke a skill explicitly with `$skill-name`.
4. Review the plan. Say `go ahead` when Codex should edit files or run commands.

Examples:

```text
$create-prd Create a PRD for a product onboarding improvement.
$strategy Build a product strategy for an enterprise analytics service.
$sprint plan a two-week sprint for the checkout reliability work.
```

Codex reads [AGENTS.md](AGENTS.md) automatically. Work under `Cisco/**` also receives the more specific guidance in [Cisco/AGENTS.md](Cisco/AGENTS.md).

## Repository structure

```text
ccpm-os/
├── AGENTS.md                         # Repository-wide Codex instructions
├── .agents/skills/                   # Repository-scoped Codex skills
│   ├── _commands/                    # Routers, chains, and workflow variants
│   ├── execution/
│   ├── go-to-market/
│   ├── market-research/
│   ├── marketing-growth/
│   ├── product-design/
│   ├── product-discovery/
│   ├── product-strategy/
│   └── toolkit/
├── Cisco/
│   └── AGENTS.md                     # Cisco Compute context and scoped rules
├── decisions/                        # Decision starter files
├── knowledge/                        # Federated knowledge starter files
└── tools/mcp/webex/                  # Local Webex MCP server
```

## Default behavior

- Plan before changing files or running commands.
- Ask no more than two critical questions.
- Save substantial output as Markdown under `Cisco/<project>/`.
- Prefer an existing skill over a new format.
- Keep messages, external delivery, destructive actions, and other irreversible work behind explicit approval.
- Do not invent facts, owners, dates, product status, or customer information.

The complete rules live in [AGENTS.md](AGENTS.md).

## Private work boundary

The reusable operating-system files are tracked. Live work is private by default.

The root [.gitignore](.gitignore) excludes:

- Cisco project files under `Cisco/<project>/`
- Customer and personal material
- Local Codex configuration
- Memory and writing-profile files
- New knowledge and decision records
- OAuth credentials, integration state, dependencies, and generated output

The tracked starter files under `decisions/` and `knowledge/` explain the expected structure. Do not force-add ignored work files without a deliberate review.

## Skills

Codex discovers repository skills under `.agents/skills/`. Each skill is a folder with a `SKILL.md` file containing `name` and `description` frontmatter plus the workflow instructions.

Skills can activate in two ways:

- Ask for the outcome in normal language and let Codex match the skill description.
- Invoke a specific skill with `$skill-name` when the workflow must be explicit.

The `_commands` category preserves the useful part of the old command model. These are normal Codex skills that route between other skills, chain several workflows, enforce an output variant, or coordinate an MCP tool.

Examples include:

- `$brainstorm` for idea and experiment routing
- `$discover` for a full discovery sequence
- `$plan-launch` for beachhead, ICP, and GTM planning
- `$strategy` for product vision and strategy
- `$webex-ai-followups` for Webex follow-up analysis

See the official [Codex skills documentation](https://learn.chatgpt.com/docs/build-skills) for discovery and invocation behavior.

## Cisco projects

Create each private project under `Cisco/<project>/`:

```text
Cisco/<project>/
├── index.md
├── meetings/
├── playbooks/
├── examples/
├── slides/
├── process/
├── files/
└── glossary.md
```

`glossary.md` is optional. The tracked [Cisco/AGENTS.md](Cisco/AGENTS.md) is a public-source example of scoped portfolio guidance. It is not an internal source of truth, roadmap, approval record, or statement of product availability. Replace or remove it for another organization.

## Knowledge and decisions

### Knowledge

`knowledge/INDEX.md` routes between project knowledge and shared knowledge.

- Domain knowledge records what things are.
- Procedural knowledge records how work is done.
- Project errors belong in `knowledge/<project>/ERRORS.md`.
- Cross-project errors belong in `knowledge/ERRORS.md`.
- Conclusions move to `knowledge/_shared/` when they apply to multiple projects.

### Decisions

Use `decisions/YYYY-MM-DD-<topic>.md` for choices that affect more than one task. Copy [decisions/_template.md](decisions/_template.md), record the alternatives and trade-offs, and search previous decisions before changing an established pattern.

## Webex MCP server

The local server in `tools/mcp/webex/` exposes Webex spaces, messages, follow-up data, sending, and authentication status to Codex. Sending a message remains an explicit user-approved action.

Build it with:

```bash
cd tools/mcp/webex
npm ci
npm run build
```

Register it with Codex:

```bash
codex mcp add webex -- node /absolute/path/to/ccpm-os/tools/mcp/webex/dist/index.js
```

Then restart Codex and check the server with `codex mcp list` or `/mcp` in the Codex CLI. Authentication credentials and tokens remain under `~/.webex-mcp/` and must never be committed.

See [tools/mcp/webex/README.md](tools/mcp/webex/README.md) for setup and OAuth instructions. The official [Codex MCP documentation](https://learn.chatgpt.com/docs/extend/mcp) explains configuration scopes and supported transports.

## Scheduled tasks

Codex Scheduled tasks replace the old Cursor ACP scheduler application.

1. Test the prompt in a normal Codex chat.
2. Open Scheduled in the desktop app.
3. Select this project, the cadence, and the execution environment.
4. Use a dedicated Git worktree when scheduled changes should stay separate from active work.
5. Invoke a specific skill in the task prompt when automatic selection would be too broad.
6. Review the first runs and keep external actions behind a human approval gate.

Local scheduled tasks need the computer and desktop app running when they use project files. See the official [Scheduled tasks documentation](https://learn.chatgpt.com/docs/automations).

## Adding or updating a skill

1. Create `.agents/skills/<category>/<skill-name>/SKILL.md`.
2. Use lowercase letters, digits, and hyphens for the folder and `name`.
3. Keep the frontmatter to `name` and `description`.
4. Put detailed guidance in `references/`, deterministic helpers in `scripts/`, and reusable output material in `assets/` only when needed.
5. Validate the skill and test both direct and indirect trigger prompts.
6. Review the repository diff and confirm no private material entered the commit.

Use `$skill-creator` when building a new workflow.

Run the public-Core validator before proposing a release:

```bash
node scripts/validate-core.mjs
```

## Security

Report security issues and accidental public-data exposure through the private process in [SECURITY.md](SECURITY.md). Do not place credentials, confidential material, or personal information in a public issue.

## License and reuse

No repository-wide open-source license has been granted. Public visibility permits inspection but does not by itself grant permission to copy, modify, or redistribute the repository. The Webex MCP package metadata contains its own license declaration. A repository-wide license requires a separate provenance and ownership review.

## Publication scope

This Core is intentionally internet-public on GitHub.com. It contains reusable templates, tooling, and a public-source Cisco context example only. It must not contain customer data, credentials, personal operating state, local project files, confidential product material, restricted sources, or roadmap content.

Official Codex references:

- [Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp)
- [Scheduled tasks](https://learn.chatgpt.com/docs/automations)
