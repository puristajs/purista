# State retention and conversation context

**Status:** implemented, human-approved scope.
**Date:** 2026-08-19

This specification adds bounded, explicit state retention to `@purista/core`
and gives attached Harness agents a durable, coherent conversation-history
policy. It replaces no business-state semantics: raw `StateStore` values remain
permanent unless a caller selects a retention policy.

## Decisions and ownership

| Concern | Owner | Explicit non-owner |
| --- | --- | --- |
| write retention, expiry guarantees, and backend capability | Core `StateStore` | Harness, service handlers |
| service-scoped defaults and per-write override | Core service runtime | a mutable singleton store default |
| conversation turns, history/run/event bounds | Harness + Core agent-state adapter | generic `StateStore` |
| conversation turn admission, ordering, and overlap UX | application/service domain | Harness, generic `StateStore` |
| model input-window selection and token accounting | Harness model/request layer | persistent-store byte limits |
| purge scheduling and application lifecycle | application deployment / explicit PURISTA worker or command | hidden Core interval or Service destruction |

No new AI-specific persistence system is permitted. Attached agents reuse the
service `StateStore` by default. `ai.stateStore` remains the explicit advanced
Harness-native override and takes precedence; it is not silently adapted or
made to claim Core retention guarantees.

## Core retention contract

The exported Core contract SHALL provide:

```ts
type StateRetention =
  | { mode: 'forever' }
  | { mode: 'expire'; ttlMs: number }

type StateWriteOptions = {
  retention?: StateRetention
}

type StateRetentionPolicy = {
  default: StateRetention
}

type StateStoreConfig<T> = StoreBaseConfig<T> & {
  retention?: StateRetentionPolicy
}
```

The exact public names may be refined only to preserve existing Core naming
patterns. Semantics are locked:

1. Resolve the requested value in this order: write option, service instance
   policy, retained-store/view default, then `{ mode: 'forever' }`.
2. A finite policy is never silently ignored. A StateStore instance or view rejects a
   finite write when its store cannot declare atomic expiry; it does not offer a
   best-effort mode.
3. Expiry is calculated from an absolute deadline at each successful write.
   `expire` therefore refreshes on write; reading never refreshes it.
4. Reads never return logically expired state. Physical deletion is native only
   when the adapter declares it, or is performed by an explicit, namespace-
   limited, compare-safe scheduled purge capability. Current three-method
   stores MUST NOT gain an unsafe generic sweeper.

`retention` on a StateStore config sets the instance default. Service
`stateRetention` creates a service-scoped view; it must not mutate a shared
store instance used by another service. Existing `stateStore` wiring and all
string-key / schema-derived handler typing remain intact. `setState` gains an
optional third argument; no separate untyped state API is introduced.

## Backend guarantees

| Backend | Supported guarantee |
| --- | --- |
| Redis | native per-key atomic expiry; every replacing write deliberately reapplies the resolved deadline |
| Dapr | native only with explicit configuration that the deployed component honours `ttlInSeconds`; otherwise finite required retention rejects |
| NATS KV | a dedicated bucket may enforce one fixed bucket lifetime; it does not claim general per-write sliding expiry |
| DefaultStateStore | deterministic local/test expiry only; never production evidence |
| custom adapter | declares native, compare-safe scheduled, or unsupported capability |

Queue result `ttlMs` is an existing public promise and MUST use this same
write path. It either expires under the documented guarantee or fails clearly.

## Agent conversation configuration

`setSessionPolicy({ mode: 'conversation', payloadPath, ... })` opts an agent into a persistent
conversation. `history` applies to either the service-backed adapter or an explicit Harness-native
`ai.stateStore` that implements atomic message replacement. `idleTtlMs`, run,
and event limits apply only to the service-backed adapter. Its safe composition
with the service adapter is:

```ts
retention: {
  idleTtlMs: 30 * DAY,
  history: { maxTurns: 50, maxBytes: 256_000 },
  runs: { maxPerSession: 20 },
  events: { maxPerRun: 500 },
}
```

Persistent conversations use the application's required conversation id and
automatically add trusted tenant and principal message metadata when present.
The application-facing configuration is:

```ts
	agent.setSessionPolicy({
	mode: 'conversation',
	payloadPath: ['conversationId'],
	retention,
})
```

