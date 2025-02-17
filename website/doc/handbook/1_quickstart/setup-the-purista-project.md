---
title: Project Setup
description: Add the first subscription to your PURISTA service
order: 101000
---

# Setup a PURISTA project

In this short quickstart example, we will setup a new project, based on PURISTA.

## Create a new project

Run the following command, and you will be guided through the installation:

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

Please follow the steps in the installation process.
It is recommended to install the PURISTA CLI globally.

## Project structure

The created project will have a pre-defined folder structure and expects this structure to work properly.

Here is an example of the folder structure:

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
| |               |- [subscriptionName]SubscriptionBuilder.ts
| |               |- [subscriptionName].test.ts
| |               |- schema.ts
| |               |- types.ts
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
|- jest.config.js
