---
title: Write agent instructions and prompts
description: Define one stable model job and map validated input to provider-neutral user messages.
order: 320
---

Instructions tell the standard agent loop what job to perform. The prompt mapper
turns schema-validated input into the user message for that run. Neither one is
an authentication or authorization boundary.

## Write one narrow model job

```ts title="src/harness/classifyCase.ts"
import { defineAgent } from '@purista/harness'
import { z } from 'zod'

const caseInput = z.object({
	summary: z.string().min(1),
	locale: z.enum(['en', 'de']),
})
const caseOutput = z.object({ priority: z.enum(['low', 'normal', 'high']) })

export const classifyCase = defineAgent('classifyCase', {
	model: 'assistant',
	input: caseInput,
	output: caseOutput,
	prompt: input => ({
		role: 'user',
		content: `Locale: ${input.locale}\nSupport case: ${input.summary}`,
	}),
	instructions: [
		'Classify the supplied support case.',
		'Return only the priority required by the output schema.',
		'Do not invent customer, account, or incident details.',
	].join('\n'),
})
```

The `instructions` value is a stable string. The `prompt` function is a pure,
synchronous mapping from validated input to one user message or a list of user
messages. Keep provider clients, database access, memory access, credentials,
and authorization outside both values.

The output schema is the executable result contract. Instructions help the
model produce the intended answer, while schema validation prevents another
shape from reaching the caller.

## Put dynamic work at the right boundary

Use validated input for bounded presentation choices such as the locale above.
Retrieve changing information through an authorized tool. Put deterministic
multi-step orchestration, direct model operations, and application writes in a
workflow. Supply verified tenant and principal identity when the application
opens the session; never infer authority from prompt text or invocation
metadata.

| Need | Owner |
| --- | --- |
| Stable model behavior | Agent `instructions` |
| Model-visible input | Agent `prompt` mapper |
| Valid request and result shape | Agent schemas |
| Authenticated caller and session establishment | Application transport and `getSession(...)` |
| Business authorization | Application command or tool handler |
| Dynamic facts | Authorized tool or workflow |
| Direct provider-neutral model operation | Workflow `models` allowlist |
| Multi-step coordination and approval | Workflow |
| Sensitive-content inspection or transformation | Guardrails at the matching content phase |

Next: [control the model loop](/handbook/harness/build-agents/control-the-model-loop/), then
[define input and output contracts](/handbook/harness/build-agents/inputs-and-structured-outputs/).
