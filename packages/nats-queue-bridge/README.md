# @purista/nats-queue-bridge

JetStream-backed queue bridge for PURISTA.

- Durable pull-based queue delivery via JetStream streams and consumers
- Delayed delivery through a scheduled stream
- Dead-letter inspect, replay, and purge support
- Strict idempotency enforcement through JetStream-backed idempotency records

When `idempotencyKey` is provided, repeating enqueue for the same queue and key returns the original `jobId` and does not create another job. Missing keys keep normal enqueue behavior.
