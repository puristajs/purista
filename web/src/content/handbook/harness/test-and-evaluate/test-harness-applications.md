---
title: Test Harness applications
description: Use fake providers and adapter contracts to make agent behavior repeatable.
order: 810
---

Use `FakeModelProvider` from `@purista/harness/testing` or a small scripted
provider; do not require credentials or network access for unit tests.

```ts title="src/case-harness.test.ts"
import { describe, expect, it } from 'vitest'
import { FakeModelProvider } from '@purista/harness/testing'
import { createCaseHarness } from './case-harness.js'

describe('case classifier', () => {
  it('handles the scripted high-priority case', async () => {
    const provider = new FakeModelProvider()
    provider.enqueueObject({
      object: { priority: 'high' },
      usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
      finishReason: 'stop',
    })
    const harness = createCaseHarness(provider)

    try {
      const session = await harness.getSession('case-test')
      await expect(session.agents.classify_case.prompt({ summary: 'Sign-in outage' }))
        .resolves.toEqual({ priority: 'high' })
    } finally {
      await harness.shutdown()
    }
  })
})
```

### What makes this test deterministic

| Call or boundary | What it does | Use it this way |
| --- | --- | --- |
| [`new FakeModelProvider()`](/handbook/api/classes/_purista_harness_testing.FakeModelProvider/) | Creates an in-process [`ModelProvider`](/handbook/api/interfaces/_purista_harness.ModelProvider/) with empty deterministic fallback responses and a public `requests` array. It makes no network call and needs no credential. | Construct a fresh provider for every test. It proves how the Harness asks a provider and how your agent handles a scripted response; it cannot prove provider behavior or answer quality. |
| [`provider.enqueueObject(...)`](/handbook/api/classes/_purista_harness_testing.FakeModelProvider/#enqueueobject) | Adds the next object response to the fake's FIFO queue. The response needs `object`, token `usage`, and `finishReason`; use `enqueueText`, `enqueueTextStream`, `enqueueObjectStream`, `enqueueEmbedding`, or `enqueueRerank` for the matching declared capability. | Queue every expected model interaction in order, then assert `provider.requests` if the test needs to prove a prompt projection, model mode, or tool schema. An unqueued object request returns the fake's empty object fallback, so do not mistake it for a valid model result. |
| `createCaseHarness(provider)` | Application code that must build a Harness with this injected provider and the agent's declared model capability before the test opens a session. The fake is structurally a normal provider, so no cast is needed. | Keep this composition helper production-shaped: models before agents, then `.build()`. Inject the fake only at the provider boundary rather than branching the agent implementation for tests. |
| [`harness.getSession(id)`](/handbook/api/interfaces/_purista_harness.Harness/#getsession) | Opens or resumes the named Harness session and exposes the declared agents. | Use a new session ID for isolated test state. Reuse an ID only when the test intentionally proves retained history, durable execution, or workspace behavior. |
| `session.agents.classify_case.prompt(input)` | Executes the agent's declared non-streaming output mode and validates the input/output contract. | Assert the declared output, expected error, or selected provider request. Use the event stream API for cancellation/streaming tests rather than flattening event behavior into a `prompt` assertion. |
| [`harness.shutdown()`](/handbook/api/interfaces/_purista_harness.Harness/#shutdown) | Releases Harness-owned sessions and adapter resources. | Always call it in `finally`, even for in-memory tests. This keeps later tests from inheriting listeners, timers, or retained adapter state. |

The test has three distinct boundaries:

| Test level | It proves | It does not prove |
| --- | --- | --- |
| Fake provider + Harness | Agent configuration, schema handling, tool/workflow flow, events, and deterministic failure handling | A real provider's output quality, rate limits, pricing, or safety behavior |
| Adapter contract suite | A custom port implementation meets the shared memory, storage, workspace, sandbox, or provider contract | The external service's production topology, credentials, or recovery policy |
| Selected real-adapter test | The configured external dependency can satisfy the chosen integration path | Broad model correctness or every production failure mode |

These tests prove our implementation, not model truth: test tool schemas and
authorization separately, then agent success/failure, workflow fan-out,
cancellation, streaming events, idempotency, durable resume, and review
signals. For skills, assert frontmatter failure, explicit binding, and that
`SKILL.md` is read from the mount rather than inlined into a prompt.

Run `memoryEngineContract`, `harnessStorageContract`, and
`durableWorkspaceContract` for custom adapters. Use fake MCP servers for stdio
executor, cancellation, protocol, and schema cases; use package test fakes for
Presidio/local NER. A live-provider smoke test belongs in a separately labeled
environment with budget, credential, and redaction controls. For factual,
helpfulness, policy, or grounded-answer quality, use
[evaluations](/handbook/harness/test-and-evaluate/evaluate-prompts-and-outputs/),
not a fake-provider assertion.
