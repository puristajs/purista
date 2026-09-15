---
title: Architecture and lifecycle
description: Understand how a portable Harness definition becomes an addressable PURISTA capability without coupling either side to HTTP or process layout.
order: 391
---

A Harness definition is immutable application metadata. It can run through the
standalone Harness runtime or be mounted by a PURISTA service. Mounting gives
each root agent and workflow a normal PURISTA address. Agents and workflows
used only as dependencies stay private to the Harness graph.

```text title="Mounted target address"
service name + service version + target name
Support      + 1               + triageTicket
```

Every call crosses EventBridge. A caller does not keep a reference to the
definition or dispatch directly to a same-process instance. The same code
therefore works when caller and target later run in different processes.

## Lifecycle

1. Define agents and workflows with `defineAgent(...)` and `defineWorkflow(...)`.
2. Compose one service-owned graph with `defineHarness().addAgent(...)` and
   `.addWorkflow(...)`.
3. Define typed business policy with
   `serviceBuilder.defineHarnessPolicy(definition, { agents, workflows })`, then
   mount it once with `mountHarness(definition, policy)`.
4. Supply concrete runtime adapters under `getInstance(eventBridge, { ai: ... })`.
5. Start EventBridge and the service through the normal PURISTA lifecycle.
6. Call the mounted target with an address-first client.
7. Let service destruction close its Harness runtime and owned adapters.

The service accepts one `mountHarness(...)` call and creates one Harness
instance for that definition. Add further agents and workflows to the graph
before mounting. Add tools, Skills, and MCP tools to the definitions that use
them. Do not
construct another Harness inside a command handler. That would bypass mount
policy, trusted identity, host-tool bindings, lifecycle, and EventBridge.

Each agent or workflow has one input schema and one final output schema. An
address-first `.run(...)` call returns `{ sessionId, outcome }`. The `outcome`
is either completed output or a typed interruption. An address-first
`.stream(...)` call returns a cancellable execution stream with the resolved
`sessionId` and portable execution events.

An approval or external wait is an interrupted outcome. It is not an exception
and must not become an HTTP 500 response.

## Error mapping at the mount boundary

PURISTA keeps safe Harness error metadata and maps known failure classes to
handled status codes:

| Harness failure | PURISTA status | Caller data |
| --- | --- | --- |
| input or contract validation | `400 Bad Request` | stable `code` and `retriable` only |
| permission, policy denial, or explicit `DECISION_BLOCKED` | `403 Forbidden` | stable `code` and `retriable` only |
| run or model-call concurrency rejection | `429 Too Many Requests` | stable code plus `retryAfterMs` |
| timeout | `504 Gateway Timeout` | stable `code` and `retriable` only |
| detector failure, provider failure, invalid output, or unknown error | `500 Internal Server Error` | sanitized handled error |

Tool approval and external wait do not use this table because they are typed
interrupts in `RunOutcome`. Streaming sends the same safe status and data in
its terminal error frame.
