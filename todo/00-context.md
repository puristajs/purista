# Context and Constraints

## Existing model

Purista currently centers around:

- Services
- Commands
- Subscriptions
- Event bridges / brokers
- Request-response and event delivery

## New target areas

1. Streaming support as a first-class concept.
2. Agent/LLM capabilities with strong typing, observability, and provider abstraction.
3. Pull-based async queues that let services offload long-running work while preserving CQRS patterns.

## Global constraints

- Must preserve strong TypeScript typing and inference.
- Must work across bridge integrations (not only one transport).
- Must scale horizontally without cross-instance stream corruption.
- Must keep backwards compatibility where possible.
- Must avoid implicit `any`/`unknown` leaks.

## Non-goals for first iteration

- Perfectly identical low-level stream semantics for every broker.
- Full autonomous multi-agent orchestration at day 1.
- Replacing existing command/subscription model.
