---
title: Installation & CLI
description: Use the PURISTA CLI to setup your project, create services, commands and subscriptions.
order: 30
---

# CLI

## Create a new project

The easiest and fastest way to start with PURISTA is using your package manager's `create` command.  
The scaffold is blueprint-driven and guides you through runtime, event bridge, server, linting, and module-format choices.

In the project folder, simply execute:

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

The CLI tool will guide you through all the necessary steps.  

The same generator is also available through the main CLI:

```bash
purista init my-app
```

Both entry points use the same underlying engine, so `npm create purista@latest` and `purista init` generate the same project shape.

For non-interactive scripts and CI:

```bash
purista init my-app --defaults --non-interactive --no-install
```

Non-interactive mode never prompts. It applies only declared defaults and fails fast when required values are still missing.

## PURISTA CLI

PURISTA provides a command line interface (CLI) that supports three usage modes:

- interactive usage for humans
- non-interactive usage for scripts and CI
- programmatic usage for tools and agents

The CLI allows you to create new projects and add services, commands, subscriptions, streams, queues, queue workers, and AI agents to existing services.

You can either install the CLI globally, or run it with `npx`.

Global install:

::: code-group

```bash [npm]
npm install -g @purista/cli
```

```bash [bun]
bun add --global @purista/cli
```

```bash [yarn]
yarn global add @purista/cli
```

```bash [pnpm]
pnpm add -g @purista/cli
```

:::

In your project root run:

```bash
purista add [service|command|subscription|stream|queue|queue-worker|agent]
```

Or without global install:

```bash
npx @purista/cli add [service|command|subscription|stream|queue|queue-worker|agent]
```

Programmatic callers can use the same command engine through `createPuristaCliEngine(...)`, `resolvePuristaCommand(...)`, and `runPuristaCommand(...)`.

### Common commands

```bash
purista init my-app
purista add service user --description "User service"
purista add command sign-up --service user --service-version 1 --description "Register a user"
purista add queue process-jobs --service user --service-version 1 --description "Background jobs"
purista add queue-worker process-jobs --service user --service-version 1 --queue processJobs
purista add agent triage --service user --service-version 1 --description "Review tickets"
```

### Non-interactive behavior

- `--non-interactive` disables prompts and fails on unresolved required input
- `--defaults` and `--yes` apply only explicit defaults
- interactive mode may ask only for unresolved values, but command validation stays the same across modes

Generated command, subscription, and queue schema stubs default to `z.unknown()` for payloads.
This keeps generated code type-safe by default and avoids accidental `any` propagation. The queue wizard also inserts `.canEnqueue()` declarations plus optional producer commands so you can expose HTTP `202 Accepted` endpoints immediately.

::: warning Keep CLI-Managed Definition Lists
When the CLI generates or updates service files, keep `commandDefinitions` and `subscriptionDefinitions` as typed constants.
Renaming or untyping these lists can break follow-up CLI updates and weaken inferred types.
:::

## PURISTA config file

Since version 1.12.0, the PURISTA CLI expects to find a `purista.json` file in the root of your project. This file contains basic information about your project. Especially the settings for file and event casing conventions are important.

### Schema

This configuration file follows the [JSON Schema](https://json-schema.org/) specification.

```json
{
  "$schema": "https://purista.dev/schemas/1.12.0/schema.json",
  "type": "object",
  "properties": { ... }
}
```

### Configuration Options

#### `$schema`

- __**__Type:__**__ `string`
- __**__Description:__**__ A field for the [JSON schema](https://json-schema.org/) specification.
- __**__Default:__**__ `https://purista.dev/schemas/1.12.0/schema.json`

#### `runtime`

- __**__Type:__**__ `string`
- __**__Allowed Values:__**__ `node`, `bun`
- __**__Default:__**__ `node`
- __**__Description:__**__ Specifies the runtime environment for the project.

#### `eventBridge`

- __**__Type:__**__ `string`
- __**__Allowed Values:__**__ `default`, `amqp`, `nats`, `mqtt`, `dapr`
- __**__Default:__**__ `default`
- __**__Description:__**__ Defines the event bridge used in the project.

#### `fileConvention`

- __**__Type:__**__ `string`
- __**__Allowed Values:__**__ `camel`, `snake`, `kebab`, `pascal`, `pascalSnake`
- __**__Default:__**__ `camel`
- __**__Description:__**__ Determines the file naming convention used in the project.

#### `eventConvention`

- __**__Type:__**__ `string`
- __**__Allowed Values:__**__ `camel`, `snake`, `kebab`, `pascal`, `pascalSnake`, `constantCase`, `dotCase`, `pathCase`, `trainCase`
- __**__Default:__**__ `camel`
- __**__Description:__**__ Determines the naming convention for events in the project.

#### `linter`

- __**__Type:__**__ `string`
- __**__Allowed Values:__**__ `biome`, `eslint`, `none`
- __**__Default:__**__ `none`
- __**__Description:__**__ Specifies the linter used in the project.

#### `formatter`

- __**__Type:__**__ `string`
- __**__Allowed Values:__**__ `biome`, `prettier`, `none`
- __**__Default:__**__ `none`
- __**__Description:__**__ Specifies the formatter used in the project.

#### `servicePath`

- __**__Type:__**__ `string`
- __**__Default:__**__ `src/service`
- __**__Description:__**__ Defines the relative path where services are located in the project.

#### `agentPath`

- __**__Type:__**__ `string`
- __**__Default:__**__ `src/agents`
- __**__Description:__**__ Defines the relative path where agents are located in the project.

### Example `purista.json` Configuration

```json
{
  "$schema": "https://purista.dev/schemas/1.12.0/schema.json",
  "runtime": "node",
  "eventBridge": "nats",
  "fileConvention": "kebab",
  "eventConvention": "dotCase",
  "linter": "eslint",
  "formatter": "prettier",
  "servicePath": "src/services"
}
```
Use `purista add agent` to scaffold an AI workload manifest powered by `@purista/ai`. The generator creates an `AgentQueueBuilder` under `src/agents/<name>/v<version>/` plus a prepared Vitest spec that already boots an in-memory event bridge, injects a deterministic provider, executes one agent run, and checks protocol frames. Agents run beside services—no helper command is required. After filling in the handler, call `<yourAgent>.getInstance(eventBridge, options)` inside your bootstrap and invoke from commands/subscriptions via `.canInvokeAgent(...)/context.invokeAgent` (or use `invokeAgent` for scripts/tests outside a Purista context).
