---
title: Public API and conformance
description: Identify the supported import surface and the evidence required before claiming that a custom adapter or integration conforms.
order: 1430
---

The supported API is the package export map plus the generated API reference
for the installed major version. Import from package roots and documented
subpaths. Do not import `src/`, `dist/`, or another package's internal module.

## Public entry points

| Entry point | Public role |
| --- | --- |
| `@purista/harness` | Builder, runtime, schemas, ports, errors, in-memory defaults, local durable bundle, and core types. |
| `@purista/harness/testing` | Fake model provider, event recorder, and reusable adapter contract suites. |
| `@purista/harness-ai-sdk-ui/v1` | AI SDK UI Message Stream v1 conversion and approval-resume helpers. |
| First-party adapter package roots | Provider, memory, storage, sandbox, Guardrails, policy, or plugin factory owned by that package. |

The generated [Harness API reference](/handbook/api/modules/_purista_harness/)
is the exact symbol lookup. The task guides explain ordering, ownership, and
failure behavior that a type signature alone cannot express.

## Definition and runtime contracts

[`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/)
creates an immutable fluent definition. Singular and plural registrations
append and reject duplicate IDs. `.build()` validates a concrete runtime;
`.define()` creates a portable contract whose `.getInstance(...)`
requires the host to bind declared models, host tools, and optional runtime
adapters.

[`harness.inspect()`](/handbook/api/interfaces/_purista_harness.Harness/#inspect)
returns an immutable, content-free
[`HarnessInspection`](/handbook/api/interfaces/_purista_harness.HarnessInspection/)
containing the Harness name, available and required adapter capabilities,
adapter descriptors, and static-module provenance. Use it for startup
diagnostics and inventory. It is not a session/run status API and never
authorizes access to an adapter or module.

An agent or workflow invocation returns
[`RunOutcome`](/handbook/api/types/_purista_harness.RunOutcome/). Portable
stream consumers receive [`ExecutionEvent`](/handbook/api/types/_purista_harness.ExecutionEvent/);
operators receive the richer [`RunEvent`](/handbook/api/types/_purista_harness.RunEvent/)
through `.observe(...)`. Treating those two event streams as interchangeable
is a contract violation.

## Adapter conformance evidence

A structurally assignable TypeScript object is only the start. Before publishing
or deploying a custom adapter:

1. declare only capabilities the implementation actually guarantees;
2. run the matching shared contract from `@purista/harness/testing`;
3. add backend tests for restart, concurrency, cancellation, timeout, malformed
   data, unavailable dependencies, cleanup, and platform-specific isolation;
4. typecheck against the supported Harness major without casts or declaration
   shims;
5. verify package exports, ESM loading, the Node.js engine, peer ranges, and a
   packed-artifact install;
6. run a live-gated smoke test against the real provider or platform.

Contract suites prove portable behavior within their scope. They cannot prove
cloud permissions, database topology, container isolation, network policy, or
provider model availability.

## Release checks for applications

Keep all first-party Harness packages on the same major. For a clean release:

- run application typechecking, linting, unit tests, and production build;
- exercise one completed and one interrupted `RunOutcome`;
- exercise aggregate, portable stream, and diagnostic observation separately;
- verify cancellation reaches providers, tools, and external resources;
- verify session release, process shutdown, and durable restart behavior;
- verify public HTTP/SSE responses do not expose serialized internal errors or
  diagnostic events.

Use the [error catalog](../error-catalog/) for stable codes and the
[migration guide](/handbook/harness/upgrade-and-migrate/) for major-version
changes. A green unit test on an in-memory adapter is not evidence that a
production backend conforms under failure.
