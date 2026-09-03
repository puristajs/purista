---
title: Harness glossary
description: Use consistent terms for definitions, sessions, execution, adapters, governance, and durable work.
order: 1440
---

| Term | Meaning |
| --- | --- |
| Agent | One typed default model/tool loop or one custom application handler. It is not a service, queue, or business workflow. |
| Workflow | Typed application orchestration around agents, deterministic steps, fan-out, child tasks, and durable waits. |
| Harness definition | Portable composition produced by `.define()`, with schemas, agents, workflows, tools, skills, and requirements but no concrete deployment adapters. |
| Harness instance | Runnable composition produced by `.build()` or `definition.getInstance(...)`. |
| Session | Application-facing identity and lifecycle boundary for history, memory, runs, and attached sandbox/MCP resources. One active run may mutate a session at a time. |
| Run | One invocation of an agent or workflow with a stable `runId`. |
| `RunOutcome` | Aggregate result: `completed` with typed `output`, or `interrupted` with a resumable interrupt. |
| `ExecutionEvent` | Provider-neutral, client-safe progress contract used by `.stream(...)`. |
| `RunEvent` | Detailed diagnostic event contract used by `.observe(...)`, persistence, tests, and operators. It is not a browser protocol. |
| Model provider | Adapter implementing one or more provider-neutral operations such as text, object, embedding, image, speech, or video. |
| Model alias | Application name that binds one provider, provider model ID, declared capabilities, defaults, and optional retry/admission identity. |
| Tool | Typed model-callable capability. A TypeScript tool handler owns authorization and side effects; MCP tools cross an explicit MCP boundary. |
| Built-in tool | Harness-provided `read`, `write`, `edit`, `glob`, `grep`, `list`, or `bash` capability, disabled unless an agent explicitly allows it. |
| Skill | Reviewed, versioned instructions and files mounted for an agent. A skill grants no tool authority by itself. |
| Guardrail | Ordered content inspection or transformation at exact model, tool, retrieval, or final-output phases. |
| Governance | Policy evaluation and audit around proposed tool actions. It does not replace business authorization. |
| Approval interrupt | Durable request for an authenticated application decision before a protected tool action continues. It is an interrupted outcome, not an internal server error. |
| Harness storage | Port for sessions, runs, events, idempotency receipts, durable steps, leases, and waits. |
| Memory engine | Scoped application memory port for key/value, list, TTL, text, vector, or hybrid recall. It is not conversation history or a business database. |
| Durable workspace | Checkpointed run files and artifacts used for recovery. It is separate from Harness storage and sandbox execution. |
| Sandbox | Filesystem and optional execution boundary attached through an immutable owner. Capabilities do not by themselves prove isolation. |
| Child task | Workflow-owned isolated agent task with explicit input, status, result, and cancellation. It does not inherit parent conversation history. |
| Durable step | Versioned workflow checkpoint whose committed JSON result can replay without repeating the step function. |
| Host tool | Portable tool declaration whose implementation is bound by the host, such as a PURISTA command invocation with trusted identity. |
| Admission | In-process limit on active model/agent work. Use a durable queue separately when arrivals, retry, or fleet-wide concurrency must survive restart. |

Use these terms in application code and operational documentation so transport,
provider, persistence, and business-authorization responsibilities remain
separate.
