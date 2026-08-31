---
title: Build grounded retrieval
description: Keep authorization, retrieval, reranking, and evidence assembly in typed application workflow code.
order: 280
---

Embeddings and reranking are model capabilities, not a hidden agent feature.
The application owns document authorization, vector storage, retention, and the
final bounded evidence set; the Harness owns configured model calls and their
validation, cancellation, and telemetry.

This example answers a support question from documents already authorized for
one tenant. `SupportKnowledge` is deliberately application-owned: it is where
your vector-store adapter enforces tenant filters and returns only safe fields.

```ts title="src/infrastructure/supportKnowledge.ts"
export type SupportEvidence = { id: string; title: string; excerpt: string }

export interface SupportKnowledge {
	searchAuthorizedArticles(input: {
		tenantId: string
		vector: readonly number[]
		limit: number
	}): Promise<readonly SupportEvidence[]>
}
```

```ts title="src/createGroundedSupportHarness.ts"
import { defineHarness, type ModelProvider } from '@purista/harness'
import { z } from 'zod'
import type { SupportKnowledge } from './infrastructure/supportKnowledge.js'

const question = z.object({ tenantId: z.string().min(1), question: z.string().min(1) })
const answer = z.object({ answer: z.string(), citations: z.array(z.string()) })

export function createGroundedSupportHarness(provider: ModelProvider, knowledge: SupportKnowledge) {
	return defineHarness({ name: 'grounded-support' })
		.models({
			assistant: { provider, model: 'approved-chat-model', capabilities: ['object'] },
			embedding: { provider, model: 'approved-embedding-model', capabilities: ['embeddings'] },
		})
		.agent('answerer', {
			model: 'assistant',
			input: z.object({
				question: z.string(),
				evidence: z.array(z.object({ id: z.string(), title: z.string(), excerpt: z.string() })),
			}),
			output: answer,
			instructions: 'Answer only from the supplied evidence and cite every source ID.',
		})
		.workflow('answer_with_evidence', {
			input: question,
			output: answer,
			delegation: { agents: ['answerer'] },
			handler: async ctx => {
				const embedded = await ctx.models.embedding.embed({ input: ctx.input.question }, ctx.signal)
				const evidence = await knowledge.searchAuthorizedArticles({
					tenantId: ctx.input.tenantId,
					vector: embedded.embeddings[0]!.vector,
					limit: 5,
				})
				return ctx.agents.answerer({ question: ctx.input.question, evidence: [...evidence] })
			},
		})
		.build()
}
```

### How the composition keeps retrieval bounded

| Call or field | What it declares | Use it this way |
| --- | --- | --- |
| [`defineHarness({ name })`](/handbook/api/functions/_purista_harness.defineHarness/) | Creates this application-local composition root and assigns a diagnostic name. | Use one stable name for this retrieval boundary; it does not establish tenant authorization or choose a provider. |
| [`.models(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#models) | Two independently named model contracts: `assistant` can produce an object; `embedding` can create vectors. Each alias selects a provider-facing model identifier at the composition boundary. | Keep the aliases separate because chat and embedding models have different capabilities, cost, and access policy. Do not declare `embeddings` on the answerer merely because the workflow performs retrieval. |
| [`capabilities`](/handbook/api/interfaces/_purista_harness.ModelAlias/#capabilities) | `object` permits a schema-bounded agent response; `embeddings` permits `ctx.models.embedding.embed(...)`. | Declare only the operation the model actually performs. Build-time validation rejects an agent/workflow that asks for a capability the selected alias did not declare. |
| [`.agent(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#agent) | Registers the answerer with a schema-validated input/output contract. Omitted `builtinTools` and `tools` fields expose no built-in or custom tool. | Pass only the already-authorized, bounded evidence to this agent. The instruction is a model constraint, not a substitute for tenant checks or citation validation. |
| [`.workflow(...)`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#workflow) | Registers the application-owned orchestration boundary. `input` and `output` validate workflow calls; `delegation.agents` explicitly permits `answerer`; `handler` receives workflow context and the caller's abort signal. | Retrieve before calling the agent so the application—not the model—enforces tenant scope and the evidence limit. Keep the handler as a normal `async` function only when it needs `this`; the shown arrow function needs none. |
| `ctx.models.embedding.embed({ input }, ctx.signal)` | Requests one embedding with the workflow cancellation signal. The response returns vectors in provider order. | Check that at least one vector is present before dereferencing it in a production handler. Keep an embedding timeout below the overall workflow/run budget. |
| `knowledge.searchAuthorizedArticles(...)` | An application port that receives a trusted tenant identity, vector, and explicit limit. | This is the authorization boundary. Never substitute a user-controlled tenant ID or model-returned metadata for a verified caller identity, and do not hand the vector store raw model output as a filter. |
| `ctx.agents.answerer(...)` | Invokes only the workflow-declared child agent and returns its validated output. | This call is coupled to the workflow request. Use a queue/service boundary instead when retrieval or answer generation must outlive the caller. |
| [`.build()`](/handbook/api/interfaces/_purista_harness.HarnessBuilder/#build) | Validates alias capabilities and the completed agent/workflow reference graph, then returns the runnable Harness. | Build after the registries are complete. It rejects missing models or invalid references before a question reaches retrieval or a provider. |

Authorize before retrieval and again before final context assembly; never treat
a session ID or model-returned metadata as a tenant claim. Bound evidence
size/count and use an output schema that carries citation identifiers where the
product needs them. Apply [Guardrails](/handbook/harness/secure-and-govern/guardrails/)
after application retrieval when the retrieved content requires policy inspection.

## Add reranking only when a compatible provider exists

OpenAI and Azure AI Foundry adapters currently implement embeddings; no
first-party Harness adapter currently implements `rerank`. Start with a bounded,
authorized vector search. Add a custom `ModelProvider` that truly implements
`rerank` only when offline relevance evidence shows that it improves results.
Then declare `capabilities: ['rerank']` for that separate alias and keep the
same authorization and evidence limits.

Next: [build agents](/handbook/harness/build-agents/).
