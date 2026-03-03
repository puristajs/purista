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

## Project structure

The blueprint creates a folder structure expected by PURISTA tooling and code generation.

```text
|-config/
|-script/
|-src/
| |- service/
| |   |- ServiceEvent.enum.ts
| |   |- [serviceName]/
| |       |- [serviceName]ServiceInfo.ts
| |       |- v[0-9]/
| |           |- [serviceName]ServiceBuilder.ts
| |           |- [serviceName]ServiceBuilder.test.ts
| |           |- [serviceName]ServiceConfig.ts
| |           |- [serviceName]Service.ts
| |           |- command/
| |           |   |- [commandName]CommandBuilder.ts
| |           |   |- [commandName].test.ts
| |           |   |- schema.ts
| |           |   |- types.ts
| |           |- subscription/
| |           |   |- [subscriptionName]SubscriptionBuilder.ts
| |           |   |- [subscriptionName].test.ts
| |           |   |- schema.ts
| |           |   |- types.ts
| |           |- stream/
| |               |- [streamName]StreamBuilder.ts
| |               |- [streamName].test.ts
| |               |- schema.ts
| |               |- types.ts
| |           |- queue/
| |           |   |- [queueName]/
| |           |       |- schema.ts
| |           |       |- types.ts
| |           |       |- [queueName]QueueBuilder.ts
| |           |       |- [queueName]QueueBuilder.test.ts
| |           |- queue-worker/
| |               |- [workerName]/
| |                   |- [workerName]QueueWorkerBuilder.ts
| |                   |- [workerName]QueueWorkerBuilder.test.ts
| |           |- agent/
| |           |   |- [agentName]/
| |           |       |- [agentName]AgentBuilder.ts
| |           |       |- [agentName]AgentBuilder.test.ts
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
