# Example Bank PURISTA tutorial roadmap

This course teaches PURISTA Framework capabilities. Example Bank supplies one
small, continuous application fixture so learners can see the capabilities work
together. The application name never becomes a service name.

## Application composition and capability ownership

`Example Bank` names the complete demo application and its UI. It is assembled
in the composition root; it has no matching PURISTA service. `Hono` is the HTTP
transport service. Repositories, model providers, and external clients are
injected resources. The application behavior belongs to the following focused
PURISTA services:

| Service | Owns |
| --- | --- |
| `BankProfile` | The small public profile used to start the course. |
| `Identity` | Local credential verification and operational sessions. |
| `Transaction` | Transaction records and transaction business rules. |
| `Monitoring` | Derived monitoring signals and monitoring reactions. |
| `Analysis` | Read-only analysis projections and analysis streams. |
| `Reporting` | Background report jobs and scheduled report requests. |
| `Support` | Support classification, routing, tools, and support conversations. |
| `Knowledge` | Knowledge ingestion, retrieval, grounded answers, and collection policy. |

Extend one of these owners when a new artifact uses the same rules and
resources. Introduce another service only when the chapter establishes a new
capability owner. For example, login commands belong to `Identity`, transaction
commands belong to `Transaction`, and retrieval commands and agents belong to
`Knowledge`. Do not add a `BankingService` that coordinates or contains them.
`Ping` is generated starter scaffolding and must not receive application
behavior.

Every root chapter names the Framework capability it teaches. Banking words
belong in short examples, fixture values, and the demo UI. They do not replace
the capability in a chapter title.

## Course sequence

| Order | Chapter | PURISTA capability | Service work |
| ---: | --- | --- | --- |
| 1 | Create a PURISTA project | CLI project, service, command, and command test | Add `BankProfile`. |
| 2 | Use the Hono webserver | Hono service registration and lifecycle | Expose `BankProfile.getProfile`. |
| 3 | Serve a static React website | Static assets through the PURISTA HTTP service | Keep UI outside domain services. |
| 4 | Expose commands as REST endpoints | Generated command endpoints | Add `Transaction` commands. |
| 5 | Persist data with a database resource | Typed resources, persistence, and lifecycle | Give `Transaction` its repository. |
| 6 | Protect generated HTTP endpoints | Public/protected metadata and Hono authentication | Protect transaction commands. |
| 7 | Handle sessions with StateStore | Operational session state | Add `Identity`; keep records in the database. |
| 8 | Authorize actions with guards | Business authorization before and after handlers | Guard `Transaction` actions. |
| 9 | Transform command input and output | Input and output transforms | Adapt transaction boundary formats. |
| 10 | Call an external HTTP provider | Outbound client port, secret injection, and provider failure handling | Extend `Transaction`. |
| 11 | Publish command results as events | Named command results and manual execution events | Extend `Transaction`. |
| 12 | React to events with subscriptions | Event matching, reactions, and repeat handling | Add `Monitoring`. |
| 13 | Stream incremental results | Typed chunks, final values, cancellation, and SSE | Add `Analysis`. |
| 14 | Process work with queues | Producer, queue, worker, retries, and results | Add `Reporting`. |
| 15 | Declare scheduled work | Provider-neutral schedule intent | Extend `Reporting`. |
| 16 | Add metrics and tracing | Framework and business observability | Extend existing owners. |
| 17 | Run services across processes and adapters | Distributed EventBridge, QueueBridge, and StateStore | Deploy existing owners separately. |
| 18 | Add a classification agent (draft) | Service-local agent definition, model binding, typed result, and guarded command use | Add `Support`. |
| 19 | Apply AI guardrails (draft) | Input and model-output content policy | Extend `Support`. |
| 20 | Ingest content for retrieval | Queue ingestion, embeddings, pgvector, and revision policy | Add `Knowledge`. |
| 21 | Build a retrieval-augmented generation agent (draft) | Authorized command tool, grounded output, native stream boundary, and AI SDK UI | Extend `Knowledge`. |
| 22 | Add conversation memory (draft) | Conversation sessions, bounded history, and deletion | Extend `Support`. |
| 23 | Give an agent PURISTA tools (draft) | Model-facing command tools and effect limits | Extend `Support` and invoke existing owners through commands. |
| 24 | Load agent Skills (draft) | Trusted skill binding and untrusted skill content | Extend `Support`. |
| 25 | Pause a workflow for human review (draft) | External wait, review command, resume, and authorization | Extend `Support`. |
| 26 | Run specialist agents in parallel (draft) | Child agents, bounded fan-out, and evidence merge | Extend `Support`. |
| 27 | Build a multi-step agent workflow (draft) | Separate workflow definition, typed steps, retries, checkpoints, and final output | Extend `Support`. |
| 28 | Run analysis in a sandbox (draft) | Sandbox policy, workspace, limits, and cleanup | Extend `Analysis`. |
| 29 | Evaluate agent behavior (draft) | Dataset, deterministic checks, scoring, and change gate | Test existing agents; add no service. |

## Remaining AI chapter packets

The attached-agent chapters are intentionally frozen while the Core/Harness
ownership model is under review. The implementation-ready packet contract is
[AI tutorial rebuild after the attached-agent API redesign](../../../../plans/banking-tutorials/ai-course-rebuild-after-agent-api.md).
It defines the API gate, page-by-page source work, boundary ownership, tests,
and publication criteria for classification, guardrails, RAG, memory, tools,
Skills, workflows, sandboxing, and evaluation.

`retrieval-ingestion` remains published because it uses native commands,
queues, workers, guards, and injected resources. Do not convert deterministic
ingestion into an attached agent. Do not rebuild the other AI chapters until
the approved Framework API exists in Core, the CLI, Handbook, examples, and
canonical skills.

## Definition of done for every packet

- The title and opening paragraphs state the PURISTA capability before the
  Example Bank fixture.
- CLI commands generate every Framework artifact before the lesson edits it.
- Commands, streams, subscriptions, queues, workers, schedules, and agents stay
  on their owning service.
- Hono authenticates and projects generated endpoints; it contains no domain
  handler that bypasses a PURISTA definition.
- Business authorization is a guard on the owning action. Authentication and
  content guardrails are explained as separate boundaries.
- Domain records use an injected database resource. StateStore contains only
  operational session, signal, job, or similar short-lived state.
- Unit tests use PURISTA builder/context helpers and mock resources. At least
  one test proves a denied or failed path caused no protected effect.
- External dependencies use pinned Docker Compose services, health checks, and
  scoped cleanup. The default local path needs no paid credentials.
- The complete project builds, fast tests pass, named integration checks pass,
  and the compiled application passes a capability-specific smoke scenario.
- The chapter remains `draft` until a fresh consumer replay succeeds and its
  retained source matches the page hashes.
