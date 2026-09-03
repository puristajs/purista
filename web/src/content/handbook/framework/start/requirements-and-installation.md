---
title: Requirements and installation
description: Prepare a supported runtime and package manager before generating a PURISTA project.
order: 110
---

Prepare the runtime and package manager before generating a project. The next
page uses the official generator to create an ESM application with
`@purista/core` as a runtime dependency and `@purista/cli` as a local
development dependency.

## Requirements

- Node.js 24.15.0 or newer, or a Bun version compatible with the generated project.
- npm, pnpm, Yarn, or Bun available for the generator and project scripts.
- An empty target directory. The CLI asks before writing into a non-empty directory; non-interactive mode fails instead.

## What the generator will provide

| Capability | State after the default scaffold |
| --- | --- |
| Services, commands, subscriptions, streams, queues, and test helpers | Included by `@purista/core` |
| Local `add:*` generation commands | Included through the project-local `@purista/cli` development dependency |
| Runnable example service | A `ping` service, command, schemas, and generated test are present before you add business code |
| Event delivery and stores | In-memory defaults; suitable for local development and tests |
| HTTP server | Not added unless selected in the generator or installed and wired later |
| AI model execution | Not configured; it requires a provider package, credentials, and runtime binding |

Do not add a production broker or a model provider yet. First get the default application working, then enable only the capability your workload needs.

Next: [create a project](/handbook/framework/start/create-a-project/).
