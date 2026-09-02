---
title: Architecture and lifecycle
description: Understand how a portable Harness definition becomes an addressable PURISTA capability without coupling either side to HTTP or process layout.
order: 391
---

A Harness definition is immutable application metadata. It can run through the
standalone Harness runtime or be mounted by a PURISTA service. Mounting assigns
selected agents and workflows normal PURISTA addresses:

```text title="Mounted target address"
service name + service version + target name
Support      + 1               + triage_ticket
```

Every call crosses EventBridge. A caller does not keep a reference to the
definition or dispatch directly to a same-process instance. The same code
therefore works when caller and target later run in different processes.

## Lifecycle

1. Compose one portable service definition with `defineHarness()` and native Harness modules.
2. Mount it with `ServiceBuilder.mountHarness(definition, policy)`.
3. Supply concrete runtime adapters under `getInstance(eventBridge, { ai: ... })`.
4. Start EventBridge and the service through the normal PURISTA lifecycle.
5. Call a published target with an address-first client.
6. Let service destruction close its Harness runtime and owned adapters.

The service accepts one `mountHarness(...)` call and creates one Harness
instance for that definition. Add further agents, workflows, tools, and Skills
through native Harness modules before mounting. Do not
construct another Harness inside a command handler. That would bypass mount
policy, trusted identity, host-tool bindings, lifecycle, and EventBridge.

Each agent or workflow has one input schema and one final output schema. The
definition may additionally declare portable updates: `none`, `text-delta`,
or `object-snapshot`. A consumer chooses `.run(...)` for
`RunOutcome<Output>` or `.stream(...)` for
`AsyncIterable<ExecutionEvent<Output>>`.

An approval or external wait is an interrupted outcome. It is not an exception
and must not become an HTTP 500 response.
