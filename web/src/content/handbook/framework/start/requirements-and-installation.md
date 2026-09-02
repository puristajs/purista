---
title: Requirements and installation
description: Create a supported Node.js or Bun project with the PURISTA generator.
order: 110
---

Use the project generator for the supported first path. It writes an ESM application, installs `@purista/core` as a runtime dependency, and adds `@purista/cli` as a local development dependency.

## Requirements

- Node.js 24.15.0 or newer, or a Bun version compatible with the generated project.
- npm, pnpm, Yarn, or Bun available for the generator and project scripts.
- An empty target directory. The CLI asks before writing into a non-empty directory; non-interactive mode fails instead.

## Create the project

```bash title="Create the incident-desk project"
npm create purista@latest incident-desk
cd incident-desk
```

Choose **Node.js** and the **default EventBridge** for this tutorial. The default bridge runs in one process and needs no external service.

For a repeatable CI or automation setup, provide every choice explicitly:

```bash title="Create the project without prompts"
npx @purista/cli@latest init incident-desk \
  --runtime node \
  --event-bridge default \
  --package-manager npm \
  --non-interactive \
  --defaults
```

## What is available now

| Capability | State after the default scaffold |
| --- | --- |
| Services, commands, subscriptions, streams, queues, and test helpers | Included by `@purista/core` |
| Local `add:*` generation commands | Included through the project-local `@purista/cli` development dependency |
| Event delivery and stores | In-memory defaults; suitable for local development and tests |
| HTTP server | Not added unless selected in the generator or installed and wired later |
| AI model execution | Not configured; it requires a provider package, credentials, and runtime binding |

Do not add a production broker or a model provider yet. First get the default application working, then enable only the capability your workload needs.

Next: [understand the generated project](/handbook/framework/start/understand-the-generated-project/).
