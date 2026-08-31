---
title: Write instructions and use agent context
description: Define the model-facing job, derive bounded per-run instructions, and use each custom-handler context field for its intended responsibility.
order: 320
---

Instructions tell the default model loop what job to perform. They are not
authentication, authorization, tenant isolation, tool permission, or output
validation. Put enforceable rules in schemas, application authorization,
governance, Guardrails, and tool handlers.

Start with one stable instruction string. Use dynamic instructions only when a
small, trusted run value must change the wording.

## 1. Write one narrow model job

```ts title="src/harness/supportInstructions.ts"
export const supportInstructions = [
	'Classify the support case from the supplied summary.',
	'Return only the priority required by the output schema.',
	'Do not invent customer, account, or incident details.',
].join('\n')
```

```ts title="src/harness/classifyCase.ts"
classify_case: agent({
	model: 'assistant',
	input: caseInput,
	output: caseOutput,
	instructions: supportInstructions,
})
```

The output schema remains the executable contract. A sentence such as “return
only low, normal, or high” helps the model, but only schema validation prevents
another value from reaching the caller.

Good instructions define:

- the single job and the supplied source of truth;
- the expected level of detail;
- how to behave when input is insufficient;
- domain terminology the model needs to interpret the request.

Do not put credentials, full customer records, access-control lists, hidden
provider configuration, or unreviewed retrieved documents into reusable
instructions. A prompt statement such as “only administrators may refund” does
not prove who the caller is or prevent a tool call.

## 2. Derive instructions from trusted run context

An instruction callback is useful when the application supplies a small,
trusted mode or locale through validated input or invocation metadata.

```ts title="src/harness/createAnswerAgent.ts"
answer_case: agent({
	model: 'assistant',
	input: answerInput,
	output: answerOutput,
	instructions: ({ input, metadata }) => {
		const channel = metadata.channel === 'internal' ? 'internal' : 'customer'

		return [
			`Write a ${channel}-facing support answer.`,
			`Use the requested locale: ${input.locale}.`,
			'Use only facts supplied through approved tools.',
		].join('\n')
	},
})
```

[`AgentDefinition.instructions`](/handbook/api/types/_purista_harness.AgentDefinition/#signature)
accepts a string or a synchronous `(context) => string` callback. Harness calls
the callback once for a default-loop run after validating the input. It then
appends the index of explicitly bound skills and reconstructs the system
message for that invocation. Stored system messages are not replayed as another
instruction block.

The callback is synchronous. Do not start database, memory, network, or file
I/O inside it. Retrieve and authorize dynamic data in the application,
workflow, or a typed tool, then pass only the bounded fact the instruction
needs.

| Dynamic-instruction field | Value | Appropriate use |
| --- | --- | --- |
| `input` | Schema-validated agent input | Select wording from a small enum or validated locale. Do not treat a user-provided role/tenant field as verified authority. |
| `sessionId` | Application-selected session ID | Correlation when necessary; avoid placing it in model content unless it has model-visible meaning. |
| `runId` | Harness run identity | Correlation; normally keep it out of the prompt. |
| `history` | Read-only conversation-history facade | The callback cannot await `history.list()`. Use configured history automatically or a workflow/tool for asynchronous preparation. |
| `memory` | Scoped memory facade | The callback cannot await memory I/O. Use a workflow/tool/custom handler for retrieval. |
| `metadata` | Invocation metadata from application code | Select a bounded mode from an allowlist. Metadata is not authenticated identity. |
| `metrics` | Run-scoped metric helpers | Avoid instruction-side metrics; record application decisions in handlers where success/failure is explicit. |

If wording must change between model turns, use
[Control the model loop](/handbook/harness/build-agents/control-the-model-loop/) instead of rebuilding
authority inside instructions.

## 3. Use the custom-handler context

An agent with `handler` bypasses the default model/tool loop. The handler owns
its deterministic logic and any direct model calls. It receives the validated
input plus run-scoped capabilities.

```ts title="src/harness/handleSupportSummary.ts"
summarize_case: agent({
	model: 'assistant',
	input: summaryInput,
	output: summaryOutput,
	instructions: 'Summarize the support case.',
	handler: async ctx => {
		const response = await ctx.models.assistant.object(
			{
				messages: [{ role: 'user', content: ctx.input.caseText }],
				schema: summaryJsonSchema,
			},
			ctx.signal,
		)

		ctx.metrics.counter('support.summaries.completed', 1, {
			channel: String(ctx.metadata.channel ?? 'unknown'),
		})

		return response.object
	},
})
```

Custom handlers do not automatically execute `instructions`, tools,
permissions, governance policies, skills, or agent Guardrail interceptors. The
example supplies its own model messages and schema. Use the default loop when
you want those configured agent features to run together.

| Handler field | What Harness provides | Use it for |
| --- | --- | --- |
| `input` | Validated and transformed agent input | Deterministic business logic or direct model request construction. |
| `models` | Capability-filtered handles keyed by registered alias | Direct provider-neutral text, object, stream, embedding, or rerank operations supported by that alias. |
| `signal` | Combined caller/run timeout cancellation signal | Pass it to model handles and external dependencies; stop before starting another effect after abort. |
| `sessionId` | Current logical session ID | Scope application correlation; do not use it as proof of caller identity. |
| `runId` | Current run ID | Idempotency/correlation for an application dependency that supports it. |
| `history` | Previous persisted conversation messages | Read earlier turns. The current turn is committed only after the handler succeeds. |
| `memory` | Session/run/agent-scoped memory facade | Read or write through the configured engine and its declared capabilities. |
| `metadata` | Trusted JSON-compatible invocation facts | Route a bounded mode or policy input. It is not a credential or principal. |
| `metrics` | Run-scoped counter, histogram, and duration helpers | Record low-cardinality application outcomes. |
| `output` | Optional type field, not populated when the handler starts | Do not depend on it for handler input; return the candidate output instead. |

The handler's returned value is validated against `output` before the
invocation resolves. An exception or invalid result follows the
[agent failure boundary](/handbook/harness/build-agents/errors-and-failure-behavior/).

## Keep each concern at its enforceable boundary

| Need | Correct owner |
| --- | --- |
| Stable model behavior | Agent instructions |
| Valid request/result shape | Agent schemas |
| Authenticated caller and session admission | Application transport and `getSession(...)` binding |
| Tool authority | Tool allowlist, permissions, governance, and handler authorization |
| Retrieved documents | Authorized retrieval tool/workflow plus content controls |
| Persistent facts | Configured memory engine or application data store |
| Multi-step coordination and approval | Workflow |
| Sensitive-content inspection/transformation | Guardrails at the exact content phase |

Next: [control the model loop](/handbook/harness/build-agents/control-the-model-loop/), then
[define input and output contracts](/handbook/harness/build-agents/inputs-and-structured-outputs/).
