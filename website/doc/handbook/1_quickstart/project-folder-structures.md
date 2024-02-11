---
title: Project Structure
description: CHoosing the right project structure to manage and deploy your project
order: 102000
---

# Project Structure

The easiest and fastest way to start with PURISTA is the usage of the cli helper.  

```bash
npx @purista/cli init
```

The cli will create a pre-defined folder structure and expects this structure to work properly.

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
| |           |- index.ts
| |           |- command/
| |           |   |- [commandName]CommandBuilder.ts
| |           |   |- [commandName].test.ts
| |           |   |- index.ts
| |           |   |- schema.ts
| |           |   |- types.ts
| |           |- subscription/
| |               |- [subscriptionName]SubscriptionBuilder.ts
| |               |- [subscriptionName].test.ts
| |               |- index.ts
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
|- .eslintignore
|- .eslintrc.js
|- readme.md
|- jest.config.js
```
