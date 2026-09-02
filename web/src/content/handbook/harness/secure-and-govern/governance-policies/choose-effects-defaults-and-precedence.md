---
title: Choose effects, defaults, and matching rules
description: Select allow, deny, approval, and audit behavior without creating accidental gaps or overrides.
order: 703
---

After one native deny rule works, decide how unmatched calls and overlapping
rules should behave. These choices determine whether governance acts as an
allowlist, an exception list, or a layered control.

## Choose the unmatched result first

`defaultEffect` applies when execution policies are configured but none of
their rules or evaluators returns a decision.

| Policy design | Configuration | Unmatched call |
| --- | --- | --- |
| Allowlist | Omit `defaultEffect`, or set it to `deny` | Denied |
| Exception list | Set `defaultEffect: 'allow'` | Allowed |

Prefer the default-deny allowlist when only a small set of calls is permitted.
Use an exception list when the tool is normally allowed and a few specific
conditions add a restriction. Do not switch to `allow` merely to hide a
missing or broken policy rule.

```ts title="src/policy/transferGovernance.ts"
createTransferAgentBuilder(provider).governance(({ native, rule }) => ({
	defaultEffect: 'allow',
	policies: [
		native({
			id: 'bank-transfer-policy',
			rules: [
				rule({
					id: 'hard-transfer-limit',
					tools: ['transfer_funds'],
					effect: 'deny',
					when: ({ input }) => input.amount > 10_000,
					reasonCode: 'hard_limit',
				}),
			],
		}),
	],
}))
```

This calls [`HarnessBuilder.governance(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#governance)
after `createTransferAgentBuilder(provider)` has registered the typed tool and
agent.

This is an exception list: ordinary transfers are admitted, while the matching
hard-limit rule denies the occurrence.

## Pick the effect that matches the business result

| Effect | Use when | Handler behavior | Extra configuration |
| --- | --- | --- | --- |
| `allow` | A matching condition explicitly admits the occurrence | May run unless a stronger result matches | None |
| `audit` | The occurrence may run but must produce policy evidence | May run | Configure `audit` to persist the evidence |
| `require_approval` | This exact prepared occurrence needs a bounded decision | Runs only after approval | Configure `approval` |
| `deny` | The occurrence must not run | Never starts | None |

`audit` is an execution effect, not a logging switch. A configured audit sink
receives evidence for all evaluated policy effects, not only rules whose effect
is `audit`.

`require_approval` is not a durable human task. Its provider must answer before
the current decision deadline. Use a persisted workflow wait for a person who
may respond later.

## Account for overlapping rules

Harness evaluates matching rules and applies the strongest effect:

```text title="Governance effect precedence"
deny > require_approval > audit > allow
```

Add a review threshold beside the hard limit:

```ts title="src/policy/transferGovernance.ts"
rule({
	id: 'large-transfer-review',
	tools: ['transfer_funds'],
	effect: 'require_approval',
	when: ({ input }) => input.amount > 1_000,
	reasonCode: 'large_transfer',
})
```

A transfer of `1_500` requests approval. A transfer of `12_000` matches both
rules, but `deny` wins and approval cannot override it.

## Scope a rule to the correct tools

The `tools` selector controls where a rule is eligible and narrows the callback
type:

```ts title="src/policy/transferGovernance.ts"
rule({
	id: 'positive-transfer-amount',
	tools: ['transfer_funds'],
	effect: 'deny',
	when: ({ toolId, input }) => toolId === 'transfer_funds' && input.amount <= 0,
	reasonCode: 'invalid_amount',
})
```

Tool schemas should already reject an invalid amount; the example only shows
the selected callback type. Put shape and format validation in the tool schema.
Use governance for execution policy that remains meaningful after validation.

| Rule field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Stable identity unique within the native policy |
| `description` | no | Short operational meaning for maintainers |
| `tools` | no | Exact target IDs; omission means every available custom and built-in tool |
| `effect` | yes | `allow`, `deny`, `require_approval`, or `audit` |
| `when` | no | Boolean or async predicate; omission means every selected occurrence matches |
| `reasonCode` | no | Stable content-free code matching `^[a-z][a-z0-9_]{0,63}$` |

## Use policy context without trusting model data

The predicate receives one read-only occurrence:

| Context value | Appropriate use |
| --- | --- |
| `toolId`, `input` | Decide from the selected tool and its validated, parsed input |
| `agentId`, `workflowId`, `step` | Limit a rule to an execution path |
| `metadata` | Read scalar invocation metadata supplied by the application |
| `runId`, `sessionId`, `invocationId`, `callId` | Correlate the decision |
| `signal`, `deadline` | Cancel and bound asynchronous checks |

Tool input and invocation metadata are not authenticated identity. Resolve the
principal and tenant at the application boundary, authorize the resource in the
handler, and pass only trusted values needed by the policy. Never copy the
complete `input` into logs or generic audit records.

## Combine policies deliberately

`policies` may contain several native policies and external evaluators. Harness
keeps declaration order for evaluation and evidence, then applies the same
effect precedence across all returned decisions. A callback failure fails the
occurrence closed; later policies do not provide an allow fallback.

Use separate policies when ownership, versioning, or rollout differs. Keep
closely related rules in one native policy when they are released and reviewed
together.

Next, [hide tools and roll out policies safely](/handbook/harness/secure-and-govern/governance-policies/hide-tools-and-roll-out-safely/),
or [request and resume tool approval](/handbook/harness/secure-and-govern/approval-and-audit/) for the review rule.

API reference: [`GovernanceConfig`](/handbook/api/interfaces/_purista_harness.GovernanceConfig/),
[`GovernanceContext`](/handbook/api/types/_purista_harness.GovernanceContext/), and
[`GovernanceDecision`](/handbook/api/types/_purista_harness.GovernanceDecision/).
