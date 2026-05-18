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

## Primitive Selection
- command: direct action with one result
- subscription: bounded reaction to an event
- stream: incremental response or SSE/aggregate transport
- queue: durable work that needs leases, retries, delays, or dead-letter handling
- schedule: external time-trigger contract that targets an event, queue, or short command
- agent: model loop, tool use, conversation, or harness workflow

## Time-Triggered Work
PURISTA does not own production time. Model schedules as contracts and let Kubernetes CronJob, Temporal, AWS EventBridge Scheduler, or another scheduler own the clock.

Default architecture:

```text
external scheduler
  -> PURISTA event target
  -> subscription or event-to-queue binding
  -> queue worker for long-running work
```

Prefer event targets for business facts such as `billing.monthlyCycleDue`. Use queue targets only when the scheduled trigger is exactly one durable task. Use command targets only for short idempotent logic. Do not target subscriptions directly; subscriptions react to events.

For Kubernetes, export CronJob manifests from schedules. The CronJob runs an explicit trigger container/script supplied by the application/deployment, and that trigger calls PURISTA. Do not invent image names, URLs, secrets, service accounts, namespaces, or auth policy in framework code or generated examples.

For duplicate-safe scheduled handoff, use event-to-queue idempotency. Redis and NATS queue bridges can enforce strict mode by returning the original enqueue result/job id for duplicate keys. DefaultQueueBridge is advisory and should stay local/test only for strict workflows.

## Architecture Review Questions
- Which service owns this capability?
- What state must survive restarts?
- Which operations need queue-backed durability?
- Which contract is public, internal, or transport-specific?
- Which packages are optional and must not leak into default apps?
- Which generated CLI artifacts can create the initial shape?
