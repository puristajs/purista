---
title: Project Setup
description: Create a new PURISTA project and scaffold service artifacts
order: 101000
---

# Setup a PURISTA project

In this quickstart step, you create a new project from the official blueprint templates.

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

Choose the blueprint options that fit your runtime/deployment setup.

After setup, generate services and business artifacts with the CLI:

1. `purista add service`
2. `purista add command`
3. `purista add subscription`
4. `purista add stream`
5. `purista add queue`
6. `purista add queue-worker`
7. `purista add agent`

If your app uses AI agents, add the package:

::: code-group

```bash [npm]
npm install @purista/ai
```

```bash [pnpm]
pnpm add @purista/ai
```

```bash [bun]
bun add @purista/ai
```

```bash [yarn]
yarn add @purista/ai
```

:::

## Project structure

The blueprint creates a folder structure expected by PURISTA tooling and code generation.

```text
|-config/
|-script/
|-src/
| |-services/
| |   |- [serviceName]/
| |       |- v1/
| |           |- [serviceName].ts
| |           |- [serviceName].test.ts
| |           |- command/
| |           |- subscription/
| |           |- stream/
| |           |- queue/
| |           |- queue-worker/
| |-agents/
| |   |- [agentName]/
| |       |- v1/
| |           |- [agentName].ts
| |           |- [agentName].test.ts
| |- store/
| |   |- config/
| |   |- state/
| |   |- secret/
| |- eventbridge/
|- package.json
|- package-lock.json / bun.lockb
|- tsconfig.json
|- .gitignore
|- readme.md
```

The CLI expects this structure for automated updates and type-safe wiring.
