# Implementation Workflow

Use this reference when turning architecture into code.

## Contents

- [Default workflow](#default-workflow)
- [Use the CLI first](#use-the-cli-first)
- [Builder refinement pattern](#builder-refinement-pattern)
- [Framework boundary](#framework-boundary)
- [Verification](#verification)

## Default Workflow
1. Run `purista inspect --definitions purista.definitions.json --view agent --scope service:<name>/<version> --depth 1 --schemas referenced --format json` and read the bounded static architecture context. Use the full manifest only when cross-service scope is required.
2. Run `purista validate --definitions purista.definitions.json --strict --format json`; resolve every error before changing architecture.
3. Identify the owning service/package/component.
4. Use the PURISTA CLI to create supported artifacts.
5. Refine generated builders, schemas, handlers, and tests.
6. Wire runtime dependencies in `getInstance(...)`.
7. Add guards, resources, and stores for tenant/principal checks and least-privilege data access.
8. Verify package boundaries, optional dependencies, and sensitive-data handling.

`inspect`, `validate`, and `doctor` are static: they do not contact live
bridges, stores, scheduler providers, or model providers. Their JSON output
omits handler functions, credentials, provider instances, prompts, transcripts,
and arbitrary provider hints. Use `doctor` for static project/configuration
checks, never as evidence of production infrastructure health.

`inspect` and `validate` work from the definitions file alone. The manifest has
stable component/relation IDs, role-specific JSON Schema fingerprints, and a
digest. Markdown is a deterministic renderer of a selected graph, not a model
summary. Use
`purista inspect --definitions purista.definitions.json --out purista.architecture.json --format json`
only when a reviewed artifact is needed; that explicit `--out` is the only
write in these static preflight flows. `doctor` reports missing definitions or
`purista.json` as labelled static checks.

For a contract change, compare the candidate with a reviewed local artifact:

```bash
purista diff --base approved.architecture.json --definitions purista.definitions.json --strict --format json
```

Treat `PURISTA_ARCH_SCHEMA_COMPATIBILITY_UNKNOWN` as a stop condition. Do not
claim compatibility from a changed fingerprint or make a schema exception on
your own. For a distributed system, a deployment repository supplies pinned
artifacts and explicit unresolved-edge bindings to `purista compose`; never
infer an external producer, clone another repository, or contact a registry.

## Use The CLI First
Prefer CLI scaffolding for supported app artifacts:

```bash
npm create purista@latest
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
purista init
npm run add:service -- <name> --description "<description>"
npm run add:command -- <name> --service <serviceName> --service-version <version>
npm run add:subscription -- <name> --service <serviceName> --service-version <version> --event <eventName>
npm run add:stream -- <name> --service <serviceName> --service-version <version>
npm run add:queue -- <name> --service <serviceName> --service-version <version>
npm run add:queue-worker -- <name> --service <serviceName> --service-version <version> --queue <queueName>
npm run add:schedule -- <name> --description "<description>" --service <serviceName> --service-version <version> --event <eventName> --cron "0 2 * * *"
npm run add:agent -- <name> --service <serviceName> --service-version <version>
```

Use `npm create purista@latest` for the normal quickstart path. Use `purista init <target>` when an agent, CI job, or script needs the same blueprint engine directly. For automated setup, pass every relevant choice explicitly and combine `--non-interactive`, `--defaults`, and `--no-install` when dependency installation is handled by the caller.

After dependencies are installed, use the project-local CLI through generated package scripts rather than a global `purista` binary:

```bash
npm run add:service -- user --description "User management"
npm run add:command -- sign-up --service user --service-version 1
pnpm run add:queue-worker -- process-jobs --service user --service-version 1 --queue processJobs
npm run add:schedule -- daily-close --description "Emit daily close" --service billing --service-version 1 --event billing.daily_close_due --cron "0 2 * * *"
bun run add:agent -- triage --service support --service-version 1
```

Match the package manager and runtime recorded in `purista.json` and `package.json`. For Bun projects, use `bun run ...`; for Node.js projects, use the configured package manager scripts (`npm run`, `pnpm run`, or `yarn`).

Use builder APIs directly when:
- the CLI does not expose the needed advanced option
- you need a tightly scoped test fixture

## Builder Refinement Pattern
Generated artifacts should remain explicit:
- schema definitions live beside the boundary
- boundary schemas contain the minimum data needed by that boundary
- `setBeforeGuardHooks(...)` enforces tenant/principal preconditions before handler logic for sensitive operations
- handlers use `context.resources`, `context.service`, `context.stream`, `context.queue`, `context.emit`, `context.agent`, or `context.harness` only after the corresponding builder capability has been declared
- runtime clients are not created inside handlers
- service files add definitions via service builder methods
- logs, metrics, traces, events, queue payloads, streams, and prompts do not include secrets, PII, raw headers, tokens, or full request bodies by default

## Framework Boundary
Changing PURISTA framework internals or publishing a framework package is not
an application task. Stop this workflow and use the framework's separate
contributor process; do not invent package internals from this skill.

## Verification
Run focused package checks first, then wider checks:
- package build
- package tests
- package lint
- stale import/reference scans for removed concepts
- sensitive-data scans in docs/examples/logging/metrics/prompts when touching public examples or AI code
- dependency-cycle checks when touching shared packages
