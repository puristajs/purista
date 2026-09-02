---
title: Understand the generated project
description: Find the composition root, service definitions, generated artifacts, and local CLI commands.
order: 120
---

The generator keeps application composition separate from business definitions. Keep that separation: application startup owns adapters and credentials; services own business contracts and handlers.

```text title="Generated project structure"
src/
├── index.ts                 application composition and startup
├── eventbridge.ts           selected EventBridge wiring when applicable
├── service/
│   └── incident/v1/         versioned business service and its artifacts
├── harness/                 native Harness definitions when you add agents
└── config/                  generated adapter/server configuration when selected
```

## Use the local CLI

The generated `package.json` provides local commands. Use them instead of relying on a globally installed CLI so every contributor uses the project version.

```bash title="Generate service"
npm run add:service -- incident --description "Manage reported incidents"
npm run add:command -- create-incident --service incident --service-version 1
npm run add:subscription -- notify-on-incident --service incident --service-version 1 --event incidentCreated
```

The CLI writes the initial builder, schema, type, test, and service registration files. Edit the generated business function and its schemas; do not move generated roots without also updating `purista.json`.

Next: [create the first service](/handbook/framework/start/create-the-first-service/).
