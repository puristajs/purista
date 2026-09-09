# Example Bank tutorial roadmap

The course teaches 28 PURISTA Framework capabilities in order. Example Bank is
one small application fixture so the reader can see each capability in context.
Its name never becomes a service name.

## Service ownership

| Service | Capability owner |
| --- | --- |
| `BankProfile` | Small public profile used to start the course. |
| `Identity` | Local identity verification and operational sessions. |
| `Transaction` | Transaction records and business rules. |
| `Monitoring` | Derived signals and event reactions. |
| `Analysis` | Read-only projections and streams. |
| `Reporting` | Background jobs and scheduled requests. |
| `Support` | Classification, tools, Skills, guardrails, and support workflows. |
| `Knowledge` | Ingestion, retrieval, grounded answers, and collection policy. |

Repositories, model providers, and external clients are injected resources.
`StateStore` holds operational sessions, signals, and job state; business
records use a database resource. `Ping` is starter scaffolding only.

## Chapter sequence

| # | Chapter | PURISTA capability | Status |
| ---: | --- | --- | --- |
| 1 | Create a PURISTA project | CLI project, service, command, and command test | published |
| 2 | Use the Hono webserver | HTTP registration and lifecycle | published |
| 3 | Serve a static React website | Static assets through PURISTA HTTP | published |
| 4 | Expose commands as REST endpoints | Generated command endpoints | published |
| 5 | Persist data with a database resource | Typed resource injection and lifecycle | published |
| 6 | Protect generated HTTP endpoints | Authentication and public/protected metadata | published |
| 7 | Handle sessions with StateStore | Operational session state | published |
| 8 | Authorize actions with guards | Before and after business authorization | published |
| 9 | Transform command input and output | Boundary representation transforms | published |
| 10 | Call an external HTTP provider | Client resource, secrets, and failure mapping | published |
| 11 | Publish command results as events | Named results and distinct execution events | published |
| 12 | React to events with subscriptions | Matching, reactions, and repeat handling | published |
| 13 | Stream incremental results | Typed chunks, final values, cancellation, and SSE | published |
| 14 | Process work with queues | Producer, worker, retry, and results | published |
| 15 | Declare scheduled work | Provider-neutral schedule intent | published |
| 16 | Add metrics and tracing | Framework and business observability | published |
| 17 | Run services across processes and adapters | EventBridge, QueueBridge, and StateStore adapters | published |
| 18 | Add a classification agent | Native agent definition, model binding, and guarded use | draft |
| 19 | Apply AI guardrails | Input policy and model-output policy | draft |
| 20 | Build a complete RAG pipeline | Embeddings, pgvector, authorized tool, and UI stream | draft |
| 21 | Persist and manage conversation history | Sessions, bounded transcripts, export, and deletion | draft |
| 22 | Give an agent PURISTA tools | Address-first tools and effect limits | draft |
| 23 | Load agent Skills | Trusted bindings and untrusted Skill content | draft |
| 24 | Pause a workflow for human review | Durable wait, authorization, and resume | draft |
| 25 | Run specialist agents in parallel | Child tasks, bounded fan-out, and merge | draft |
| 26 | Build a multi-step agent workflow | Typed steps, retry, checkpoints, and output | draft |
| 27 | Run analysis in a sandbox | Policy, workspace, limits, and cleanup | draft |
| 28 | Evaluate agent behavior | Deterministic cases, scoring, and change gates | draft |

## Harness layout for the AI chapters

AI chapters use the same Framework service layout as the first 17 chapters.
Definitions live under the owning versioned service:

```text
src/service/<service>/v<version>/harness/
  agent/<name>/
  workflow/<name>/
  tool/<name>/
  skill/<name>/
  mcp/<name>/
```

Use `@purista/harness` factories for portable definitions. Use
`ServiceBuilder.defineTool(...)` for tools that need PURISTA service context.
Compose and mount one service-owned Harness definition. Call targets by their
versioned address from commands, streams, queues, or workers. Runtime model,
provider, storage, memory, sandbox, workspace, admission, queue, artifact, and
telemetry bindings belong in application bootstrap.

The classification chapter is the reference packet: CLI generation, native
definition, one service mount, address-first caller, deterministic Harness
test, PURISTA context test, and a local EventBridge test. RAG ingestion remains
deterministic command or worker work; the answer agent calls an authorized
retrieval tool. Browser chat uses AI SDK UI Message Stream v1 and AI Elements.

All 11 AI chapters remain draft until their focused tests and fresh consumer
replay are proven. A draft can be reviewed or checked in isolation, but it is
not counted as a published retained application.

## Completion rules

Every chapter must name the Framework capability first, generate Framework
artifacts before editing them, keep one clear learning outcome per page, and
end each boundary with a test, build, request, or other observable result.
Tests cover success and a denied or failed path. External dependencies use
pinned local fixtures with health checks and cleanup. No page claims paid-model
quality, regulatory compliance, or production banking behavior.

The retained project package locks are outside this lane and are owned by P4-044.
