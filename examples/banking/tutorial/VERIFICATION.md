# Verified tutorial scope

Eighteen of 29 planned capability chapters are published. All eleven remaining
AI chapters are represented as page-level draft packets in `course.json`.
The classification packet also has focused source under
`chapters/classification-agent`; its local typecheck, lint, native Harness
tests, command-context tests, and real EventBridge routing test pass against
the release worktrees. The Guardrails packet has focused source under
`chapters/ai-guardrails`; its input-block/provider-suppression and typed
output-transform tests, typecheck, and lint also pass. Both remain draft until
the v4 Framework and v3 Harness
packages can be installed by registry name in a clean consumer replay.

Each published retained project was
built by replaying the written tutorial from a clean directory. The replay runs
the shown PURISTA CLI commands, writes the documented files, executes the shown
tests and builds, and checks the documented HTTP behavior.

| Chapter | PURISTA capability | Application fixture |
| --- | --- | --- |
| `create-project` | Create a project, generate a service and command, and test a command with PURISTA mocks. | `BankProfile` returns a small public profile. |
| `hono-webserver` | Add the Hono webserver, register generated command endpoints, and shut resources down cleanly. | The profile command is available over HTTP. |
| `static-website` | Build and serve a React application from the PURISTA HTTP server. | The UI displays the public profile. |
| `rest-endpoints` | Generate commands and expose their declared HTTP endpoints. | `Transaction` records and reads a small transaction record. |
| `database-resource` | Declare, inject, mock, and manage a database resource. | `Transaction` stores business records in SQLite. |
| `protected-endpoints` | Mark command endpoints public or protected and configure Hono authentication. | Transaction endpoints require a trusted identity. |
| `sessions` | Keep opaque operational sessions in PURISTA StateStore. | `Identity` owns login, logout, and session resolution. |
| `business-guards` | Use before and after guards for business authorization. | `Transaction` checks account action and result scope. |
| `command-transforms` | Transform external input before validation and domain output after execution. | A legacy text record is imported and an authorized transaction is exported as CSV. |
| `external-resources` | Declare, inject, mock, and lifecycle-test a typed external client resource. | `Transaction` imports one synthetic record from a local HTTP provider. |
| `command-result-events` | Name a successful command response and emit a separately declared custom event during execution. | `Transaction` publishes recorded and recording-started facts with different semantics. |
| `subscriptions` | Generate a subscription, filter command result messages, use subscription context mocks, and test real EventBridge routing. | `Monitoring` stores one replaceable operational signal for a qualifying transaction fact. |
| `streams` | Generate a stream, inject a read resource, authorize the business scope, send typed chunks, and test cancellation and Hono SSE transport. | `Analysis` summarizes a small transaction projection for one permitted account. |
| `queue-processing` | Generate a queue and worker, enqueue trusted work, apply business guards, invoke another service, and retrieve stored job results. | `Reporting` creates one short transaction statement in the background. |
| `schedules` | Declare and export scheduled intent, emit a validated occurrence, and bind it to an existing queue. | `Reporting` requests one synthetic daily statement occurrence without owning the clock. |
| `observability` | Declare typed business metrics, wire OpenTelemetry at the composition root, inspect framework traces, and verify a real Collector boundary. | `Transaction` counts successful records and `Monitoring` counts bounded signal-storage outcomes. |
| `retrieval-ingestion` | Generate a queue and worker, inject embedding and PostgreSQL resources, and test transactional pgvector ingestion. | `Knowledge` accepts one reviewed fictional policy revision and stores scoped chunks. |
| `distributed-runtime` | Split services into independent processes, select adapters by declared capabilities, and verify real EventBridge, subscription, queue, health, restart, and shutdown boundaries. | `Transaction`, `Monitoring`, and `Reporting` run as separate Node.js processes over NATS JetStream. |

Example Bank is the application name, not a service boundary. Published
checkpoints introduce the narrow `BankProfile`, `Identity`, `Transaction`,
`Monitoring`, `Analysis`, `Reporting`, and `Knowledge` services only when their
respective Framework capabilities are taught. `Support` remains part of the
draft AI path.
The course recipe rejects `Banking`, `BankingService`, `ExampleBank`, and
`ExampleBankService` as generated service names.

Each `.tutorial-proof.json` records the exact page hashes, final source hashes,
Node version, and replayed actions. The eleventh checkpoint proves 231 documented
actions across 44 cumulative construction pages. The independent
`command-events` baseline uses 29 actions across six pages; the subscriptions
chapter uses 48 actions across ten pages and does not inherit HTTP, UI, session,
transform, or provider code. Fresh consumer verification
installs every retained lockfile outside the monorepo, runs its tests and build,
and starts the compiled application for a loopback smoke check.

The published scope uses SQLite for transaction records and StateStore only for
operational sessions, derived signals, and queue job state. Hono supplies authentication and maps commands from their
builder metadata. Transaction guards make the business authorization decision.
There are no handwritten domain API routes and no application-wide banking
service.

The command transform checkpoint includes the current Framework-source Hono
archive documented by that chapter. Its portable lockfile installs the archive
from `vendor/`; it does not depend on a workspace link. The HTTP verification
checks the transformed CSV response and its declared media type.

The external-resource checkpoint declares `LegacyTransactionClient` on the
`Transaction` builder, supplies its PURISTA `HttpClient` adapter at the
composition root, and resolves the fixture token through `SecretStore`. Fast
command tests use typed fakes. A separate integration command starts the pinned,
loopback-only Docker Compose provider, exercises the generated protected Hono
endpoint, and always removes the provider again.

