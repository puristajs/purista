---
title: Install the PURISTA AI Skill
description: Give AI coding assistants the PURISTA mental model, service builder rules, runtime wiring patterns, and scaffold guidance before they edit your project.
order: 15000
---

# Install the PURISTA AI skill

PURISTA includes an AI assistant skill for architecture, service design, builders, runtime wiring, adapters, queues, subscriptions, AI Harness work, and implementation planning. Install it before asking an assistant to create or edit PURISTA services.

The skill is published from the PURISTA repository and can be installed with the `skills` CLI.

## Install

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

List installed project skills:

```bash
npx skills list
```

Then ask your assistant to use the PURISTA skill when designing or editing services:

```text
Use the PURISTA skill and add an Order service with createOrder and cancelOrder commands.
```

Next: [Quickstart](./1_quickstart/index.md).
