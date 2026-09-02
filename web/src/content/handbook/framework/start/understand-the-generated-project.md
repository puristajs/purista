---
title: Understand the generated project
description: Find the composition root, service definitions, generated artifacts, and local CLI commands.
order: 120
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

The generated `package.json` provides local commands. Use them instead of relying on a globally installed CLI so every contributor uses the project version.

```bash title="Generate service"
npm run add:service -- incident --description "Manage reported incidents"
npm run add:command -- create-incident --service incident --service-version 1
npm run add:subscription -- notify-on-incident --service incident --service-version 1 --event incidentCreated
```

The CLI writes the builder, schema, type, test, and service registration files.
Edit the generated business function and schemas. The next page adds the
`incident` service beside the generated `ping` service.

Next: [create the first service](/handbook/framework/start/create-the-first-service/).
