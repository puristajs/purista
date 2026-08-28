---
title: Add guardrails
description: Configure ordered, fail-closed input, output, tool, and retrieval checks around a default-loop agent.
order: 710
---

Guardrails are an opt-in `@purista/harness-guardrails` addon. They attach one
ordered interceptor to a default-loop agent; they do not create a model
provider, authorize a caller, deploy a policy server, or retrieve knowledge.
Author the complete policy as one typed TypeScript object in the application
composition root.

| Boundary | Result | Owner |
| --- | --- | --- |
| Content rail | `allow`, `block`, phase-specific `transform` | Guardrails addon |
| Tool permission or policy | `allow`, `deny`, `require_approval`; policies also support `audit` | Harness governance |
| Immediate approval request | `approved`, `rejected` | Application-supplied `GovernanceApprovalProvider` |
| Durable human review | `ExternalWaitOutcome`, then an immutable execution claim and receipt | Application review workflow |

A content `block` never requests approval or suspends a durable workflow.

## 1. Define actions and inline configuration

```sh title="Install the Guardrails addon"
npm install @purista/harness-guardrails
```

`defineGuardrailAction(...)` produces an opaque action token. Its phase,
selector, schema, callback, timeout, and transform permission stay together in
one reviewed declaration. `defineGuardrails(...)` receives the typed action map
and the inline flow order.

```ts title="src/guardrails/supportRails.ts"
import { defineGuardrailAction, defineGuardrails } from '@purista/harness-guardrails'
import { z } from 'zod'

const normalizeQuestion = defineGuardrailAction({
  phase: 'input',
  valueSchema: z.string(),
  evaluate: ({ value }) => ({
    decision: 'transform',
    target: 'user_message',
    value: value.trim(),
    reasonCode: 'question_normalized',
  }),
})

const blockInstructionOverride = defineGuardrailAction({
  phase: 'input',
  valueSchema: z.string(),
  mayTransform: false,
  evaluate: ({ value }) =>
    /ignore (all )?previous instructions/i.test(value)
      ? { decision: 'block', reasonCode: 'instruction_override' }
      : { decision: 'allow' },
})

const removeInternalMarker = defineGuardrailAction({
  phase: 'output',
  valueSchema: z.string(),
  evaluate: ({ value }) => ({
    decision: 'transform',
    target: 'bot_message',
    value: value.replaceAll(/\[internal:[^\]]*\]/gi, ''),
    reasonCode: 'internal_marker_removed',
  }),
})

export const supportRails = defineGuardrails({
  config: {
    rails: {
      input: { flows: ['normalize question', 'block instruction override'] },
      output: { flows: ['remove internal marker'] },
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

An action returns `allow`, `block`, or a phase-specific `transform`. Keep a
`reasonCode` stable and content-free; it is suitable for a metric, trace, or
log, unlike a prompt, matched text, or exception. Codes must match
`^[a-z][a-z0-9_]{0,63}$`.

`config.rails` defaults to `{}`. Each configured phase contains an ordered,
distinct `flows` list. The compiler checks every ID against the action map and
the action's declared phase. Invalid configuration, a missing action, invalid
outcome, thrown action, cancellation, or timeout fails closed.

## 2. Attach rails to the agent

`attach()` retains the normal agent definition and appends the Guardrails
interceptor. It rejects custom-handler agents because their handler owns the
model and tool lifecycle.

```ts title="src/createSupportHarness.ts"
import { defineHarness, type ModelProvider } from '@purista/harness'
import { z } from 'zod'
import { supportRails } from './guardrails/supportRails.js'

