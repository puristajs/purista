# Core PURISTA Mental Model

Use this reference when the model needs the framework fundamentals.

## The four-layer lifecycle
1. Definition: declare service, command, subscription, stream, queue, worker, and agent boundaries with builders.
2. Implementation: attach handler code to those declared boundaries.
3. Configuration: declare config schemas, resources, stores, policies, and bridge requirements explicitly.
4. Instantiation: call `getInstance(...)` with the concrete runtime infrastructure.

## Primary design rule
Start with business capabilities and ownership, then choose the PURISTA primitive that fits the behavior:
- command: direct action
- subscription: reaction to an event or fact
- stream: incremental output
- queue / worker: durable asynchronous execution
- agent: model-driven or conversational orchestration

## Canonical truth rule
Keep a clear hierarchy:
- canonical workspace/domain truth
- deterministic service state and projections
- workflow/readiness summaries
- prompts, agent drafts, and conversational summaries

Never let a weaker layer silently outrank a stronger one.

## Builder snippet
```ts
const pingService = new ServiceBuilder(serviceInfo)
  .setConfigSchema(serviceConfigSchema)
  .defineResource('repository', repositoryResource)
```

## Files to keep explicit
```text
src/
  service/<domain>/v1/
  agents/<agent-name>/v1/
  resources/
  config/
```
