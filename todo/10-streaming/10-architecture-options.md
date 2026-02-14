# Streaming Architecture Options

## Option A: Extend Commands with Streaming Mode

Model:

- Keep command as primary unit.
- Add command execution mode: `request-response | stream`.

Pros:

- Reuses existing command ecosystem.
- Lower conceptual overhead for users.

Cons:

- Command lifecycle becomes more complex.
- Harder to support advanced bidirectional protocols.

## Option B: Introduce Stream Procedure Type

Model:

- New primitive next to command/subscription: `streamProcedure`.
- Explicit lifecycle API and typed chunk contracts.

Pros:

- Clear semantics and clean API boundaries.
- Better long-term evolution for agent and MCP workloads.

Cons:

- New concept for users.
- More migration/documentation work.

## Option C: Stream Over Subscription Channels

Model:

- Reuse subscription infrastructure for stream chunks.
- Correlation ID groups chunk sequence.

Pros:

- Fits broker/event mindset.
- Potentially easier bridge alignment.

Cons:

- Weak request-scoped semantics by default.
- More error-prone for cancellation and strict ordering.

## Recommendation

Start with Option B for strong semantics, but provide compatibility helpers so Option A style ergonomics can be built on top.