export function createSupportHarness(provider: ModelProvider) {
  return defineHarness({ name: 'support' })
    .telemetry({ contentCaptureMode: 'NO_CONTENT' })
    .models({
      support: { provider, model: 'selected-in-composition', capabilities: ['object'] },
    })
    .agents(({ agent }) => ({
      answer: supportRails.attach(agent({
        model: 'support',
        input: z.string().min(1).max(2_000),
        output: z.string(),
        builtinTools: false,
        instructions: 'Answer the support question concisely.',
      })),
    }))
    .build()
}
```

The [Guardrails overview](/harness/guardrails/) is the canonical website
projection for the shared inline-authoring and build-preflight guarantees.

| Call or field | What it controls | Important constraint |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates the named application composition root that will own this agent. | The name is diagnostic only. It does not make the guardrail a caller-authorization policy. |
| [`defineGuardrailAction(...)`](/handbook/api/functions/_purista_harness-guardrails.defineGuardrailAction/) | One typed phase-specific check. | `valueSchema` must match the protected value. `mayTransform: false` forbids transforms even if a callback returns one. |
| [`defineGuardrails(...)`](/handbook/api/functions/_purista_harness-guardrails.defineGuardrails/) | Ordered flows and action map. | Every flow ID must exist once in the action map and match its phase; invalid composition fails closed. |
| [`actionTimeoutMs`](/handbook/api/interfaces/_purista_harness-guardrails.DefineGuardrailsOptions/#actiontimeoutms) | Default budget for an action evaluation. | Use a finite value below the run deadline; timeout is a failed control, not an allow. |
| [`supportRails.attach(...)`](/handbook/api/classes/_purista_harness-guardrails.Guardrails/#attach) | Adds the ordered interceptor to a default-loop agent. | It cannot attach to a custom `handler` agent, because that handler owns the loop. |
| [`.telemetry(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#telemetry) | Content capture policy for the Harness. | Keep `NO_CONTENT` when policy evidence must not retain prompts or completions. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) and [`.agents(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agents) | Register the alias before the default-loop agent and retain the attached agent definition for build-time checks. | `object` fits the declared schema. Declare only capabilities and tools the selected model and reviewed agent actually need. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates cross-registry references before returning the runnable Harness. | A missing alias or invalid agent definition fails before content can reach a provider; policy callbacks still need their own bounded execution tests. |

## Phase coverage

The [Guardrails overview](/harness/guardrails/) owns the shared five-phase
matrix, timing, transform targets, and composition guarantees. This guide
focuses on authoring actions and attaching the resulting interceptor.

Tool-input and tool-output actions must declare a nonempty `tools` selector.
Use `valueSchema` for the exact protected value. The schema validates without
coercing, defaulting, stripping fields, or transforming JSON. Guardrails do not
recursively inspect arbitrary tool JSON: bind a reviewed codec to the exact
string field when a tool input or output needs inspection.

The standard sensitive-data actions come from
`createSensitiveDataActions({ detector })`. Configure their selected policies
inline under `config.sensitiveData` with camelCase `maskToken` and
`scoreThreshold`; see [Select a privacy detector](/handbook/harness/secure-and-govern/privacy-detectors/).

## Compose content checks and approval

The executable [Guardrails example](https://github.com/puristajs/harness/tree/main/examples/guardrails)
combines input, tool, and final-output rails with governance on one agent.
The focused [bank governance example](https://github.com/puristajs/harness/tree/main/examples/bank-governance)
shows immediate approval. Static `require_approval` permissions and policy
approval demands use the same provider, invoked once for the collected demands.

Policy predicates, approval, audit, and rail callbacks have finite budgets and
receive an effective `signal` and `deadline`. Honour both. Set the Harness
callback budget with `.defaults({ decisionTimeoutMs: 2_000 })`; rails retain
the `actionTimeoutMs` default and per-action `timeoutMs` cap. A late approval
cannot start the handler, and a later rail cannot revoke an admitted effect.
For a human response that may take minutes or days, use
[durable human review](/handbook/harness/orchestrate-work/human-review/).

## Errors, evidence, and tests

Import `DecisionBlockedError` and `DecisionEvaluationError` from
`@purista/harness`. A block is an expected decision; an evaluation failure
means the control could not complete safely. Use canonical `DecisionEvidence`
and stable `reasonCode` or `failureKind`, never exception text, prompt, matched
text, tool input, or reviewer comment.

Direct model calls and custom-handler agents own their own release boundary;
`attach()` does not cover them. Rails do not inspect opaque provider reasoning
and cannot retract content already released by custom code.

Use deterministic actions and a fake provider to prove the flow: an allowed
input reaches the provider, a transformed input reaches it in transformed form,
and a blocked input reaches neither model nor tool. Also test a missing action,
an invalid action result, an action timeout, detector failure, and build
preflight for a missing selected model or tool. These tests prove enforcement
and composition; use [evaluations](/handbook/harness/test-and-evaluate/evaluate-prompts-and-outputs/)
to measure model quality.
