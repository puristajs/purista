---
title: Test governance policies
description: Prove allowed, denied, approved, unmatched, and failed policy paths without a live model or policy service.
order: 708
---

Governance tests verify application control flow. They do not judge whether an
LLM produced the correct answer. Use a deterministic model provider, fixed
application state, and a fake approval or evaluator so every test has one
repeatable outcome.

The most important assertion is negative: a denied or failed decision must not
run the protected tool handler.

## Start from the runnable bank example

This page tests the transfer composition built in
[define governance policies](../). The maintained example exposes
`runTransferScenario(...)`, which returns the final balances and the emitted
run events:

```ts title="src/index.test.ts"
import { describe, expect, it } from 'vitest'
import { runTransferScenario } from './index.js'

describe('bank transfer governance', () => {
	it('allows an ordinary transfer', async () => {
		const result = await runTransferScenario({
			from: 'checking',
			to: 'savings',
			amount: 250,
		})

		expect(result.balances['checking']).toBe(4_750)
		expect(result.balances['savings']).toBe(2_750)
		expect(result.events.some(event => event.type === 'approval.requested')).toBe(false)
	})
})
```

This proves the complete path—scripted model proposal, parsed tool input,
governance, handler, and result—without making a network request.

## Prove a deny decision prevents mutation

Use balances as an observable handler effect. If they remain unchanged, the
protected handler did not run:

```ts title="src/index.test.ts"
it('does not run the handler above the hard limit', async () => {
	const result = await runTransferScenario({
		from: 'checking',
		to: 'brokerage',
		amount: 12_000,
	})

	expect(result.balances['checking']).toBe(5_000)
	expect(result.balances['brokerage']).toBe(0)
	expect(result.events).toEqual(
		expect.arrayContaining([
			expect.objectContaining({
				type: 'policy.evaluated',
				effect: 'deny',
				evidence: expect.objectContaining({
					source: expect.objectContaining({ ruleId: 'hard-transfer-limit' }),
				}),
			}),
		]),
	)
})
```

Assert stable rule IDs, effects, reason codes, and state changes. Do not snapshot
tool input, prompts, credentials, or complete provider errors.

## Test approval in both directions

Run the scenario until it returns `ToolApprovalInterrupt`. Assert that the
handler has not run, then resume the same run with an authenticated decision:

```ts title="src/index.test.ts"
it('stops a transfer when approval is rejected', async () => {
	const first = await session.agents.banker.run(largeTransfer)
	expect(first.status).toBe('interrupted')
	if (first.status !== 'interrupted' || first.interrupt.type !== 'tool-approval') {
		throw new Error('Expected tool approval')
	}

	const request = first.interrupt.requests[0]
	if (!request) throw new Error('Expected one approval request')

	await session.agents.banker.run(largeTransfer, {
		resume: {
			type: 'tool-approval',
			runId: first.runId,
			interruptId: first.interrupt.id,
			revision: first.interrupt.revision,
			eventId: 'review-rejected-1',
			decisions: [{ approvalId: request.approvalId, approved: false }],
		},
	})

	expect(transfers).toHaveLength(0)
})
```

Add the corresponding approved case and assert that the handler runs exactly
once. Also test stale revisions, changed decision sets, duplicate resume,
cancellation, expiry in the application review layer, and unauthorized review.

## Test default and precedence behavior

Cover the rules that are easy to change accidentally:

| Case | Expected result |
| --- | --- |
| No rule matches with `defaultEffect: 'allow'` | Handler runs |
| No rule matches with `defaultEffect: 'deny'` | Handler does not run |
| `allow` and `audit` match | Handler runs and evidence is recorded |
| `allow` and `require_approval` match | Approval is requested |
| `require_approval` and `deny` match | Deny wins; approval cannot override it |
| Governance uses `mode: 'shadow'` | Policy is observed but not enforced |

For exposure rules, inspect the request captured by
[`FakeModelProvider`](/handbook/api/classes/_purista_harness_testing.FakeModelProvider/)
and prove a hidden tool was not sent to the model. Exposure is evaluated before
the model proposes a call, so handler-state assertions alone are insufficient.

## Test OPA transport and policy separately

For `@purista/harness-policy-opa`, use `FakeOpaDataApi` to script the exact Data
API envelope and assert the minimized outbound request. Then run the Harness
scenario and prove deny/default-deny suppress the handler while allow admits
it. The fake is strict and does not evaluate Rego.

Use two layers for Cedar or another application-owned evaluator:

1. A unit test calls `evaluate(context)` with a synthetic typed context and
   verifies request mapping, response validation, cancellation, and timeout.
2. A Harness integration test injects a fake evaluator and proves each returned
   effect changes tool execution as expected.

Keep real-OPA/selected-engine tests in a separate integration suite. They may
verify policy deployment and vendor mapping, but ordinary application tests
should remain offline and deterministic. See
[Connect Open Policy Agent](/handbook/harness/secure-and-govern/governance-policies/connect-external-policy-engine/#test-mapping-and-enforcement-separately)
for the fake and maintained real-policy path.

## Run and clean up

```bash title="Run the deterministic suite"
cd examples/bank-governance
npm install
npm test
```

Each test or scenario must release its session and call `harness.shutdown()` in
a `finally` block. This keeps sandbox, storage, and adapter cleanup reliable
when an assertion fails.

The maintained
[bank governance tests](https://github.com/puristajs/harness/blob/main/examples/bank-governance/src/index.test.ts)
cover the normal, approval, hard-limit, and application-state paths. API
reference: [`GovernancePolicyEvaluator`](/handbook/api/interfaces/_purista_harness.GovernancePolicyEvaluator/)
and [`ToolApprovalResume`](/handbook/api/interfaces/_purista_harness.ToolApprovalResume/).