- the conceptual key is `tenantId:principalId:conversationId`, within the
  service/version/agent namespace.
- `conversationId` is required and must be a stable application-owned identifier
  for one logical business conversation.
- trusted non-empty `message.tenantId` and `message.principalId` automatically
  create stricter session separation. With neither present the conversation id
  is the boundary; when only one is present, Core uses a collision-safe stable
  default for the other. No tenancy/session scope option is needed.
- Core does not derive tenant or principal identity from payload data, prompts,
  conversation ids, or unverified headers.

### Published 3.2 migration

Published 3.2 used:

```ts
agent.setSessionPolicy({ mode: 'conversation', payloadPath: ['conversationId'] })
```

The current policy keeps
`agent.setSessionPolicy({ mode: 'conversation', payloadPath: ['conversationId'] })`,
type-checks the payload field, and automatically adds trusted message tenant
and principal metadata when present. No session scope, compatibility shim, or
missing-tenant configuration is required.

- Each persisted artifact receives the configured expiry on a replacing write.
  This bounds inactive state without silently changing a shared service store.
  The complete history value is refreshed when a new turn is committed.
- History is a rolling window of the newest **complete turns**. A turn contains
  the user input, all assistant/tool exchanges, and the terminal assistant
  result. Trimming must never leave an orphan tool call/result or assistant
  message.
- `maxBytes` is an exact UTF-8 storage ceiling, not an approximation of model
  tokens. If the newest complete turn itself exceeds the configured storage
  ceiling, the write fails with a typed retention/state error rather than
  retaining a broken partial turn.
- Run/event bounds retain terminal summaries while trimming intermediate audit
  entries under their respective explicit limits. Active runs are never pruned.
- An absent retention block preserves existing persistent behavior.

Retention and atomic message replacement are durability guarantees, not a
conversation scheduler. Two model calls started from the same history cannot be
made causally ordered by sorting timestamps after they finish. The application
must explicitly decide whether same-conversation turns serialize, are rejected
while a turn is active, or use independent sessions.

## Model context is token-based

Persistent conversation retention and an individual provider request have
different units and lifetimes:

1. The durable policy keeps complete turns and bounds UTF-8 bytes.
2. The selected model request reserves output tokens and determines an input
   budget from the model's declared context window, prompt/instructions, tools,
   current input, and model-specific token counting.
3. Context selection is transient. It may include fewer retained turns for a
   small-context model but MUST NOT delete durable history.

The framework MUST NOT use a bytes-to-tokens heuristic as an admission
guarantee. A token budget is available only when the selected model/provider
offers a compatible counter/limit; otherwise the existing context-length
normalization and explicit context-projection recovery remain the safe path.

## Retry and idempotency

The logical conversation turn is identified by the stable agent invocation
identity derived from the transport message id. Provider retries before any
visible output reuse the same in-memory turn and do not persist messages.
Streaming after the first yielded content is never retried automatically.

Queue redelivery and restart handling must use that same invocation identity:

- a committed successful turn is returned/reused rather than appended again;
- a failed uncommitted turn has no persisted partial transcript;
- message IDs are stable within a logical turn and store duplicate rejection is
  a safety backstop, not the normal retry algorithm;
- final result persistence and turn commit are ordered so a retry cannot append
  an equivalent user/assistant exchange a second time.

Exactly-once model or tool side effects across a process crash are not claimed;
external side effects remain idempotent by their declared command/tool contract.

## Operations, security, and verification

Retention metadata, metrics, traces, and logs contain only scope ids, record
counts, durations, and safe statuses—never state values, prompts, completions,
tokens, or tenant-controlled raw keys. Metrics cover expired reads, native
expiry/scheduled deletion, backlog/oldest due age, retention failures, and
history trimming. Injected stores and explicit purge workers are
application-owned and must be shut down by application lifecycle code.

Acceptance requires Core type tests that prove optional options preserve string
and cascading inference; adapter contract tests for finite/forever resolution;
queue-result TTL coverage; deterministic expiry tests; Harness tests for
complete-turn rolling windows, UTF-8 byte limits, model-token context selection,
and provider/queue retry no-duplicate invariants; plus website, examples,
canonical skills, and public API documentation checks.
