# Spec to Architecture

Use this reference when turning business requirements into a PURISTA-ready design.

## Spec quality bar
A strong spec names:
- business outcome
- actors and responsibilities
- normal flows
- edge and failure flows
- business rules and invariants
- external systems and source-of-truth boundaries
- acceptance criteria

## Architecture synthesis rule
Only choose topology after the business shape is stable enough to explain:
- which capability owns what
- where state changes happen
- where durable workflow is required
- which interactions are synchronous vs asynchronous

## Product-to-service mapping
- one bounded capability -> one versioned service builder
- cross-service or long-running workflow -> queue/worker or orchestrated agent plus deterministic coordinator
- markdown/project truth -> canonical source if the app is workspace-first

## High-value clarification questions
Ask only when they change the architecture:
- who owns approval or cancellation decisions?
- what happens on conflict, duplication, timeout, or external failure?
- what must be durable across restarts?
- what is authoritative when UI state and backend state diverge?

## Anti-pattern
Do not ask the user to choose PURISTA internals too early. Keep the conversation in domain language until the structure is clear.
