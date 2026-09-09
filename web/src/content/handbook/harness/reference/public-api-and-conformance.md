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

The runtime surface is split into an instance, session, and target invoker:
[`HarnessInstance.getSession`](/handbook/api/interfaces/_purista_harness.HarnessInstance/#getsession)
opens a session;
[`HarnessInstance.close`](/handbook/api/interfaces/_purista_harness.HarnessInstance/#close)
closes the instance;
[`HarnessSession.getRunSummary`](/handbook/api/interfaces/_purista_harness.HarnessSession/#getrunsummary),
[`HarnessSession.release`](/handbook/api/interfaces/_purista_harness.HarnessSession/#release),
and [`HarnessSession.destroy`](/handbook/api/interfaces/_purista_harness.HarnessSession/#destroy)
manage it; and
[`HarnessTargetInvoker.run`](/handbook/api/interfaces/_purista_harness.HarnessTargetInvoker/#run)
or [`HarnessTargetInvoker.stream`](/handbook/api/interfaces/_purista_harness.HarnessTargetInvoker/#stream)
executes a composed target. Cancel a live stream with
[`HarnessTargetStream.cancel`](/handbook/api/interfaces/_purista_harness.HarnessTargetStream/#cancel).

The supporting runtime contracts are also public:
[`ArtifactStore.close`](/handbook/api/interfaces/_purista_harness.ArtifactStore/#close),
[`ArtifactStore.publish`](/handbook/api/interfaces/_purista_harness.ArtifactStore/#publish),
[`ChildTaskHandle.cancel`](/handbook/api/interfaces/_purista_harness.ChildTaskHandle/#cancel),
[`ChildTaskHandle.result`](/handbook/api/interfaces/_purista_harness.ChildTaskHandle/#result),
[`ChildTaskHandle.status`](/handbook/api/interfaces/_purista_harness.ChildTaskHandle/#status),
[`ContinuableChildTaskHandle.close`](/handbook/api/interfaces/_purista_harness.ContinuableChildTaskHandle/#close),
[`ContinuableChildTaskHandle.send`](/handbook/api/interfaces/_purista_harness.ContinuableChildTaskHandle/#send),
[`ConversationHistory.list`](/handbook/api/interfaces/_purista_harness.ConversationHistory/#list),
[`DurableWorkflowContext.step`](/handbook/api/interfaces/_purista_harness.DurableWorkflowContext/#step),
[`HarnessSession.clearHistory`](/handbook/api/interfaces/_purista_harness.HarnessSession/#clearhistory),
[`SessionChildTasks.get`](/handbook/api/interfaces/_purista_harness.SessionChildTasks/#get),
[`SessionChildTasks.list`](/handbook/api/interfaces/_purista_harness.SessionChildTasks/#list),
[`SessionMemory.delete`](/handbook/api/interfaces/_purista_harness.SessionMemory/#delete),
[`SessionMemory.list`](/handbook/api/interfaces/_purista_harness.SessionMemory/#list),
[`SessionMemory.read`](/handbook/api/interfaces/_purista_harness.SessionMemory/#read),
[`SessionMemory.search`](/handbook/api/interfaces/_purista_harness.SessionMemory/#search),
[`SessionMemory.write`](/handbook/api/interfaces/_purista_harness.SessionMemory/#write),
and [`WorkflowChildTasks.start`](/handbook/api/interfaces/_purista_harness.WorkflowChildTasks/#start).

## Definition and runtime contracts

[`defineHarness(...)`](/handbook/api/functions/_purista_harness.defineHarness/)
creates a Harness composition root. Add immutable `defineAgent`,
`defineWorkflow`, `defineTool`, `defineSkill`, and `defineMcpServer` values with
`.addAgent(...)` and `.addWorkflow(...)`; the resulting value is already the
portable composition.
`getInstance(...)` binds declared models and optional runtime adapters. The
definition's `requirements` value is the content-free startup inventory for
models, storage, memory, sandbox, skills, MCP, workspace, and artifacts.

An agent or workflow invocation returns
[`RunOutcome`](/handbook/api/types/_purista_harness.RunOutcome/). Portable
stream consumers receive [`ExecutionEvent`](/handbook/api/types/_purista_harness.ExecutionEvent/).
Keep internal diagnostic and persistence records in application-owned
observability and storage boundaries; do not expose them as the portable stream.

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
- exercise aggregate and portable stream behavior separately;
- verify cancellation reaches providers, tools, and external resources;
- verify session release, process shutdown, and durable restart behavior;
- verify public HTTP/SSE responses do not expose serialized internal errors or
  diagnostic events.

Use the [error catalog](../error-catalog/) for stable codes and the
[migration guide](/handbook/harness/upgrade-and-migrate/) for major-version
changes. A green unit test on an in-memory adapter is not evidence that a
production backend conforms under failure.
