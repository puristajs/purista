# PURISTA tutorial maintenance

This tutorial teaches PURISTA Framework capabilities through one small Example
Bank application. The bank is a fixture for the lessons. It is not a service
boundary, and the course does not claim to implement payment or regulatory
software.

Read [ROADMAP.md](./ROADMAP.md) for the exact 28 chapter sequence and the
service that owns each capability. Read [VERIFICATION.md](./VERIFICATION.md)
for the retained source baseline, draft rules, and release checks.

## How to work on a chapter

Write the lesson before changing the retained source. A construction page must
show the project-local CLI command, the complete edit with its exact path, and
the command or request that proves the result. Keep each chapter independent:
its replay recipe must create its own project state and data.

The tutorial uses the PURISTA Framework composition root. Services own
commands, subscriptions, streams, queues, workers, and their resources. The
HTTP server is a transport boundary. Agents and workflows are native Harness
definitions owned by a versioned service:

```text
src/service/<service>/v<version>/harness/
  agent/
  workflow/
  tool/
  skill/
  mcp/
```

Compose one Harness definition for that service version and mount it once with
`ServiceBuilder.mountHarness(...)`. Bind the primary model as `ai.model` at
application startup. Providers, storage, memory, sandbox, workspace,
admission, queues, artifacts, and telemetry are runtime bindings owned by the
application composition root. Authentication creates trusted identity;
business guards authorize effects; Harness guardrails govern model content.

The first 17 chapters establish the Framework base: project creation, HTTP,
resources, identity, authorization, transforms, events, streams, queues,
schedules, observability, and distributed runtime. Chapters 18 through 28 are
AI capability packets. They stay `draft` in `course.json` until their focused
source, deterministic tests, and clean consumer replay have passed.

## Replay and source checks

From the PURISTA repository root, check one retained chapter:

```sh
node examples/banking/tutorial/replay.mjs --check --chapter command-transforms
```

To reconstruct a chapter from its lessons, use a new output directory:

```sh
node examples/banking/tutorial/replay.mjs \
  --chapter command-transforms --out /tmp/purista-bank-replay
```

The replay follows the chapter's declared prerequisites, uses published
package names, and checks the shown commands, files, tests, builds, and
loopback requests. It must not invent files or silently repair a broken
instruction.

Run the retained-course checks with:

```sh
npm run check:drafts --prefix examples/banking
npm run check:source --prefix examples/banking
npm run build -w @purista/web
npm test --prefix examples/banking
```

`check:drafts` checks the draft packet structure without publishing it.
`check:source` verifies page and retained-source hashes. The website build
checks rendered tutorial content. `npm test` verifies retained projects from
fresh consumer copies by resolving the declared public ranges without writing
a lockfile, then running typechecks, tests, builds, and compiled smoke checks.
Draft chapters are not part of the published retained-course gate.

The retained project package locks are a release concern owned by P4-044. They
are regenerated from the registry after all v4 packages are available.
