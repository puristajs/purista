---
title: Project Setup
description: Create a new PURISTA project and scaffold service artifacts
order: 101000
---

# Setup a PURISTA project

In this quickstart step, you create a new project with the PURISTA CLI blueprint engine.
The generator resolves a local project blueprint based on your runtime, event bridge, HTTP server,
and linting choices, then writes an ESM project skeleton for that setup.

## Create a new project

Run one of the following commands:

::: code-group

```bash [npm]
npm create purista@latest
```

```bash [bun]
bun create purista@latest
```

```bash [yarn]
yarn create purista@latest
```

```bash [pnpm]
pnpm create purista@latest
```

:::

You can also run the same flow directly through the main CLI:

```bash
purista init my-app
```

For CI, scripts, or agentic tooling, the same command also supports deterministic non-interactive usage:

```bash
purista init my-app \
  --runtime node \
  --event-bridge default \
  --webserver \
  --linter biome \
  --formatter biome \
  --package-manager npm \
  --non-interactive \
  --defaults \
  --no-install
```

The create wrapper and the main CLI use the same underlying command engine, so both entry points generate the same project shape.

::: tip Recommended for AI-assisted projects
Generated projects include `AGENTS.md`, `CLAUDE.md`, `.agents/IMPLEMENTATION.md`, and local PURISTA skill links for coding agents by default. The skill links target `node_modules/@purista/core/skills/purista`, so updating `@purista/core` refreshes the project skill.

See [Install the PURISTA AI Skill](../install-ai-skill.md) if you need to add the skill to an existing project or an assistant-specific mirror.
:::

Choose the options that fit your runtime and deployment setup:

- `runtime`: `node` or `bun`
- `event bridge`: `default`, `amqp`, `mqtt`, `nats`, or `dapr`
- `webserver`: add the bundled Hono-based HTTP surface when needed
- `linter`: `biome`, `eslint`, or `none`
- generated projects are ESM-only and always use `"type": "module"`

After setup, generate services and business artifacts with the CLI:

1. `purista add service`
2. `purista add command`
3. `purista add subscription`
4. `purista add stream`
5. `purista add queue`
6. `purista add queue-worker`
7. `purista add agent`

Recommended scaffold order for new projects:

1. `purista add service` and first `purista add command`
2. `purista add stream` if you need push/live updates
3. `purista add queue` + `purista add queue-worker` for background jobs
4. install optional AI packages in the application when you need LLM-powered workloads

Rule of thumb:

- commands = request/response entrypoints
- streams = live outbound updates
- queues/workers = durable async processing
- agents = optional application-level AI workloads built outside the core runtime

See also:

- [Streams](../2_building_business-logic/stream/index.md)
- [Queues](../2_building_business-logic/queue/index.md)

## AI agent packages

If your app uses AI agents with a model provider, add the provider package (AI agent support is built into `@purista/core`):

::: code-group

```bash [npm]
npm install @purista/harness-openai
```

```bash [pnpm]
pnpm add @purista/harness-openai
```

```bash [bun]
bun add @purista/harness-openai
```

```bash [yarn]
yarn add @purista/harness-openai
```

:::

## Project structure

The generated app shape is intentionally minimal. The initializer creates the runtime/bootstrap files,
the project config, and an example `ping` service with one starter command. Follow-up CLI commands then extend that structure.

```text
|-public/                     # only when --webserver is enabled
|-src/
| |-config/                   # bridge/http config files when required by the selected blueprints
| |-agents/
| |-service/
| |   |- serviceEvent.enum.ts
| |   |- ping/
| |       |- generalPingServiceInfo.ts
| |       |- v1/
| |           |- pingServiceConfig.ts
| |           |- pingV1ServiceBuilder.ts
| |           |- pingV1Service.ts
| |           |- pingV1Service.test.ts
| |           |- command/
| |               |- ping/
| |                   |- schema.ts
| |                   |- types.ts
| |                   |- pingCommandBuilder.ts
| |                   |- pingCommandBuilder.test.ts
| |-eventbridge.ts
| |-http.ts                   # only when --webserver is enabled
| |-index.ts
|- package.json
|- package-lock.json / bun.lockb / pnpm-lock.yaml / yarn.lock
|- tsconfig.json
|- purista.json
|- README.md
|- AGENTS.md
|- CLAUDE.md
|- .agents/
| |- IMPLEMENTATION.md
| |- skills/
|     |- purista -> node_modules/@purista/core/skills/purista
|- .claude/
| |- skills/
|     |- purista -> node_modules/@purista/core/skills/purista
|- .gitignore
```

Notes:

- `src/service` and `src/agents` are the default CLI-managed roots.
- `AGENTS.md`, `CLAUDE.md`, and `.agents/IMPLEMENTATION.md` guide coding agents toward PURISTA structure and CLI usage.
- `.agents/skills/purista` and `.claude/skills/purista` are package-backed links to the PURISTA skill bundled with `@purista/core`.
- The exact filenames follow the `fileConvention` and `eventConvention` from `purista.json`.
- `src/eventbridge.ts` is generated from the chosen bridge blueprint.
- `src/http.ts` and `public/` are only created for the HTTP-enabled project variants.
- Additional commands, subscriptions, streams, queues, queue workers, and agents are generated into this structure by `purista add ...`.

The CLI expects this structure for automated updates and type-safe wiring, so avoid moving the generated roots unless you also update `purista.json`.
