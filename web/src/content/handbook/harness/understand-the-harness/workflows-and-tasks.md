---
title: Workflows and tasks
description: Put deterministic application orchestration around agents instead of hiding it in the model loop.
order: 130
---

A workflow receives typed input and decides which agents and deterministic steps
run. It is the right boundary for multi-agent coordination, application writes,
human review, and durable replay boundaries.

This example routes a policy question through a bounded agent but leaves the
application in charge of any real approval or write.

```ts title="src/policyAnalysisHarness.ts"
import { defineHarness, inMemorySandbox } from '@purista/harness'
import { z } from 'zod'

const input = z.object({ question: z.string().min(1) })
const output = z.object({ answer: z.string() })

export const policyAnalysisHarness = defineHarness({ name: 'policy-analysis' })
	.sandbox(inMemorySandbox())
	.models({
		local: { provider: { id: 'local', genAiSystem: 'local' }, model: 'not-called', capabilities: ['object'] },
	})
	.agent('summarize', {
		model: 'local',
		input,
		output,
		instructions: 'Summarize the policy question.',
		handler: async ({ input }) => ({ answer: `Policy analysis: ${input.question}` }),
	})
	.workflow('answer_with_policy', {
		input,
		output,
		delegation: { agents: ['summarize'] },
		handler: async ctx => ctx.agents.summarize(ctx.input),
	})
	.build()
```

Workflow delegation is disabled by default. Declare the agents a workflow may
call, then set bounded limits when the workflow design needs more than the
default. A background task or external queue is still application-owned
delivery; Harness does not turn a session into a durable broker.

## Keep workflow validation library-neutral

Both `workflow({ input, output })` fields accept any
[Standard Schema](https://standardschema.dev/schema) validator. Workflows are
application orchestration: callers supply `input` and the handler supplies
`output`, so neither field needs Standard JSON Schema or a provider converter.
Zod, ArkType, and ordinary Valibot schemas work directly, including their
defaults and transforms. Use the model-facing wrapper only when the same
schema is also a default-loop agent output or TypeScript-tool input; see
[inputs and structured outputs](/handbook/harness/build-agents/inputs-and-structured-outputs/).

The fluent order is intentional:
[`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/)
starts the composition with a diagnostic name (default `agent-harness`), then
[`.sandbox(inMemorySandbox())`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#sandbox)
explicitly supplies the local files-and-search sandbox before later agent definitions
can request sandbox capabilities. `inMemorySandbox()` has no options and grants
`sandbox.fs` and `sandbox.text_search`: it neither executes or spawns processes nor persists files
or isolates tenants. This handler-only example does not need those stronger
boundaries; bind a suitable application-owned adapter when a workflow actually
does. Then
[`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models)
creates the aliases used by
[`.agent(id, definition)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent).
After the required agents exist,
[`.workflow(id, definition)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workflow)
exposes only registered agent IDs through `ctx.agents` and preserves the
workflow's input and output schemas. Use the plural `.agents(record)` and
`.workflows(record)` forms only for cohesive, non-empty definition records; all
four methods accumulate and reject duplicate IDs. The
[`delegation`](/handbook/api/interfaces/_purista_harness.WorkflowDefinition/#delegation)
allowlist is the important opt-in. [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build)
requires a model registry and rejects invalid agent/model references and
delegation policies before a session runs; it does not make workflow execution
durable by itself. Add call, parallelism, depth, and model alias limits on
[Build a workflow](/handbook/harness/orchestrate-work/workflows/) when the task
can fan out.

The dedicated orchestration chapter owns fan-out, child tasks, durable steps,
retries, compensation, and human review.
