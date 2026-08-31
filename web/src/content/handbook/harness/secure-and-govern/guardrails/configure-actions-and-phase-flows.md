---
title: Configure actions and phase flows
description: Add ordered allow, block, and transform actions at the exact content boundary they protect.
order: 752
---

This guide extends the [first guarded agent](../build-the-first-guarded-agent/)
with an input normalization and a final-output redaction. Both values are
transformed before they cross their release boundary.

## 1. Define one action per decision

Keep checks small. The flow order then makes the policy readable and testable.

```ts title="src/guardrails/supportActions.ts"
import { defineGuardrailAction } from '@purista/harness-guardrails'
import { z } from 'zod'

export const normalizeQuestion = defineGuardrailAction({
	phase: 'input',
	valueSchema: z.string(),
	evaluate: ({ value }) => ({
		decision: 'transform',
		target: 'user_message',
		value: value.trim(),
		reasonCode: 'question_normalized',
	}),
})

export const removeInternalMarker = defineGuardrailAction({
	phase: 'output',
	valueSchema: z.string(),
	evaluate: ({ value }) => ({
		decision: 'transform',
		target: 'bot_message',
		value: value.replaceAll(/\[internal:[^\]]*\]/gi, ''),
		reasonCode: 'internal_marker_removed',
	}),
})
```

The transform target is fixed by phase. `input` uses `user_message`, `output`
uses `bot_message`, `tool_input` uses `tool_input`, `tool_output` uses
`tool_output`, and retrieval uses `relevant_chunks`. A mismatched target or a
non-JSON result fails closed.

## 2. Put actions in execution order

```ts title="src/guardrails/supportRails.ts"
import { defineGuardrails } from '@purista/harness-guardrails'
import { blockInstructionOverride, normalizeQuestion, removeInternalMarker } from './supportActions.js'

export const supportRails = defineGuardrails({
	config: {
		rails: {
			input: {
				flows: ['normalize question', 'block instruction override'],
			},
			output: {
				flows: ['remove internal marker'],
			},
		},
	},
	actions: {
		'normalize question': normalizeQuestion,
		'block instruction override': blockInstructionOverride,
		'remove internal marker': removeInternalMarker,
	},
	actionTimeoutMs: 2_000,
})
```

The first input action's transformed value becomes the next input action's
`value`. Output actions work the same way. Flow IDs are case-sensitive,
application-owned names. They must be distinct, exist in `actions`, and refer
to an action declared for that same phase.

An empty `flows` array disables that phase. Omitting a phase also disables it.
There is no implicit default action and installing the addon enables nothing.

## 3. Use the callback context deliberately

| Context field | Available meaning |
| --- | --- |
| `railId`, `phase`, `value` | Current configured action name, lifecycle phase, and immutable protected value |
| `invocationId`, `step` | Exact invocation and zero-based model-loop step |
| `agentId`, `runId`, `sessionId`, `workflowId` | Execution correlation when attached to an agent |
| `toolId`, `callId` | Present for tool phases |
| `modelAlias` | Active application model alias |
| `signal`, `deadline` | Cancellation and absolute action deadline; forward both to nested work |
| `models` | Only model aliases explicitly declared by the action's `models` field |
| `telemetry`, `logger` | Content-safe operational hooks |

Do not log `value`. It may be the prompt, model result, tool arguments, tool
result, or retrieved documents.

## 4. Choose allow, block, or transform

| Result | Use when | Runtime consequence |
| --- | --- | --- |
| `{ decision: 'allow' }` | The current value may continue unchanged | The next action or lifecycle stage receives it |
| `{ decision: 'block', reasonCode? }` | The value must not cross this phase | Harness throws `DecisionBlockedError`; later actions and the protected next stage do not run |
| `{ decision: 'transform', target, value, reasonCode? }` | A reviewed replacement is safe to release | The replacement is validated and passed to the next action |

Set `mayTransform: false` on a check that must never rewrite content. TypeScript
then rejects transform results, and runtime validation still fails closed if an
invalid callback bypasses the type boundary.

Use a transform for a deliberate release policy—not to conceal a validation,
provider, tool, or authorization failure. Agent input is validated before input
rails; transformed input is validated again. Final output rails run on the
candidate and the transformed result is validated against the agent output
schema before the caller receives it.

## 5. Bound failures and verify order

`timeoutMs` overrides the action's budget. Otherwise `actionTimeoutMs` applies;
its package default is 10 seconds. The effective run deadline can make either
budget shorter. Cancellation, timeout, thrown callbacks, invalid decisions,
invalid transform targets, schema mismatch, and transformed-value mismatch are
evaluation failures and fail closed.

Test the actions in flow order with synthetic values, then test the attached
agent with a scripted provider. Assert the provider receives the normalized
input, the caller receives the redacted output, a blocked input produces no
provider request, and a failed action never degrades to allow.

Continue with [protect tool input and output](../protect-tool-input-and-output/)
when a selected tool value needs its own boundary.

API reference: [`GuardrailActionContext`](/handbook/api/interfaces/_purista_harness-guardrails.GuardrailActionContext/),
[`GuardrailOutcome`](/handbook/api/types/_purista_harness-guardrails.GuardrailOutcome/), and
[`DefineGuardrailsOptions`](/handbook/api/interfaces/_purista_harness-guardrails.DefineGuardrailsOptions/).
