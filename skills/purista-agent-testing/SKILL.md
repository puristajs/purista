---
name: purista-agent-testing
description: Test PURISTA agents with the current harness, context mocks, scripted models, and protocol assertions.
topics: [agents, testing, protocol]
phases: [implementation, simulation]
---

# PURISTA Agent Testing

## When to use this skill
Use this skill when writing unit or integration tests for agent behavior, protocol frames, queue parity, or tool loops.

## What this component/package is for
PURISTA now ships first-class agent test helpers so tests do not have to hand-roll runtime context, models, bridges, or protocol parsing.

## Hard rules
- Prefer `createAgentContextMock` for handler-level unit tests.
- Prefer `createAgentTestHarness` for runtime-level and inline-vs-queued parity tests.
- Use `ScriptedModel` or `MockModel` instead of ad hoc fake providers.
- Assert protocol artifacts and tool frames explicitly when the behavior matters.

## Decision rules
- Use context mocks when the handler is the subject under test.
- Use the harness when lifecycle, EventBridge wiring, queue behavior, or provider integration matters.

## Recommended file/folder structure
```text
src/agents/<agent-name>/v1/
  <agentName>.test.ts
  <agentName>.integration.test.ts
```

## Common implementation patterns
- Capture final output with `finalMessage`.
- Assert run-state artifacts with `getRunStateArtifacts`.
- Reuse shared scripted provider sequences for multi-turn or tool-loop tests.

## Common mistakes / anti-patterns
- Rebuilding custom runtime mocks in every test file.
- Testing only happy-path final text and ignoring tool or protocol output.
- Using real external dependencies when a resource or model double is enough.

## How this connects to other PURISTA concepts
Testing touches resources, event/queue bridges, external runtime bindings, protocol streaming, and durable agent execution.

## Read if needed
- `website/doc/handbook/2_building_business-logic/agent/testing.md`
- `packages/ai/src/testing/createAgentContextMock.ts`
- `packages/ai/src/testing/createAgentTestHarness.ts`
- `packages/ai/src/testing/protocolTestHelpers.ts`
