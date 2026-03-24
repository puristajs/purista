---
name: purista-agent-testing
description: Teach untrained models how to verify builder-defined PURISTA agents and their runtime wiring with public mocks, harnesses, scripted models, and protocol assertions.
topics: [agents, testing, protocol]
phases: [implementation, simulation]
---

# PURISTA Agent Testing

## When to use this skill
Use this skill when writing unit or integration tests for agent behavior, protocol frames, queue parity, or tool loops.

## What this component/package is for
PURISTA ships agent test helpers so tests do not need to hand-roll runtime context, models, bridges, or protocol parsing.

## Core PURISTA concept
Agent tests should verify the builder-defined runtime contract, not only prompt text. The test harness proves that declared skills, resources, stores, tools, and execution modes work once the agent instance is created.

## Builder lifecycle
1. Define the agent and its skills, tools, resources, and runtime behavior.
2. Instantiate the agent in tests with public mocks or harness helpers.
3. Verify protocol frames, tool calls, queue parity, and final outputs against the declared runtime contract.

## Hard rules
- Prefer `createAgentContextMock` for handler-level unit tests.
- Prefer `createAgentTestHarness` for runtime-level and inline-vs-queued parity tests.
- Use `ScriptedModel` or `MockModel` instead of ad hoc fake providers.
- Assert protocol artifacts and tool frames explicitly when the behavior matters.
- Use the grouped context surface in tests, for example `context.ai.*`, `context.invoke.*`, `context.memory.*`, and `context.io.*`.
- When the agent uses reflection, approvals, quality profiles, or child-agent orchestration, assert those contracts explicitly instead of only checking final text.

## Decision rules
- Use context mocks when the handler is the subject under test.
- Use the harness when lifecycle, EventBridge wiring, queue behavior, or provider integration matters.
- Add queue-backed tests when the agent supports durable execution.

## Definition pattern
- Tests should remain traceable to the agent builder’s declared skills, tools, stores, and execution policy.

## Implementation pattern
- Use scripted models to force deterministic model outputs.
- Assert skill loading, tool binding, protocol frames, and child-agent calls explicitly.
- Prefer trajectory assertions for reflection summaries, approval artifacts, budget-failure behavior, and queued replay-visible envelopes when those are part of the contract.
- Verify agent success events against the normalized final agent result payload rather than raw protocol envelopes.

## Configuration pattern
- Test setup should provide the same kind of resources and stores the real instance expects.
- Mocking is allowed, but hidden undeclared dependencies are not.

## Instantiation / runtime wiring
- Tests should create the running agent instance or handler context with explicit runtime resources.
- If an agent declares skills or queue-backed execution, the test should prove that the required runtime pieces are wired correctly.

## Verification cues
- The test harness can trace behavior back to declared builder configuration.
- Inline and queued execution produce compatible observable behavior when both are supported.
- Skills, tools, and references are present only when declared and wired.
- Approval expiry, handled/unhandled error behavior, and policy-enforced execution limits are visible in tests when the agent relies on them.

## Common mistakes / anti-patterns
- Testing only prompt strings and not runtime effects.
- Mocking hidden dependencies the builder never declared.
- Skipping queue parity tests for durable agents.
- Verifying generation but not protocol, tool, or skill behavior.
- Using stale flat-context access such as `context.models` or `context.agents` in new tests.
- Treating worker agents as correct just because they return prose when the real contract is a typed deliverable plus protocol artifacts.

## How this connects to other PURISTA concepts
Agent testing depends on agent builders, runtime context, skills, external bindings, queue execution, protocol rendering, and observability.

## Related skills
- `purista-agents-core` for the current conductor/worker/apply command architecture.
- `purista-agent-runtime` for grouped context, reflection, approvals, and runtime helper usage.
- `purista-observability` for trace, span, and error-contract verification.
- `purista-external-runtime-bindings` when tests cover neutral tool/agent exposure.

## Read if needed
- `packages/ai/src/testing/createAgentContextMock.test.ts`
- `packages/ai/src/builder/AgentBuilder.test.ts`
- `packages/ai/src/runtime/context.test.ts`
- `packages/ai/src/runtime/reflection.test.ts`
- `packages/ai/src/runtime/approvals.test.ts`
- `packages/ai/src/testing/trajectory.test.ts`
- `examples/ai-basic/src/integration/aiSdkMockToolFlow.test.ts`
- `examples/ai-basic/src/integration/httpInteroperability.test.ts`
