---
title: Production-Ready Agents
description: Build reliable PURISTA agents with explicit definition, durable execution, reflection, approvals, and trajectory-aware tests.
order: 203706
---

# Production-Ready Agents

Production-ready PURISTA agents are not "prompt wrappers".

They follow the same PURISTA separation as everything else:

1. define the contract with `AgentBuilder`
2. implement the orchestration in the handler
3. create an instance with concrete runtime dependencies
4. adapt only at the transport or SDK edge

That separation matters because robust agents need more than model calls. They need:

- explicit tool and child-agent allowlists
- durable run state
- bounded execution policy
- explicit reflection loops
- optional approval checkpoints
- deterministic tests that assert the execution trajectory

## The Canonical Example

The canonical production example for this handbook lives in:

- [`examples/ai-basic/src/agents/supportAgent/v1/supportAgent.ts`](../../../../../examples/ai-basic/src/agents/supportAgent/v1/supportAgent.ts)
- [`examples/ai-basic/src/agents/supportAgent/v1/supportAgent.test.ts`](../../../../../examples/ai-basic/src/agents/supportAgent/v1/supportAgent.test.ts)
- [`examples/ai-basic/src/agents/supportAgent/v1/schema.ts`](../../../../../examples/ai-basic/src/agents/supportAgent/v1/schema.ts)

It combines:

- queued durable execution
- grouped handler context
- command-backed tool calls
- child-agent escalation
- quality profiles
- reflection through `context.ai.reflect.run(...)`
- approval checkpoints through `context.runtime.approvals.wait(...)`
- example-level trajectory assertions with `evaluateTrajectory(...)`
- focused helper tests in `packages/ai` for reflection, approvals, and trajectory evaluation

## The Design Principles

### 1. Definition Owns Policy

Use the builder to declare:

- what models exist
- what tools and child agents are allowed
- what skills are available
- how the run should behave under failure
- which quality profiles and approval checkpoints exist

That keeps behavior inspectable before the handler runs.

```ts
.setReflectionPolicy({
  enabledByDefault: false,
  presets: {
    synthesis: {
      maxIterations: 2,
      stopOnStagnation: true,
      artifacts: {
        emitArtifacts: true,
        artifactPrefix: 'reflection',
      },
    },
  },
})
.setAgentPolicy({
  quality: {
    defaultProfile: 'standard',
    profiles: {
      quick: {
        reflection: { enabled: false },
      },
      synthesis: {
        reflection: {
          enabled: true,
          preset: 'synthesis',
          maxIterations: 2,
        },
        verification: { required: true },
      },
    },
  },
  approvals: {
    checkpoints: {
      'publish-response': {
        required: true,
        when: 'before-final-message',
        timeoutMs: 5_000,
      },
    },
  },
})
```

The builder defines the policy surface. The handler decides when to apply it.
When `quality.profiles[*].execution` declares `maxModelSteps` or
`maxToolCalls`, those limits are enforced by the runtime.

### 1a. Propagation And Error Semantics Must Stay Native

Robust agents do not invent a separate metadata model.

- `tenantId` and `principalId` must survive every tool call, child-agent hop,
  queued handoff, and custom event emission
- child-agent orchestration must reuse the current `traceId`
- handled business failures stay `HandledError`
- unexpected failures stay `UnhandledError`

If a child agent emits a protocol error frame, the caller must reconstruct the
same PURISTA error class from the `handled` flag instead of flattening
everything into a generic failure.

### 2. The Handler Owns Orchestration

The handler should orchestrate:

- conversation memory
- durable run state
- tool execution
- child-agent delegation
- quality policy resolution
- reflection loops
- approval gates

It should not construct providers or runtime dependencies.

```ts
const quality = context.ai.policy.resolve(payload.qualityProfile)
const run = await context.memory.run.start({
  title: 'Support orchestration',
  phase: 'planning',
})

const faqAnswer = await context.invoke.tools.invoke.support['1'].lookupFaq({
  question: userPrompt,
})

const triageSummary = await context.invoke.agents.runText({
  agentName: 'triageAgent',
  agentVersion: '1',
  payload: { prompt: userPrompt, sessionId },
})
```

Grouped context keeps that surface speakable:

- `context.input.*`
- `context.output.*`
- `context.memory.*`
- `context.invoke.*`
- `context.ai.*`
- `context.io.*`
- `context.app.*`
- `context.runtime.*`

### 3. Reflection Must Be Explicit

PURISTA does not auto-wrap every answer in a hidden review loop.

If an agent needs a draft, critique, refine cycle, call it explicitly:

```ts
const reflection = await context.ai.reflect.run({
  name: 'support-answer',
  profile: quality.name,
  draft: async () => await generateDraft(),
  critique: async ({ draft }) => await critiqueDraft(draft),
  accept: ({ critique }) => critique.accepted,
  refine: async ({ draft, critique }) => await reviseDraft(draft, critique),
})

const answer = reflection.output
```

