---
title: Production-Ready Agents
description: Build reliable PURISTA agents with explicit definition, durable execution, reflection, approvals, and trajectory-aware tests.
order: 203706
---

# Production-Ready Agents

Production-ready PURISTA agents are not "prompt wrappers." They are robust, observable, and testable workloads that follow the same explicit lifecycle as any other part of a PURISTA application.

This guide covers the key principles and features that help you build agents ready for real-world use cases.

## The Production Baseline

For any agent intended for production, consider these features as your default starting point:

- **Queued Durable Execution**: All PURISTA agents are queued workers by default, providing durability and streaming.
- **Durable Run State**: Use `context.memory.run` to track plans, checkpoints, and the final status of an agent's work. This is crucial for observability and recovery.
- **Explicit Policies**: Define policies for execution and retries in the `AgentQueueBuilder`. This makes agent behavior predictable.
- **Allowlisted Access**: Strictly define which tools and child agents can be invoked using `canInvoke` and `canInvokeAgent`.
- **Structured Error Handling**: Use `HandledError` for expected business failures and let the framework manage unexpected ones.
- **Trajectory Testing**: Write tests that assert the agent's execution path, not just its final output.
- **Connected Tracing**: Ensure that traces (`traceId`) and security contexts (`tenantId`, `principalId`) are propagated correctly across all calls.

## 1. Define Policy in the Builder

The `AgentQueueBuilder` is where you define the agent's contract and its operational policies. This makes the agent's behavior inspectable and predictable before it even runs.

### Execution and Retry Policies

- `setExecutionPolicy({...})`: Controls the behavior of queued agents, including recovery strategies and how they handle concurrent requests.

```ts
.setExecutionPolicy({
  maxModelSteps: 10,
  maxToolCalls: 8,
  leaseTtlMs: 30_000,
  heartbeatIntervalMs: 10_000,
  maxAttempts: 3,
})
```

## 2. Implement Robust Orchestration in the Handler

The handler's job is to orchestrate the workflow using the capabilities defined in the builder.

### Durable Run State

Use `context.memory.run` to create a durable, observable workflow. This is more than just logging; it's a stateful record of the agent's execution that can be resumed after a failure.

```ts
const run = await context.memory.run.start({
  title: 'Support Orchestration',
  phase: 'planning',
});

await run.plan([
  { id: 'triage', title: 'Classify Urgency' },
  { id: 'faq', title: 'Load FAQ Guidance' },
]);

await run.step('triage', async () => {
  // ... perform triage
});

await run.finishSuccess('Completed');
```

For single-agent autonomous planning, prefer `context.plan.generate(...)` followed by `context.plan.execute(...)` over manually generating plan JSON and looping tasks in the handler. The planner layer persists the plan into run-state and emits the reserved `purista-ai:*` task artifacts automatically.

## 3. Handle Errors Gracefully

Robust error handling is critical in production.

- **`HandledError`**: Throw a `HandledError` for predictable business failures (e.g., invalid input, policy violation). This communicates a controlled failure to the caller and avoids unnecessary retries for non-transient issues.

  ```ts
  import { HandledError, StatusCode } from '@purista/core';

  if (!payload.prompt) {
    throw new HandledError(StatusCode.BadRequest, 'Prompt is required.');
  }
  ```

- **Error Propagation**: PURISTA ensures that errors from tools and child agents are propagated correctly, preserving their original status.

## 4. Test the Agent Behavior

A key aspect of production-ready agents is deterministic testing. Focus tests on:

- The correct tools and child agents were called
- Expected run state was emitted
- The agent reached the expected final state

## 5. Follow the PURISTA Lifecycle

Always remember the separation of concerns:

1.  **Definition (Builder)**: Define the contract, including schemas, allowed tools, and policies.
2.  **Implementation (Handler)**: Orchestrate the business logic using the `context` object.
3.  **Instance Creation (`getInstance`)**: Provide the concrete runtime dependencies like model providers, stores, and skills.
4.  **Adaptation (Edge)**: Adapt to external systems like HTTP servers or the Vercel AI SDK at the boundary, keeping the core logic clean.

By following these principles, you can build PURISTA agents that are not only powerful but also reliable, observable, and ready for production.

## Related Guides
- [Agent Builder](./agent-builder.md)
- [Handler Context](./handler-context.md)
- [Durable Run State](./run-state.md)
- [Agent Testing](./testing.md)
- [Runtime](./runtime.md)
