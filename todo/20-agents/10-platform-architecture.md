# Agent Platform Architecture

## Proposed modules

- `@purista/ai-core`
  - Base types, contracts, and orchestration runtime.
- `@purista/ai-provider-*`
  - Provider adapters (OpenAI, Anthropic, etc.).
- `@purista/ai-memory-*`
  - Memory adapters (in-memory, redis, vector store).
- `@purista/ai-tools`
  - Typed tool registry and execution sandbox adapters.

## Runtime model

- Agent run = state machine:
  - `init -> plan -> execute step -> evaluate -> continue|finish|fail`
- Each step emits typed lifecycle events.
- Optional human-in-the-loop checkpoints.

## Purista integration points

- Commands can trigger agent runs.
- Subscriptions can trigger asynchronous agent workflows.
- Streams can carry live model output and step events.

## Observability

- Trace span per agent run and per step.
- Metrics:
  - input tokens
  - output tokens
  - total cost estimate
  - tool-call latency
  - failure counts by error type
