---
title: Installation & CLI
description: Scaffold projects and generate PURISTA services, business capabilities, and service-owned Harness definitions.
order: 30
---

# Installation & CLI

The PURISTA CLI creates a project and adds typed definitions to it. It supports
interactive use and deterministic non-interactive use.

## Create a project

::: code-group

```bash [npm]
npm create purista@latest
```

```bash [bun]
bun create purista@latest
```

```bash [pnpm]
pnpm create purista@latest
```

:::

You can also run `purista init my-app`. The initializer asks about the runtime,
EventBridge, HTTP server, linter, formatter, and package manager.

For scripts and CI, pass every required choice:

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

Non-interactive mode never prompts. It fails before writing when a required
value is missing or a generated path or identifier would collide.

Generated projects install `@purista/cli` as a development dependency. Use the
project scripts so generation follows the version used by the project.

## Add Framework definitions

```bash
npm run add:service
npm run add:command
npm run add:subscription
npm run add:stream
npm run add:queue
npm run add:queue-worker
```

For example:

```bash
npm run add:command -- sign-up \
  --service user \
  --service-version 1 \
  --description "Register a new user"
```

The CLI checks all planned paths and edits before the first write. It keeps the
service definition lists typed, so later generation can add another definition
without losing inference.

## Add Harness definitions

Agents, workflows, host tools, portable tools, Skills, and MCP definitions live
with the service that owns the Harness mount.

```bash
npm run add:agent -- triage-ticket \
  --service support \
  --service-version 1 \
  --description "Classify a support ticket" \
  --http none

npm run add:workflow -- resolve-ticket \
  --service support \
  --service-version 1 \
  --description "Coordinate ticket resolution"

npm run add:tool -- get-incident \
  --service support \
  --service-version 1 \
  --kind purista

npm run add:tool -- calculate-risk \
  --service support \
  --service-version 1 \
  --kind portable

npm run add:skill -- incident-review \
  --service support \
  --service-version 1 \
  --runtime node

npm run add:mcp -- issue-tracker \
  --service support \
  --service-version 1 \
  --tool lookup-issue \
  --remote-name lookup_issue
```

`add:agent --http` accepts `none`, `command`, or `stream`. The default is
`none`, including non-interactive mode:

- `command` creates a protected aggregate endpoint that returns
  `{ sessionId, outcome }`;
- `stream` creates a protected AI SDK UI Message Stream v1 endpoint with
  request parsing, resume support, SSE output, and cancellation;
- `none` creates no HTTP wrapper.

A generated host tool uses `ServiceBuilder.defineTool(...)`. A portable tool
uses `defineTool(...)`. A generated tool, Skill, or MCP server is a leaf: the
CLI tells you which definition to edit, but it does not register the leaf
automatically. Skills attach to agents. Tools can also be used by workflows.
MCP connection URLs, tokens, commands, and environment variables belong in
runtime configuration, not the definition.

## First-agent bootstrap

When you add the first agent to a project with the standard `src/index.ts`
entrypoint, the CLI adds the OpenAI Harness provider, an `OPENAI_API_KEY`
environment schema entry, and the primary `ai.model` runtime binding. This is
the only generation step that needs provider bootstrap. Tests remain
credential-free by using a fake model.

If the project uses a different entrypoint, the CLI keeps the generated agent
usable and prints the exact manual bootstrap steps instead of changing an
unknown composition root.

A protected generated HTTP wrapper requires Hono protect middleware. Configure
authentication with `setProtectMiddleware(...)`; use command, stream, or
target guards for business authorization.

## Generated layout

A service and its Harness definitions share one versioned directory:

```text
src/
├── service/
│   └── support/
│       ├── generalSupportServiceInfo.ts
│       └── v1/
│           ├── supportV1ServiceBuilder.ts
│           ├── supportV1Service.ts
│           ├── command/
│           ├── stream/
│           ├── queue/
│           ├── queue-worker/
│           └── harness/
│               ├── supportHarness.ts
│               ├── agent/
│               │   └── triageTicket/
│               ├── workflow/
│               │   └── resolveTicket/
│               ├── tool/
│               ├── skill/
│               └── mcp/
├── eventbridge.ts
├── http.ts
└── index.ts
```

The Harness root imports direct definitions and adds agents and workflows with
`.addAgent(...)` and `.addWorkflow(...)`. The service mounts that root once
with `ServiceBuilder.mountHarness(...)`.

## Project configuration

`purista.json` controls naming and project paths:

```json [purista.json]
{
  "$schema": "https://purista.dev/schemas/1.12.0/schema.json",
  "runtime": "node",
  "eventBridge": "nats",
  "fileConvention": "camel",
  "eventConvention": "camel",
  "linter": "biome",
  "formatter": "biome",
  "servicePath": "src/service"
}
```

Use a relative `servicePath`. Identifier casing follows the configured file and
event conventions while generated Harness ids use their required canonical
form.

## Next steps

- [Build services](/handbook/framework/build-services/)
- [Build AI-powered services](/handbook/framework/build-ai-powered-services/)
- [Expose and consume services](/handbook/framework/expose-and-consume-services/)
