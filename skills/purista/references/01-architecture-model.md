# Architecture Model

Use this reference when shaping requirements before writing code.

## Architecture First
Start in domain language:
- business capability
- owner and invariants
- source of truth
- external systems
- sync vs async interactions
- durability and retry requirements
- tenant, principal, authorization, privacy, and audit requirements
- confidential or PII fields that must not cross broad boundaries
- user-facing delivery shape

Only choose packages, routes, queues, or agents after those choices are clear.

## Service Ownership
A PURISTA service is a versioned domain container. It owns:
- commands and subscriptions for that capability
- streams for incremental capability output
- queues and workers for durable capability work
- resources such as repositories, API clients, and domain adapters
- config and runtime requirements
- optional attached agents for model-driven work inside that domain

Do not create an agent as an unowned global primitive when the work belongs to a business capability. Attach it to the owning service unless there is a deliberate cross-domain orchestration reason.

## Truth Hierarchy
Keep truth layers explicit:
- deterministic domain state and external source-of-truth systems
- persisted workflow/run state
- emitted events and projections
- streamed progress
- model output, summaries, and conversation history

Agents may propose, classify, synthesize, and orchestrate. Deterministic services should apply canonical mutations.

## Security And Privacy Ownership
Every capability design must name:
- who can call it (`principalId`, service identity, or external client)
- which tenant or data boundary it operates inside
- which fields are public, internal, confidential, PII, regulated, or unsafe for model/provider exposure
- which guard rejects missing or unauthorized identity before handler logic
- which resource/store enforces tenant scoping and least privilege
- what is safe to emit in events, queue payloads, streams, logs, metrics, traces, and audit records

Prefer narrow privacy-preserving contracts. Emit identifiers and non-sensitive summaries broadly; let authorized consumers fetch sensitive detail through guarded commands/resources.

## Primitive Selection
- command: direct action with one result
- subscription: bounded reaction to an event
- stream: incremental response or SSE/aggregate transport
- queue: durable work that needs leases, retries, delays, or dead-letter handling
- schedule: time-trigger declaration that emits an event from a separate Core scheduler host
- agent: model loop, tool use, conversation, or harness workflow

## Time-Triggered Work
PURISTA Core owns a minimal trigger-only Scheduler Runtime. Deploy it separately from business services with a selected provider; Kubernetes CronJob, Temporal, AWS EventBridge Scheduler, or another scheduler remain valid external clock choices.

Default architecture:

```text
Core Scheduler Runtime with a selected scheduler provider
  -> PURISTA event target
  -> subscription or event-to-queue binding
  -> queue worker for long-running work
```

The Core runtime accepts event targets only. It emits no business payload and never invokes handlers, queues, or agents directly. Prefer an event such as `billing.monthlyCycleDue`, then use a subscription or event-to-queue binding. Existing queue/command targets remain export-compatible but are rejected by the Core runtime with migration guidance.

For Kubernetes, export CronJob manifests from schedules. The CronJob runs an explicit trigger container/script supplied by the application/deployment, and that trigger calls PURISTA. Do not invent image names, URLs, secrets, service accounts, namespaces, or auth policy in framework code or generated examples.

Scheduler publication is at-least-once; use `message.schedule.occurrenceId` for downstream idempotency. For duplicate-safe event-to-queue handoff, Redis and NATS queue bridges can enforce strict mode by returning the original enqueue result/job id for duplicate keys. DefaultSchedulerProvider and DefaultQueueBridge are local/test only.

## Architecture Review Questions
- Which service owns this capability?
- What state must survive restarts?
- Which operations need queue-backed durability?
- Which contract is public, internal, or transport-specific?
- Which data must be minimized, redacted, encrypted, tenant-scoped, or excluded from AI/model context?
- Which packages are optional and must not leak into default apps?
- Which generated CLI artifacts can create the initial shape?