This gives you:

- traceable checkpoints in run state
- protocol artifacts for draft, critique, and summary
- deterministic stop rules
- full control over when the loop is worth the cost
- visible orchestration spans when reflection uses tools or child agents

Explicit `preset` values passed to `reflect.run(...)` win over profile defaults.

### 4. Approvals Should Gate Risky Transitions

High-risk transitions should be modeled as explicit checkpoints.

```ts
if (payload.requireApproval) {
  await context.runtime.approvals.wait({
    checkpoint: 'publish-response',
    detail: 'Review the generated support response before it is sent.',
  })
}
```

This does not create a separate workflow engine. It gives the agent a durable
waiting point with a clear artifact trail. Approval expiry fails the run by
default. External approval writers can use `writeApprovalDecision(...)` and
`getApprovalStateKey(...)`.

### 5. Tests Should Assert The Trajectory

Final text alone is not enough for robust agents.

At the example level, you usually care that the agent:

- emitted run-state artifacts
- emitted reflection and approval artifacts when those features were requested
- produced the expected final answer

```ts
expect(
  evaluateTrajectory(result.envelopes, {
    mode: 'any-order',
    tools: [
      { name: 'support.1.lookupFaq', statuses: ['invoked', 'success'] },
      { name: 'triageAgent.1.run', statuses: ['invoked', 'success'] },
    ],
    artifacts: [
      { id: 'run-state', phase: 'any' },
      { id: 'reflection:support-answer:summary', phase: 'final' },
      { id: 'approval:publish-response', phase: 'final' },
    ],
    requireReflectionSummary: true,
    requireApprovalArtifact: 'approval:publish-response',
    reflection: { name: 'support-answer', minIterations: 2 },
    finalMessage: /Reviewed answer/,
  }).success,
).toBe(true)
```

For focused helper behavior, assert the helpers directly in `packages/ai`:

- [`packages/ai/src/runtime/reflection.test.ts`](../../../../../packages/ai/src/runtime/reflection.test.ts)
- [`packages/ai/src/runtime/approvals.test.ts`](../../../../../packages/ai/src/runtime/approvals.test.ts)
- [`packages/ai/src/testing/trajectory.test.ts`](../../../../../packages/ai/src/testing/trajectory.test.ts)

Those tests are where the runtime contracts for `context.ai.reflect.run(...)`, `context.runtime.approvals.wait(...)`, and `evaluateTrajectory(...)` are verified directly.

## The Production Baseline

If an agent will run in production, treat these as the default baseline:

- Use `setExecutionMode('queued')` for long or failure-sensitive work.
- Use `context.memory.run` for plans, checkpoints, and final status.
- Keep reflection opt-in through quality profiles.
- Use approval checkpoints for irreversible or high-risk outputs.
- Keep tool and child-agent access allowlisted in the builder.
- Make tests deterministic with `ScriptedModel`, state stores, and trajectory checks.
- Verify traces show `ai.tool_call:*` and `ai.agent_invoke:*` spans with the
  expected tenant/principal attributes.
- Throw `HandledError` for expected business failures and let unexpected faults
  remain `UnhandledError`.

## Definition, Implementation, Instance, Adapter

### Definition

Definition belongs in the builder:

- schemas
- models
- skills
- resources
- allowed tools
- allowed agents
- execution policy
- reflection policy
- agent policy

### Implementation

Implementation belongs in the handler:

- reading input
- updating conversation memory
- creating and updating durable runs
- invoking tools and agents
- resolving quality profiles
- running reflection loops
- waiting for approvals

### Instance Creation

Instance creation belongs in `getInstance(...)`:

- models
- queue bridge
- state store
- conversation store
- skill resources
- resource values
- event bridge

### Adapters

Adapters belong at the edge:

- HTTP/SSE exposure
- AI SDK runtime bridges
- frontend streaming protocols

Adapters should consume the runtime. They should not own the business logic.

## How To Use The Example

Read the example in this order:

1. [`examples/ai-basic/src/agents/supportAgent/v1/schema.ts`](../../../../../examples/ai-basic/src/agents/supportAgent/v1/schema.ts)
2. [`examples/ai-basic/src/agents/supportAgent/v1/supportAgent.ts`](../../../../../examples/ai-basic/src/agents/supportAgent/v1/supportAgent.ts)
3. [`examples/ai-basic/src/agents/supportAgent/v1/supportAgent.test.ts`](../../../../../examples/ai-basic/src/agents/supportAgent/v1/supportAgent.test.ts)

That sequence mirrors the PURISTA flow:

1. input contract
2. behavior and orchestration
3. production-style verification

## Related Guides

- [Context](./handler-context.md)
- [Durable Run State](./run-state.md)
- [Testing](./testing.md)
- [Runtime](./runtime.md)
- [AI SDK Adapter](./ai-sdk-adapter.md)
