# Architecture Options

## Option A: Extend `EventBridge` with queue semantics

**Idea**: reuse the existing EventBridge contract and message routers, adding optional durability/lease responsibilities per command definition.

**Pros**
- Minimal new surface area and reuse of existing transports.
- Commands already expose schemas and hooks; queue flag could be another metadata bit.

**Cons**
- EventBridge guarantees are push-based and mostly fire-and-forget; grafting leases, retries, and back-pressure there mixes concerns.
- Many brokers (MQTT, HTTP bridge) cannot offer durable pull semantics but are still valid EventBridge transports.
- ServiceBuilder would need complex branching logic for sync vs async command registration, increasing risk of regressions.

**Verdict**: rejected. Violates the "isolated things" (Muldar) layering rule because command invocation and durable work scheduling become tightly coupled.

## Option B: Model queues via StateStore (list/stream processing)

**Idea**: leverage the configurable state stores (Redis, NATS KV, etc.) to implement a queue contract (list append + pop + leases) within Purista core.

**Pros**
- Avoids new bridge type; relies on already-pluggable stores.
- Easier to test because everything is pure TypeScript + store adapters.

**Cons**
- StateStore API is key-value centric and lacks delivery semantics, notifications, or visibility timeout hints.
- Would force polling loops in services themselves, duplicating scheduling logic per consumer.
- Hard to optimize for high throughput since store adapters are not tuned for stream delivery semantics.

**Verdict**: rejected. Breaks the single-responsibility boundaries established by Muldar—stores are for configuration/state, not transport.

## Option C: Introduce a dedicated `QueueBridge`

**Idea**: create a parallel abstraction beside `EventBridge`, purposely designed for pull-based durable queues with provider capability detection.

**Pros**
- Keeps command/subscription streaming paths untouched while letting queues evolve independently.
- Allows us to author vendor-specific packages (Redis core lists/BLPOP, SQS, NATS JetStream) similar to existing bridges.
- Can share observability, error handling, and builder ergonomics with existing primitives while honoring CQRS write/read isolation.

**Cons**
- Requires new packages and ServiceBuilder plumbing.
- Need to maintain contract compatibility across providers.

**Verdict**: **Chosen**. Aligns with Purista's modular layering (Muldar): command builders enqueue work, queue bridges own delivery, workers pull and execute in isolation.
