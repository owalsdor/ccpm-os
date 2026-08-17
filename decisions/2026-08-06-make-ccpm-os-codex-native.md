## Decision: Make the public CCPM-OS template Codex-native

## Context

The public template used Cursor-specific rules, slash commands, ACP scheduling, MCP configuration, and copied `.cursor/` workspaces. The repository is being published for Codex users.

## Alternatives considered

- Keep Cursor and Codex layouts together as a compatibility layer.
- Rename files but preserve the Cursor command and scheduler architecture.
- Use native Codex instruction, skill, MCP, and Scheduled-task surfaces and retire the Cursor runtime.

## Reasoning

One native layout avoids duplicated instructions and unclear runtime ownership. Codex reads repository guidance from `AGENTS.md`, discovers repository skills from `.agents/skills/`, loads local MCP servers through Codex configuration, and runs recurring work through Scheduled tasks. Keeping the old scheduler or copied `.cursor/` tree would preserve two competing sources of truth.

The old slash-command routers remain useful as Codex orchestrator skills under `.agents/skills/_commands/`. The Business Model Canvas skill was renamed to `business-model-canvas` so the `$business-model` router and its focused dependency have unique skill names.

## Trade-offs accepted

- The repository no longer runs in Cursor without manual adaptation.
- The Cursor ACP scheduler application is removed rather than ported.
- Users invoke migrated orchestrators with `$skill-name` instead of `/command-name`.
- Historical migration notes still mention Cursor where the mapping is useful.
- Webex MCP setup requires a Codex configuration step and may require OAuth authorization again.

## Review trigger

Revisit if Codex changes the repository instruction, skill discovery, MCP, or Scheduled-task surfaces, or if a supported cross-agent package format can replace the repository-specific layout without duplicating sources of truth.
