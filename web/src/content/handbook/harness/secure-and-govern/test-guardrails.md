---
title: Test guardrail enforcement
description: Prove ordering, fail-closed behavior, model and detector isolation, and absence of protected side effects.
order: 756
---

Guardrail tests prove that the implementation enforces the declared flow. They
do not prove that a real model classifies content correctly. Keep deterministic
flow tests and live quality evaluations separate.

The first test below proves the most important invariant: when the guardrail
blocks, the protected application model is never called.

## 1. Prove the complete local boundary

Use `FakeModelProvider` in strict mode, deterministic actions, and
`FakeSensitiveDataDetector` when privacy detection participates. Record only
synthetic observations in the fixture.

```ts title="src/guardrails/claimsRails.test.ts"
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'
import { createClaimsHarness } from '../createClaimsHarness.js'

describe('claims Guardrails', () => {
	it('blocks before the application model runs', async () => {
		const assistant = new FakeModelProvider({ strict: true })
		const safety = new FakeModelProvider({ strict: true })
		safety.enqueueObject({
			object: { allow: false },
			usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
			finishReason: 'stop',
		})

		const harness = createClaimsHarness(assistant, safety)
		const session = await harness.getSession('guardrail-block')

		try {
			await expect(session.agents.answer_claim.run('synthetic blocked input')).rejects.toMatchObject({
				code: 'DECISION_BLOCKED',
			})
			expect(assistant.requests).toHaveLength(0)
			assistant.assertExhausted()
			safety.assertExhausted()
		} finally {
			await session.release()
			await harness.shutdown()
		}
	})
})
```

`strict: true` rejects an unexpected provider request. The safety fake receives
one scripted structured response; the application fake receives none.
`assertExhausted()` proves that no expected request was skipped and no extra
response remained hidden in the fixture.

## 2. Cover every control outcome

Add focused cases for:

- allow and every supported transform target;
- multiple actions running in declared order;
- a block skipping later actions, model calls, and tool handlers;
- action timeout, cancellation, thrown callback, and invalid outcome;
- missing selected model/tool and missing sensitive-data policy at build time;
- detector failure and invalid detector result;
- tool selector mismatch performing no inspection;
- output rail running only after schema-valid handler/tool output; and
- content-free errors, logs, spans, metrics, and decision evidence.

## 3. Use the right confidence layer

| Boundary | Proves | Does not prove |
| --- | --- | --- |
| Direct action test | Callback decision/transform for synthetic values | Interceptor order or side-effect prevention |
| Deterministic Harness test | Full rail order, build requirements, provider/tool suppression, normalized failures | Real detector/provider accuracy |
| Detector/provider integration test | Wire contract, platform loading, timeout, and failure mapping | Policy quality across production data |
| Evaluation | False accepts/rejects, segment quality, latency, and cost for a pinned candidate | Deterministic enforcement or adapter isolation |

For privacy fixtures, import `FakeSensitiveDataDetector` from
`@purista/harness-guardrails/testing`. For Presidio wire tests, use
`FakePresidioSidecar` from `@purista/harness-guardrails-presidio/testing`.
Never place real personal data, production prompts, or provider responses in
unit fixtures or snapshots.

Continue with [evaluation datasets and CI](/handbook/harness/test-and-evaluate/evaluation-datasets-and-ci/)
only after the deterministic enforcement suite passes.
