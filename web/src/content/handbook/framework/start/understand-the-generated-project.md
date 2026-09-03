---
title: Understand the generated project
description: Find the composition root, service definitions, generated artifacts, and local CLI commands.
order: 170
---

The generator keeps application composition separate from business definitions. Keep that separation: application startup owns adapters and credentials; services own business contracts and handlers.

```text title="Generated project structure"
AGENTS.md                    guidance for coding agents
CLAUDE.md                    matching agent entry point
purista.json                 generator and naming configuration
public/
└── index.html               static page when Hono is selected
src/
├── index.ts                 application composition and startup
├── eventbridge.ts           selected EventBridge construction and startup
├── http.ts                  Hono composition when selected
├── config/                  selected bridge and HTTP configuration
├── service/
│   ├── serviceEvent.enum.ts project event inventory
│   └── ping/v1/             runnable service, command, schemas, and tests
└── harness/                 created when you add native Harness targets
```

The exact optional files follow the choices made by the generator. Every
project starts with the `ping` service, so the initial application can build,
test, and run before you add a business service.

## Read the generator configuration

`purista.json` tells the local CLI where to write services and how to name files
and events. For a default Node.js project it has this shape:

```json title="purista.json"
{
  "$schema": "https://purista.dev/schemas/1.12.0/schema.json",
  "servicePath": "src/service",
  "runtime": "node",
  "eventBridge": "default",
  "fileConvention": "camel",
  "eventConvention": "camel",
  "linter": "biome",
  "formatter": "biome"
}
```

Keep this file in version control. Change it deliberately before generating new
artifacts; moving generated roots without updating it causes later CLI commands
to write into a second tree.

## Use the local CLI

The generated `package.json` provides local scripts backed by the project's
`@purista/cli` development dependency. Use these scripts instead of a globally
installed CLI so every contributor uses the same version.

| Script | Creates | First use in this path |
| --- | --- | --- |
| `npm run add:service -- <name> ...` | A versioned service builder, service class, exports, and registration files | The earlier service step created `incident`. |
| `npm run add:command -- <name> ...` | Command schemas, types, builder, handler, test, and service registration | [Add a command](/handbook/framework/start/add-a-command/). |
| `npm run add:subscription -- <name> ...` | Subscription schemas, types, builder, handler, test, and service registration | [Add a subscription](/handbook/framework/start/add-a-subscription/). |
| `npm run add:stream -- <name> ...` | A typed stream definition and test | [Streams](/handbook/framework/build-services/streams/). |
| `npm run add:agent -- <name> ...` | A native Harness target, test, and one service mount | [AI-powered services](/handbook/framework/build-ai-powered-services/). |

The first path has already used the service, command, and subscription scripts.
Use the focused capability chapters for streams, queues, and agents so their
schemas, runtime wiring, and tests are added as complete steps.

Next: [move from the local result to production](/handbook/framework/start/from-zero-to-production/).
