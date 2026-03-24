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

- **Queued Durable Execution**: Use `setExecutionMode('queued')` for any work that is long-running, might fail, or needs to stream progress. This ensures resilience.
- **Durable Run State**: Use `context.memory.run` to track plans, checkpoints, and the final status of an agent's work. This is crucial for observability and recovery.
- **Explicit Policies**: Define policies for execution, quality, and retries in the `AgentBuilder`. This makes agent behavior predictable.
- **Allowlisted Access**: Strictly define which tools and child agents can be invoked using `canInvoke` and `canInvokeAgent`.
- **Structured Error Handling**: Use `HandledError` for expected business failures and let the framework manage unexpected ones.
- **Trajectory Testing**: Write tests that assert the agent's execution path, not just its final output. Use `evaluateTrajectory` for this.
- **Connected Tracing**: Ensure that traces (`traceId`) and security contexts (`tenantId`, `principalId`) are propagated correctly across all calls.

## 1. Define Policy in the Builder

The `AgentBuilder` is where you define the agent's contract and its operational policies. This makes the agent's behavior inspectable and predictable before it even runs.

### Execution and Retry Policies

- `setExecutionPolicy({...})`: Controls the behavior of queued agents, including recovery strategies and how they handle concurrent requests.
- `setRetryPolicy({...})`: Configures automatic retries for transient failures, which is essential for robustness.

```ts
.setExecutionPolicy({
  recovery: 'resume-from-checkpoints',
  httpBehavior: 'attach-and-stream',
})
.setRetryPolicy({
  maxRetries: 3,
  backoff: 'exponential',
})
```

### Agent and Reflection Policies

- `setAgentPolicy({...})`: Defines quality profiles and approval checkpoints. For example, a "synthesis" profile might require a reflection loop, while a "quick" profile might disable it.
- `setReflectionPolicy({...})`: Configures the behavior of self-correction loops (`draft`, `critique`, `refine`), including iteration limits and artifact generation.

```ts
.setAgentPolicy({
  quality: {
    defaultProfile: 'standard',
    profiles: {
      synthesis: {
        reflection: { enabled: true, preset: 'synthesis' },
        verification: { required: true },
      },
    },
  },
  approvals: {
    checkpoints: {
      'publish-response': { required: true },
    },
  },
})
.setReflectionPolicy({
  presets: {
    synthesis: { maxIterations: 2 },
  },
})
```

When `quality.profiles[*].execution` declares limits like `maxModelSteps` or `maxToolCalls`, the PURISTA runtime enforces them automatically.

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

### Explicit Reflection and Approvals

For complex or high-stakes tasks, use explicit reflection and approval steps.

- **Reflection**: Call `context.ai.reflect.run(...)` for tasks that benefit from a draft-critique-refine cycle. This is a traceable, stateful process, not a hidden loop.
- **Approvals**: Use `context.runtime.approvals.wait(...)` to create a durable waiting point for human-in-the-loop verification before proceeding with a risky action.

```ts
const reflection = await context.ai.reflect.run({
  name: 'support-answer',
  draft: async () => await generateDraft(),
  critique: async ({ draft }) => await critiqueDraft(draft),
  accept: ({ critique }) => critique.accepted,
});

if (payload.requireApproval) {
  await context.runtime.approvals.wait({
    checkpoint: 'publish-response',
  });
}
```

## 3. Handle Errors Gracefully

Robust error handling is critical in production.

- **`HandledError`**: Throw a `HandledError` for predictable business failures (e.g., invalid input, policy violation). This communicates a controlled failure to the caller and avoids unnecessary retries for non-transient issues.

  ```ts
  import { HandledError, StatusCode } from '@purista/core';

  if (!payload.prompt) {
    throw new HandledError(StatusCode.BadRequest, 'Prompt is required.');
  }
  ```

- **`UnhandledError`**: Unexpected errors (e.g., a provider outage, a bug in the handler) are automatically wrapped as `UnhandledError`. These are the types of errors that a `retryPolicy` is designed to handle.

- **Error Propagation**: PURISTA ensures that errors from tools and child agents are propagated correctly, preserving their original `HandledError` or `UnhandledError` status. This allows the calling agent to react appropriately.

## 4. Test the Trajectory, Not Just the Output

A key aspect of production-ready agents is deterministic testing. Because LLM output can be variable, you should focus your tests on the **execution trajectory**—the sequence of steps the agent took to arrive at its result.

The `evaluateTrajectory` helper allows you to assert that the agent:
- Called the correct tools and child agents.
- Emitted the expected run state and reflection artifacts.
- Reached the required approval checkpoints.

```ts
import { evaluateTrajectory } from '@purista/ai/testing';

// ... inside your test
const result = await agent.invoke(...);

const evaluation = evaluateTrajectory(result.envelopes, {
  mode: 'any-order',
  tools: [
    { name: 'support.1.lookupFaq', statuses: ['invoked', 'success'] },
  ],
  artifacts: [
    { id: 'run-state', phase: 'any' },
    { id: 'reflection:support-answer:summary', phase: 'final' },
  ],
  requireReflectionSummary: true,
  finalMessage: /Reviewed answer/,
});

expect(evaluation.success).toBe(true);
```

This approach makes your tests more stable and provides much deeper insight into the agent's behavior than simply checking its final text response.

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
