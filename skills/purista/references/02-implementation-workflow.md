# Implementation Workflow

Use this reference when turning architecture into code.

## Default Workflow
1. Read current specs and implementation.
2. Identify the owning service/package/component.
3. Use the PURISTA CLI to create supported artifacts.
4. Refine generated builders, schemas, handlers, and tests.
5. Wire runtime dependencies in `getInstance(...)`.
6. Add guards, resources, and stores for tenant/principal checks and least-privilege data access.
7. Verify package boundaries, optional dependencies, and sensitive-data handling.

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
  --type module \
  --package-manager npm \
  --non-interactive \
  --defaults \
  --no-install
purista init
purista add service <name> --description "<description>"
purista add command <name> --service <serviceName> --service-version <version>
purista add subscription <name> --service <serviceName> --service-version <version> --event <eventName>
purista add stream <name> --service <serviceName> --service-version <version>
purista add queue <name> --service <serviceName> --service-version <version>
purista add queue-worker <name> --service <serviceName> --service-version <version> --queue <queueName>
purista add agent <name> --service <serviceName> --service-version <version>
```

Use `npm create purista@latest` for the normal quickstart path. Use `purista init <target>` when an agent, CI job, or script needs the same blueprint engine directly. For automated setup, pass every relevant choice explicitly and combine `--non-interactive`, `--defaults`, and `--no-install` when dependency installation is handled by the caller.

Use builder APIs directly when:
- the CLI does not expose the needed advanced option
- you are changing framework internals
- you are writing reusable package code rather than app code
- you need a tightly scoped test fixture

## Builder Refinement Pattern
Generated artifacts should remain explicit:
- schema definitions live beside the boundary
- boundary schemas contain the minimum data needed by that boundary
- `setBeforeGuardHooks(...)` enforces tenant/principal preconditions before handler logic for sensitive operations
- handlers use `context.resources`, `context.service`, `context.stream`, `context.queue`, or `context.harness`
- runtime clients are not created inside handlers
- service files add definitions via service builder methods
- logs, metrics, traces, events, queue payloads, streams, and prompts do not include secrets, PII, raw headers, tokens, or full request bodies by default

## Package-Internal Work
For framework package changes, do not use CLI scaffolding. Edit the package source and update:
- public exports
- TSDoc/JSDoc for exported APIs
- tests and type tests
- docs or skills when behavior changes
- package dependency boundaries

## Verification
Run focused package checks first, then wider checks:
- package build
- package tests
- package lint
- stale import/reference scans for removed concepts
- sensitive-data scans in docs/examples/logging/metrics/prompts when touching public examples or AI code
- dependency-cycle checks when touching shared packages
