---
title: Install the PURISTA AI Skill
description: Give AI coding assistants the PURISTA mental model, service builder rules, runtime wiring patterns, and scaffold guidance before they edit your project.
order: 15000
---

# Install the PURISTA AI skill

PURISTA includes an AI assistant skill for architecture, service design, builders, runtime wiring, adapters, queues, subscriptions, AI Harness work, and implementation planning. Install it before asking an assistant to create or edit PURISTA services.

New projects created with `npm create purista@latest` or `purista init` are agent-ready by default. The generated app includes:

- `AGENTS.md` for agent-neutral coding guidance
- `CLAUDE.md` for Claude-specific entrypoint guidance
- `.agents/IMPLEMENTATION.md` for CLI-first implementation rules
- `.agents/skills/purista` and `.claude/skills/purista` links to the PURISTA skill bundled with `@purista/core`

Those skill links point at `node_modules/@purista/core/skills/purista`, so updating `@purista/core` updates the local project skill.

Use the `skills` CLI only when you need to add the PURISTA skill to an existing project or to an assistant-specific/global skill mirror.

## Existing projects

Use the package runner for your project:

```bash
npx skills add puristajs/purista --skill purista
```

Equivalent package-runner forms:

```bash
npx skills add puristajs/purista --skill purista
pnpm dlx skills add puristajs/purista --skill purista
yarn dlx skills add puristajs/purista --skill purista
```

To install only for a specific agent, add `--agent`:

```bash
npx skills add puristajs/purista \
  --skill purista \
  --agent codex
```

To inspect the available skills before installing:

```bash
npx skills add puristajs/purista --list --full-depth
```

## What it adds

The `purista` skill gives your assistant project-specific rules for:

- starting from business capabilities and ownership boundaries
- designing services, commands, subscriptions, streams, queues, workers, and agents
- keeping builder definitions, runtime wiring, resources, stores, and adapters separated
- using schemas and command contracts as reviewable boundaries
- treating event bridges, queue bridges, stores, sandbox, and providers as runtime wiring
- planning implementation work that stays aligned with PURISTA CLI conventions

## Verify

For new projects, verify the generated links:

```bash
ls -l .agents/skills/purista .claude/skills/purista
```

For manually installed project skills, list installed skills:

```bash
npx skills list
```

Then ask your assistant to use the PURISTA skill when designing or editing services:

```text
Use the PURISTA skill and add an Order service with createOrder and cancelOrder commands.
```

Next: [Quickstart](./1_quickstart/index.md).