The command-result checkpoint uses `setSuccessEventName` for the final validated
`transaction.recorded.v1` response. A separate `canEmit` declaration publishes
`transaction.recording.started.v1` from inside the handler. Runtime tests prove
the result is not emitted manually, a failed repository write receives no named
success response, and the custom event retains its own validated contract.

The subscription checkpoint generates the `Monitoring` service and its
`observeLargeDebit` subscription with the PURISTA CLI. It matches the named
`CommandSuccessResponse`, sender, and tenant, validates a narrow consumer-local
payload, and stores one deterministic derived signal in StateStore. Transaction
records remain in the injected SQLite resource. Direct context tests cover
threshold decisions, repeated delivery, and store failure; real
`DefaultEventBridge` tests cover matching and ignored sender/event/tenant cases.

The stream checkpoint generates the narrow `Analysis` service and its
`summarizeTransactions` stream. `Analysis` declares a read-only transaction
projection resource instead of reaching into the `Transaction` service or its
database adapter. A business guard checks the trusted tenant and principal
against the requested account before the reader runs. Direct tests cover the
guard, typed progress, final output, resource failure, and writer cancellation;
service tests cover registration and lifecycle; a real Hono test covers the
protected generated SSE route, typed chunks, and response completion. The clean
replay completed 154 documented actions across 32 pages, and the final retained
application passes 33 server tests.

The queue checkpoint generates the narrow `Reporting` service, its
`generateStatement` queue and worker, and protected commands for enqueueing work
and reading job status. The producer guard authorizes the requested account and
the worker guard checks that access again before invoking the owning
`Transaction.getTransaction` command. A dedicated StateStore-backed
`QueueJobStore` contains only operational job state and small results;
transaction records remain in the injected SQLite resource. Tests cover typed
enqueueing, trusted identity headers, retry, fatal dead-letter handling, result
storage, generated HTTP acceptance, and the real `DefaultQueueBridge` loop. The
clean replay completed 162 documented actions across 32 pages. The final
retained application passes 38 server tests and four UI tests.

The schedule checkpoint keeps scheduled statement work in the existing narrow
`Reporting` service. It exports a provider-neutral schedule contract with the
PURISTA CLI, protects the generated trigger command with an account-level
business guard, emits one validated occurrence event, and maps that event to
the existing `generateStatement` queue. The occurrence id is advisory
idempotency input for `DefaultQueueBridge`; repeated delivery remains visible
and enqueues twice. Tests also prove manifest metadata, trusted identity
propagation, and enqueue failure intent. No in-process cron runner is included
or implied. The clean replay completed 180 documented actions across 36 pages.
The final retained application passes 47 server tests and four UI tests.

The observability checkpoint extends the independent subscription application.
`Transaction` and `Monitoring` declare bounded `app.*` metrics on their existing
service builders, while the composition root owns the OpenTelemetry processor,
Meter, exporters, and shutdown order. In-memory SDK tests prove successful and
failed framework spans and metrics without payload or identifier attributes. A
separate Docker Compose check sends the same evidence through a pinned,
loopback-only Collector, removes trusted tenant and principal trace attributes,
and checks its debug receipt. The clean replay completed 74 documented actions
across 14 pages. The final retained application passes 26 server tests; the
Collector integration test also passes and always removes its container.

The distributed-runtime checkpoint extends the same independent observability
application. Separate composition roots start `Transaction`, `Monitoring`, and
`Reporting` in three Node.js processes, with a distinct NATS EventBridge
connection per process. NATS JetStream supplies durable command, event,
subscription, queue, and operational StateStore boundaries; SQLite remains the
owner of transaction records. Capability checks reject unsupported stream and
pending-command-cancellation requirements before startup. The real integration
test proves request/reply, named command result delivery, strict queue
idempotency, stored job results, durable recovery after the Monitoring process
restarts, process health, ordered shutdown, and a clear unavailable-broker
failure. The clean replay completed 110 documented actions across 18 pages and
37 tests; Compose always removes its NATS volume and network.

The retrieval-ingestion checkpoint starts from the independent authenticated
HTTP baseline and generates the narrow `Knowledge` service, its
`ingestKnowledge` queue and worker, and its protected producer command. A
collection-level business guard runs before enqueueing and the worker checks
the trusted tenant, principal, and collection again before processing. The
worker uses declared embedding-provider and repository resources, validates
vector count, dimensions, finite values, and cancellation, and returns bounded
queue results. PostgreSQL with pgvector owns document revisions and chunks;
StateStore contains only queue job state. Transactional tests cover atomic
replacement, rollback, stale revisions, withdrawal, and tenant, collection,
and model scope. A real Hono-to-queue-to-database test covers authentication,
business authorization, and successful ingestion. The clean replay completed
161 documented actions across 32 pages. Nineteen server test files with 34
fast tests, five PostgreSQL tests, four UI tests, and both builds pass.

Run the provenance check with:

```sh
npm run check:source --prefix examples/banking
```

To verify one retained chapter and its prerequisite chain during isolated
maintenance, run:

```sh
node examples/banking/tutorial/replay.mjs --check --chapter command-transforms
```

The full course check remains the release gate.

Run all retained applications from fresh consumer copies with:

```sh
npm test --prefix examples/banking
```

These examples use synthetic data and loopback HTTP. They do not implement
payments, balances, accounting, regulatory controls, exactly-once side effects,
broker high availability, multi-region operation, or production authentication.
